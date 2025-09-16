const express = require('express');
const cors = require('cors');
const path = require('path');
const { createServer } = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

// Database connection
const { connectDatabase } = require('./utils/database');

// Import routes
const userRoutes = require('./routes/userRoutes');
const pollRoutes = require('./routes/pollRoutes');
const voteRoutes = require('./routes/voteRoutes');
const { getApiDocumentation } = require('./utils/apiDocs');

const app = express();
const server = createServer(app);

// Socket.IO setup with CORS
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || "http://localhost:3000"
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files for client example
app.use('/client', express.static(path.join(__dirname, '../client-example')));

// Basic route
app.get('/', (req, res) => {
  res.json({
    message: 'Real-Time Polling API Server',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      'API Documentation': '/api',
      'Health Check': '/health',
      'Client Example': '/client'
    }
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API Documentation endpoint
app.get('/api', (req, res) => {
  res.json(getApiDocumentation());
});

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/polls', pollRoutes);
app.use('/api/votes', voteRoutes);

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Handle joining a poll room
  socket.on('join-poll', (pollId) => {
    socket.join(`poll-${pollId}`);
    console.log(`User ${socket.id} joined poll room: poll-${pollId}`);
  });

  // Handle leaving a poll room
  socket.on('leave-poll', (pollId) => {
    socket.leave(`poll-${pollId}`);
    console.log(`User ${socket.id} left poll room: poll-${pollId}`);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

// Make io available to routes
app.set('io', io);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal Server Error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: `Cannot ${req.method} ${req.originalUrl}`
  });
});

const PORT = process.env.PORT || 3000;

// Initialize database connection and start server
async function startServer() {
  try {
    await connectDatabase();
    
    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📊 Real-Time Polling API is ready`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
