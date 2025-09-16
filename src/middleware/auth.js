const { verifyToken, extractTokenFromHeader } = require('../utils/jwt');
const { prisma } = require('../utils/database');

/**
 * Middleware to authenticate user using JWT token
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
async function authenticateToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    const token = extractTokenFromHeader(authHeader);
    
    if (!token) {
      return res.status(401).json({
        error: 'Access denied',
        message: 'No token provided'
      });
    }
    
    // Verify token
    const decoded = verifyToken(token);
    
    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true
      }
    });
    
    if (!user) {
      return res.status(401).json({
        error: 'Access denied',
        message: 'User not found'
      });
    }
    
    // Add user to request object
    req.user = user;
    next();
    
  } catch (error) {
    console.error('Authentication error:', error);
    
    if (error.message.includes('expired') || error.message.includes('invalid')) {
      return res.status(401).json({
        error: 'Access denied',
        message: error.message
      });
    }
    
    return res.status(500).json({
      error: 'Authentication failed',
      message: 'Internal server error'
    });
  }
}

/**
 * Optional authentication middleware - doesn't require token but adds user if present
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
async function optionalAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    const token = extractTokenFromHeader(authHeader);
    
    if (!token) {
      req.user = null;
      return next();
    }
    
    // Verify token
    const decoded = verifyToken(token);
    
    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true
      }
    });
    
    req.user = user || null;
    next();
    
  } catch (error) {
    // If token is invalid, just proceed without user
    req.user = null;
    next();
  }
}

module.exports = {
  authenticateToken,
  optionalAuth
};
