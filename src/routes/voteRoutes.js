const express = require('express');
const router = express.Router();

const voteController = require('../controllers/voteController');
const { authenticateToken } = require('../middleware/auth');
const { voteValidation, generalValidation } = require('../middleware/validation');

/**
 * @route POST /api/votes
 * @desc Cast a vote for a poll option
 * @access Private
 */
router.post('/',
  authenticateToken,
  voteValidation.create,
  voteController.castVote
);

/**
 * @route DELETE /api/votes/poll/:pollId
 * @desc Remove user's vote from a poll
 * @access Private
 */
router.delete('/poll/:pollId',
  authenticateToken,
  generalValidation.id,
  voteController.removeVote
);

/**
 * @route GET /api/votes/results/:id
 * @desc Get poll results
 * @access Public
 */
router.get('/results/:id',
  generalValidation.id,
  voteController.getPollResults
);

/**
 * @route GET /api/votes/user
 * @desc Get current user's voting history
 * @access Private
 */
router.get('/user',
  authenticateToken,
  generalValidation.pagination,
  voteController.getUserVotes
);

module.exports = router;
