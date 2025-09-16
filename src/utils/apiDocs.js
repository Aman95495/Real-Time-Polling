/**
 * API Routes Documentation
 * This file provides an overview of all available API endpoints
 */

const apiRoutes = {
  "Real-Time Polling API": {
    "version": "1.0.0",
    "base_url": "/api",
    "authentication": "Bearer Token (JWT)"
  },
  
  "User Management": {
    "POST /api/users/register": {
      "description": "Register a new user",
      "access": "Public",
      "body": {
        "name": "string (required)",
        "email": "string (required)",
        "password": "string (required, min 8 chars)"
      },
      "response": {
        "user": "object",
        "token": "string"
      }
    },
    
    "POST /api/users/login": {
      "description": "Login user",
      "access": "Public",
      "body": {
        "email": "string (required)",
        "password": "string (required)"
      },
      "response": {
        "user": "object",
        "token": "string"
      }
    },
    
    "GET /api/users/profile": {
      "description": "Get current user's profile",
      "access": "Private",
      "headers": {
        "Authorization": "Bearer <token>"
      },
      "response": {
        "user": "object with stats"
      }
    },
    
    "GET /api/users/polls": {
      "description": "Get current user's polls",
      "access": "Private",
      "query_params": {
        "page": "number (optional, default: 1)",
        "limit": "number (optional, default: 10, max: 100)"
      },
      "response": {
        "polls": "array",
        "pagination": "object"
      }
    }
  },
  
  "Poll Management": {
    "POST /api/polls": {
      "description": "Create a new poll",
      "access": "Private",
      "body": {
        "question": "string (required, 10-500 chars)",
        "options": "array of objects with 'text' field (2-10 options)"
      },
      "response": {
        "poll": "object with options"
      }
    },
    
    "GET /api/polls": {
      "description": "Get all polls",
      "access": "Public (with optional auth)",
      "query_params": {
        "page": "number (optional)",
        "limit": "number (optional)",
        "published": "boolean (optional, filter by published status)"
      },
      "response": {
        "polls": "array with vote counts",
        "pagination": "object"
      }
    },
    
    "GET /api/polls/:id": {
      "description": "Get a specific poll",
      "access": "Public (with optional auth)",
      "response": {
        "poll": "object with detailed vote information"
      }
    },
    
    "PUT /api/polls/:id/publish": {
      "description": "Publish a poll",
      "access": "Private (only poll creator)",
      "response": {
        "poll": "updated poll object"
      }
    },
    
    "DELETE /api/polls/:id": {
      "description": "Delete a poll",
      "access": "Private (only poll creator)",
      "response": {
        "message": "success message"
      }
    }
  },
  
  "Vote Management": {
    "POST /api/votes": {
      "description": "Cast a vote for a poll option",
      "access": "Private",
      "body": {
        "pollOptionId": "number (required)"
      },
      "response": {
        "vote": "object",
        "action": "created or updated"
      },
      "websocket_event": "poll-updated (broadcasted to poll room)"
    },
    
    "DELETE /api/votes/poll/:pollId": {
      "description": "Remove user's vote from a poll",
      "access": "Private",
      "response": {
        "message": "success message"
      },
      "websocket_event": "poll-updated (broadcasted to poll room)"
    },
    
    "GET /api/votes/results/:id": {
      "description": "Get poll results",
      "access": "Public",
      "response": {
        "pollId": "number",
        "question": "string",
        "totalVotes": "number",
        "options": "array with vote counts and percentages"
      }
    },
    
    "GET /api/votes/user": {
      "description": "Get current user's voting history",
      "access": "Private",
      "query_params": {
        "page": "number (optional)",
        "limit": "number (optional)"
      },
      "response": {
        "votes": "array",
        "pagination": "object"
      }
    }
  },
  
  "WebSocket Events": {
    "Client to Server": {
      "join-poll": {
        "description": "Join a specific poll room for real-time updates",
        "data": "pollId (number)"
      },
      "leave-poll": {
        "description": "Leave a poll room",
        "data": "pollId (number)"
      }
    },
    
    "Server to Client": {
      "poll-updated": {
        "description": "Real-time poll results update",
        "data": {
          "pollId": "number",
          "results": "array of options with vote counts",
          "totalVotes": "number",
          "action": "new-vote, vote-changed, or vote-removed",
          "userId": "number"
        }
      }
    }
  },
  
  "Error Responses": {
    "400": "Bad Request - Validation errors or invalid data",
    "401": "Unauthorized - Invalid or missing token",
    "403": "Forbidden - Access denied to resource",
    "404": "Not Found - Resource not found",
    "409": "Conflict - Resource already exists",
    "500": "Internal Server Error - Server error"
  }
};

/**
 * Generate API documentation endpoint response
 */
function getApiDocumentation() {
  return {
    message: 'Real-Time Polling API Documentation',
    documentation: apiRoutes,
    usage: {
      authentication: 'Include "Authorization: Bearer <token>" header for protected routes',
      websocket_url: 'ws://localhost:3000 or wss://your-domain.com',
      content_type: 'application/json'
    }
  };
}

module.exports = {
  apiRoutes,
  getApiDocumentation
};
