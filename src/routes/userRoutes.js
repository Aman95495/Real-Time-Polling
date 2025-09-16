const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const { authenticateToken } = require('../middleware/auth');
const { userValidation, generalValidation } = require('../middleware/validation');

/**
 * @route POST /api/users/register
 * @desc Register a new user
 * @access Public
 */
router.post('/register', userValidation.register, userController.register);

/**
 * @route POST /api/users/login
 * @desc Login user
 * @access Public
 */
router.post('/login', userValidation.login, userController.login);

/**
 * @route GET /api/users/profile
 * @desc Get current user's profile
 * @access Private
 */
router.get('/profile', authenticateToken, userController.getProfile);

/**
 * @route GET /api/users/polls
 * @desc Get current user's polls
 * @access Private
 */
router.get('/polls', 
  authenticateToken, 
  generalValidation.pagination,
  userController.getUserPolls
);

module.exports = router;
