const { body, param, query } = require('express-validator');

// User validation rules
const userValidation = {
  register: [
    body('name')
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('Name must be between 2 and 50 characters')
      .matches(/^[a-zA-Z\s]+$/)
      .withMessage('Name can only contain letters and spaces'),
    
    body('email')
      .isEmail()
      .withMessage('Must be a valid email address')
      .normalizeEmail()
      .isLength({ max: 254 })
      .withMessage('Email must not exceed 254 characters'),
    
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters long')
  ],

  login: [
    body('email')
      .isEmail()
      .withMessage('Must be a valid email address')
      .normalizeEmail(),
    
    body('password')
      .notEmpty()
      .withMessage('Password is required')
  ]
};

// Poll validation rules
const pollValidation = {
  create: [
    body('question')
      .trim()
      .isLength({ min: 10, max: 500 })
      .withMessage('Question must be between 10 and 500 characters'),
    
    body('options')
      .isArray({ min: 2, max: 10 })
      .withMessage('Poll must have between 2 and 10 options'),
    
    body('options.*.text')
      .trim()
      .isLength({ min: 1, max: 200 })
      .withMessage('Each option must be between 1 and 200 characters')
  ],

  getPoll: [
    param('id')
      .isInt({ min: 1 })
      .withMessage('Poll ID must be a positive integer')
  ],

  updatePoll: [
    param('id')
      .isInt({ min: 1 })
      .withMessage('Poll ID must be a positive integer')
  ]
};

// Vote validation rules
const voteValidation = {
  create: [
    body('pollOptionId')
      .isInt({ min: 1 })
      .withMessage('Poll option ID must be a positive integer')
  ]
};

// General validation rules
const generalValidation = {
  pagination: [
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer'),
    
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be between 1 and 100')
  ],

  id: [
    param('id')
      .isInt({ min: 1 })
      .withMessage('ID must be a positive integer')
  ]
};

module.exports = {
  userValidation,
  pollValidation,
  voteValidation,
  generalValidation
};
