const { prisma } = require('../utils/database');
const { validationResult } = require('express-validator');

/**
 * Create a new poll
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function createPoll(req, res) {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { question, options } = req.body;
    const userId = req.user.id;

    // Remove duplicate options
    const uniqueOptions = [...new Set(options.map(opt => opt.text))];
    
    if (uniqueOptions.length !== options.length) {
      return res.status(400).json({
        error: 'Duplicate options',
        message: 'Poll options must be unique'
      });
    }

    // Create poll with options in a transaction
    const poll = await prisma.$transaction(async (tx) => {
      // Create the poll
      const newPoll = await tx.poll.create({
        data: {
          question,
          creatorId: userId
        }
      });

      // Create poll options
      const pollOptions = await Promise.all(
        options.map((option) =>
          tx.pollOption.create({
            data: {
              text: option.text.trim(),
              pollId: newPoll.id
            }
          })
        )
      );

      return {
        ...newPoll,
        options: pollOptions
      };
    });

    res.status(201).json({
      message: 'Poll created successfully',
      poll
    });

  } catch (error) {
    console.error('Create poll error:', error);
    res.status(500).json({
      error: 'Failed to create poll',
      message: 'Internal server error'
    });
  }
}

/**
 * Get all polls
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function getPolls(req, res) {
  try {
    const { page = 1, limit = 10, published } = req.query;
    const skip = (page - 1) * limit;

    // Build where clause
    const whereClause = {};
    if (published !== undefined) {
      whereClause.isPublished = published === 'true';
    }

    const polls = await prisma.poll.findMany({
      where: whereClause,
      include: {
        creator: {
          select: {
            id: true,
            name: true
          }
        },
        options: {
          include: {
            _count: {
              select: { votes: true }
            }
          }
        },
        _count: {
          select: { options: true }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: parseInt(limit)
    });

    const totalPolls = await prisma.poll.count({ where: whereClause });

    res.json({
      polls: polls.map(poll => ({
        ...poll,
        optionsCount: poll._count.options,
        totalVotes: poll.options.reduce((sum, option) => sum + option._count.votes, 0),
        options: poll.options.map(option => ({
          ...option,
          voteCount: option._count.votes
        }))
      })),
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalPolls,
        totalPages: Math.ceil(totalPolls / limit)
      }
    });

  } catch (error) {
    console.error('Get polls error:', error);
    res.status(500).json({
      error: 'Failed to get polls',
      message: 'Internal server error'
    });
  }
}

/**
 * Get a specific poll by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function getPoll(req, res) {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { id } = req.params;
    const userId = req.user?.id;

    const poll = await prisma.poll.findUnique({
      where: { id: parseInt(id) },
      include: {
        creator: {
          select: {
            id: true,
            name: true
          }
        },
        options: {
          include: {
            _count: {
              select: { votes: true }
            },
            votes: userId ? {
              where: { userId },
              select: { id: true }
            } : false
          }
        }
      }
    });

    if (!poll) {
      return res.status(404).json({
        error: 'Poll not found',
        message: 'The requested poll does not exist'
      });
    }

    // Calculate total votes and user's vote status
    const totalVotes = poll.options.reduce((sum, option) => sum + option._count.votes, 0);
    
    const pollWithVoteInfo = {
      ...poll,
      totalVotes,
      options: poll.options.map(option => ({
        id: option.id,
        text: option.text,
        voteCount: option._count.votes,
        percentage: totalVotes > 0 ? Math.round((option._count.votes / totalVotes) * 100) : 0,
        hasUserVoted: userId ? option.votes?.length > 0 : false
      }))
    };

    res.json({ poll: pollWithVoteInfo });

  } catch (error) {
    console.error('Get poll error:', error);
    res.status(500).json({
      error: 'Failed to get poll',
      message: 'Internal server error'
    });
  }
}

/**
 * Publish a poll
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function publishPoll(req, res) {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { id } = req.params;
    const userId = req.user.id;

    // Check if poll exists and belongs to user
    const existingPoll = await prisma.poll.findUnique({
      where: { id: parseInt(id) },
      include: {
        options: true
      }
    });

    if (!existingPoll) {
      return res.status(404).json({
        error: 'Poll not found',
        message: 'The requested poll does not exist'
      });
    }

    if (existingPoll.creatorId !== userId) {
      return res.status(403).json({
        error: 'Access denied',
        message: 'You can only publish your own polls'
      });
    }

    if (existingPoll.isPublished) {
      return res.status(400).json({
        error: 'Poll already published',
        message: 'This poll has already been published'
      });
    }

    if (existingPoll.options.length < 2) {
      return res.status(400).json({
        error: 'Insufficient options',
        message: 'Poll must have at least 2 options to be published'
      });
    }

    // Publish the poll
    const poll = await prisma.poll.update({
      where: { id: parseInt(id) },
      data: { isPublished: true },
      include: {
        creator: {
          select: {
            id: true,
            name: true
          }
        },
        options: true
      }
    });

    res.json({
      message: 'Poll published successfully',
      poll
    });

  } catch (error) {
    console.error('Publish poll error:', error);
    res.status(500).json({
      error: 'Failed to publish poll',
      message: 'Internal server error'
    });
  }
}

/**
 * Delete a poll
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function deletePoll(req, res) {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { id } = req.params;
    const userId = req.user.id;

    // Check if poll exists and belongs to user
    const existingPoll = await prisma.poll.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingPoll) {
      return res.status(404).json({
        error: 'Poll not found',
        message: 'The requested poll does not exist'
      });
    }

    if (existingPoll.creatorId !== userId) {
      return res.status(403).json({
        error: 'Access denied',
        message: 'You can only delete your own polls'
      });
    }

    // Delete the poll (cascade will delete options and votes)
    await prisma.poll.delete({
      where: { id: parseInt(id) }
    });

    res.json({
      message: 'Poll deleted successfully'
    });

  } catch (error) {
    console.error('Delete poll error:', error);
    res.status(500).json({
      error: 'Failed to delete poll',
      message: 'Internal server error'
    });
  }
}

module.exports = {
  createPoll,
  getPolls,
  getPoll,
  publishPoll,
  deletePoll
};
