const express = require('express');
const router = express.Router();

const pollController = require('../controllers/pollController');
const { authenticateToken, optionalAuth } = require('../middleware/auth');
const { pollValidation, generalValidation } = require('../middleware/validation');

/**
 * @route POST /api/polls
 * @desc Create a new poll
 * @access Private
 */
router.post('/', 
  authenticateToken,
  pollValidation.create,
  pollController.createPoll
);

/**
 * @route GET /api/polls
 * @desc Get all polls
 * @access Public (with optional auth for user-specific data)
 */
router.get('/',
  optionalAuth,
  generalValidation.pagination,
  pollController.getPolls
);

/**
 * @route GET /api/polls/:id
 * @desc Get a specific poll
 * @access Public (with optional auth for user-specific data)
 */
router.get('/:id',
  optionalAuth,
  pollValidation.getPoll,
  pollController.getPoll
);

/**
 * @route PUT /api/polls/:id/publish
 * @desc Publish a poll
 * @access Private (only poll creator)
 */
router.put('/:id/publish',
  authenticateToken,
  pollValidation.updatePoll,
  pollController.publishPoll
);

/**
 * @route DELETE /api/polls/:id
 * @desc Delete a poll
 * @access Private (only poll creator)
 */
router.delete('/:id',
  authenticateToken,
  pollValidation.updatePoll,
  pollController.deletePoll
);

module.exports = router;
