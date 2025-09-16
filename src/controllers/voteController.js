const { prisma } = require('../utils/database');
const { validationResult } = require('express-validator');

/**
 * Cast a vote for a poll option
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function castVote(req, res) {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { pollOptionId } = req.body;
    const userId = req.user.id;

    // Check if poll option exists and get poll info
    const pollOption = await prisma.pollOption.findUnique({
      where: { id: pollOptionId },
      include: {
        poll: {
          select: {
            id: true,
            question: true,
            isPublished: true,
            creatorId: true
          }
        }
      }
    });

    if (!pollOption) {
      return res.status(404).json({
        error: 'Poll option not found',
        message: 'The specified poll option does not exist'
      });
    }

    // Check if poll is published
    if (!pollOption.poll.isPublished) {
      return res.status(400).json({
        error: 'Poll not published',
        message: 'Cannot vote on unpublished polls'
      });
    }

    // Check if user is trying to vote on their own poll
    if (pollOption.poll.creatorId === userId) {
      return res.status(400).json({
        error: 'Cannot vote on own poll',
        message: 'Poll creators cannot vote on their own polls'
      });
    }

    // Check if user has already voted on this poll
    const existingVotes = await prisma.vote.findMany({
      where: {
        userId: userId,
        pollOption: {
          pollId: pollOption.poll.id
        }
      }
    });

    if (existingVotes.length > 0) {
      // User has already voted on this poll
      const existingVote = existingVotes[0];
      
      if (existingVote.pollOptionId === pollOptionId) {
        return res.status(400).json({
          error: 'Already voted',
          message: 'You have already voted for this option'
        });
      }

      // Update existing vote (change vote to different option)
      const vote = await prisma.$transaction(async (tx) => {
        // Delete old vote
        await tx.vote.delete({
          where: { id: existingVote.id }
        });

        // Create new vote
        return await tx.vote.create({
          data: {
            userId: userId,
            pollOptionId: pollOptionId
          },
          include: {
            pollOption: {
              select: {
                id: true,
                text: true
              }
            }
          }
        });
      });

      // Get updated poll results
      const updatedPoll = await getPollResults(pollOption.poll.id);

      // Emit real-time update
      const io = req.app.get('io');
      io.to(`poll-${pollOption.poll.id}`).emit('poll-updated', {
        pollId: pollOption.poll.id,
        results: updatedPoll.options,
        totalVotes: updatedPoll.totalVotes,
        action: 'vote-changed',
        userId: userId
      });

      return res.json({
        message: 'Vote updated successfully',
        vote,
        action: 'updated'
      });
    }

    // Create new vote
    const vote = await prisma.vote.create({
      data: {
        userId: userId,
        pollOptionId: pollOptionId
      },
      include: {
        pollOption: {
          select: {
            id: true,
            text: true
          }
        }
      }
    });

    // Get updated poll results
    const updatedPoll = await getPollResults(pollOption.poll.id);

    // Emit real-time update
    const io = req.app.get('io');
    io.to(`poll-${pollOption.poll.id}`).emit('poll-updated', {
      pollId: pollOption.poll.id,
      results: updatedPoll.options,
      totalVotes: updatedPoll.totalVotes,
      action: 'new-vote',
      userId: userId
    });

    res.status(201).json({
      message: 'Vote cast successfully',
      vote,
      action: 'created'
    });

  } catch (error) {
    console.error('Cast vote error:', error);
    
    // Handle unique constraint violation (shouldn't happen with our logic, but just in case)
    if (error.code === 'P2002') {
      return res.status(400).json({
        error: 'Already voted',
        message: 'You have already voted for this option'
      });
    }

    res.status(500).json({
      error: 'Failed to cast vote',
      message: 'Internal server error'
    });
  }
}

/**
 * Remove a user's vote from a poll
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function removeVote(req, res) {
  try {
    const { pollId } = req.params;
    const userId = req.user.id;

    // Find user's vote on this poll
    const existingVote = await prisma.vote.findFirst({
      where: {
        userId: userId,
        pollOption: {
          pollId: parseInt(pollId)
        }
      },
      include: {
        pollOption: {
          select: {
            pollId: true
          }
        }
      }
    });

    if (!existingVote) {
      return res.status(404).json({
        error: 'Vote not found',
        message: 'You have not voted on this poll'
      });
    }

    // Delete the vote
    await prisma.vote.delete({
      where: { id: existingVote.id }
    });

    // Get updated poll results
    const updatedPoll = await getPollResults(parseInt(pollId));

    // Emit real-time update
    const io = req.app.get('io');
    io.to(`poll-${pollId}`).emit('poll-updated', {
      pollId: parseInt(pollId),
      results: updatedPoll.options,
      totalVotes: updatedPoll.totalVotes,
      action: 'vote-removed',
      userId: userId
    });

    res.json({
      message: 'Vote removed successfully'
    });

  } catch (error) {
    console.error('Remove vote error:', error);
    res.status(500).json({
      error: 'Failed to remove vote',
      message: 'Internal server error'
    });
  }
}

/**
 * Get poll results
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function getPollResults(pollId, req = null, res = null) {
  try {
    if (req) {
      // Check for validation errors when called as route handler
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Validation failed',
          details: errors.array()
        });
      }
      pollId = parseInt(req.params.id);
    }

    const poll = await prisma.poll.findUnique({
      where: { id: pollId },
      include: {
        options: {
          include: {
            _count: {
              select: { votes: true }
            }
          }
        }
      }
    });

    if (!poll) {
      if (res) {
        return res.status(404).json({
          error: 'Poll not found',
          message: 'The requested poll does not exist'
        });
      }
      throw new Error('Poll not found');
    }

    const totalVotes = poll.options.reduce((sum, option) => sum + option._count.votes, 0);
    
    const pollResults = {
      pollId: poll.id,
      question: poll.question,
      totalVotes,
      options: poll.options.map(option => ({
        id: option.id,
        text: option.text,
        voteCount: option._count.votes,
        percentage: totalVotes > 0 ? Math.round((option._count.votes / totalVotes) * 100) : 0
      }))
    };

    if (res) {
      return res.json(pollResults);
    }

    return pollResults;

  } catch (error) {
    console.error('Get poll results error:', error);
    if (res) {
      return res.status(500).json({
        error: 'Failed to get poll results',
        message: 'Internal server error'
      });
    }
    throw error;
  }
}

/**
 * Get user's voting history
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function getUserVotes(req, res) {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const votes = await prisma.vote.findMany({
      where: { userId },
      include: {
        pollOption: {
          include: {
            poll: {
              select: {
                id: true,
                question: true,
                createdAt: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: parseInt(limit)
    });

    const totalVotes = await prisma.vote.count({
      where: { userId }
    });

    res.json({
      votes: votes.map(vote => ({
        id: vote.id,
        createdAt: vote.createdAt,
        pollOption: {
          id: vote.pollOption.id,
          text: vote.pollOption.text
        },
        poll: vote.pollOption.poll
      })),
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalVotes,
        totalPages: Math.ceil(totalVotes / limit)
      }
    });

  } catch (error) {
    console.error('Get user votes error:', error);
    res.status(500).json({
      error: 'Failed to get user votes',
      message: 'Internal server error'
    });
  }
}

module.exports = {
  castVote,
  removeVote,
  getPollResults,
  getUserVotes
};
