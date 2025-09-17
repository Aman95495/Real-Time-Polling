# Real-Time Polling Application

A comprehensive backend service for a real-time polling application built with Node.js, Express, PostgreSQL, Prisma, and WebSockets. This project demonstrates modern web development practices including RESTful API design, real-time communication, authentication, and database relationships.

## � Demo Video

**See the application in action!**

[https://github.com/Aman95495/Real-Time-Polling/demo.mp4
](https://github.com/Aman95495/Real-Time-Polling/blob/main/demo.mp4)
> **Watch the demo to see:**
> - Live user registration and authentication
> - Real-time poll creation and voting
> - WebSocket updates across multiple clients
> - Interactive web client with professional UI/UX
> - API testing and validation in action

*The demo showcases all key features including real-time vote counting, authentication flows, and the responsive web interface.*

## �🌟 Features

- **RESTful API** for complete CRUD operations
- **Real-time updates** using Socket.IO WebSockets
- **PostgreSQL database** with Prisma ORM
- **JWT Authentication** and authorization
- **Input validation** and error handling
- **Comprehensive relationships** (one-to-many, many-to-many)
- **Live vote counting** and broadcasting
- **Interactive client example** for testing

## 🛠️ Tech Stack

- **Backend**: Node.js with Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Real-time**: Socket.IO
- **Authentication**: JWT + bcrypt
- **Validation**: express-validator

## 📁 Project Structure

```
real-time-polling/
├── src/
│   ├── controllers/         # Request handlers
│   │   ├── userController.js
│   │   ├── pollController.js
│   │   └── voteController.js
│   ├── routes/             # API routes
│   │   ├── userRoutes.js
│   │   ├── pollRoutes.js
│   │   └── voteRoutes.js
│   ├── middleware/         # Custom middleware
│   │   ├── auth.js
│   │   └── validation.js
│   ├── utils/              # Utility functions
│   │   ├── database.js
│   │   ├── jwt.js
│   │   ├── password.js
│   │   └── apiDocs.js
│   └── server.js           # Main server file
├── prisma/
│   └── schema.prisma       # Database schema
├── scripts/
│   ├── setup-database.js   # Database seeding
│   └── test-api.js         # API testing
├── client-example/
│   └── index.html          # Interactive client
├── .env.example            # Environment template
├── package.json
└── README.md
```

## 🚀 Quick Start

> **🎥 TL;DR: Watch the [demo video](demo.mp4) to see everything working before you start!**

### 1. Clone and Install Dependencies

```bash
git clone https://github.com/Aman95495/Real-Time-Polling.git
cd real-time-polling
npm install
```

### 2. Environment Setup

```bash
cp .env.example .env
```

Edit `.env` file with your database credentials:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/polling_db"
JWT_SECRET="your-secret-key-change-this-in-production"
PORT=3000
NODE_ENV=development
CORS_ORIGIN="http://localhost:3000"
```

### 3. Database Setup

Ensure PostgreSQL is running, then:

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed with sample data
npm run db:setup
```

### 4. Start the Server

```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

Server will be running at `http://localhost:3000`

## 📖 Usage

### 🎬 Live Demo

**Interactive Web Client**: Visit `http://localhost:3000/client` to use the beautiful web interface with real-time updates!

**Demo Features**:
- User registration and login
- Poll creation with multiple options
- Real-time voting with live results
- WebSocket notifications across clients
- Professional UI with animations

### API Endpoints

Visit `http://localhost:3000/api` for complete API documentation.

#### Authentication
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login user
- `GET /api/users/profile` - Get user profile (protected)

#### Polls
- `POST /api/polls` - Create poll (protected)
- `GET /api/polls` - Get all published polls
- `GET /api/polls/:id` - Get specific poll
- `PUT /api/polls/:id/publish` - Publish poll (protected)
- `DELETE /api/polls/:id` - Delete poll (protected)

#### Voting
- `POST /api/votes` - Cast vote (protected)
- `GET /api/votes/results/:id` - Get poll results
- `DELETE /api/votes/poll/:pollId` - Remove vote (protected)
- `GET /api/votes/user` - Get voting history (protected)

### Interactive Client

Visit `http://localhost:3000/client` to use the interactive web client for testing all features including real-time updates.

### Sample Credentials (after running `npm run db:setup`)

- **Email**: `alice@example.com` / **Password**: `password123`
- **Email**: `bob@example.com` / **Password**: `password123`
- **Email**: `charlie@example.com` / **Password**: `password123`

## 🧪 Testing

### Automated API Testing

```bash
# Start server in one terminal
npm run dev

# Run tests in another terminal
npm test:api
```

### Manual Testing with Client

1. Start the server: `npm run dev`
2. Open browser: `http://localhost:3000/client`
3. Login with sample credentials
4. Create polls, vote, and see real-time updates

## 🏗️ Database Schema

The application uses a well-structured PostgreSQL schema with proper relationships:

### Models

- **User**: `id`, `name`, `email`, `passwordHash`
- **Poll**: `id`, `question`, `isPublished`, `creatorId`
- **PollOption**: `id`, `text`, `pollId`
- **Vote**: `id`, `userId`, `pollOptionId`

### Relationships

- **User ↔ Poll**: One-to-Many (User can create many Polls)
- **Poll ↔ PollOption**: One-to-Many (Poll has many Options)
- **User ↔ Vote**: One-to-Many (User can cast many Votes)
- **PollOption ↔ Vote**: One-to-Many (Option can receive many Votes)
- **User ↔ PollOption**: Many-to-Many through Vote (User can vote on many Options)

## ⚡ Real-Time Features

### WebSocket Events

**Client → Server:**
- `join-poll` - Join poll room for updates
- `leave-poll` - Leave poll room

**Server → Client:**
- `poll-updated` - Real-time poll results update

### Live Updates

- Vote counts update instantly for all connected clients
- Percentage calculations update in real-time
- Visual vote bars animate with new data

## 🔒 Security Features

- **JWT Authentication** with secure token handling
- **Password hashing** using bcrypt with salt rounds
- **Input validation** with express-validator
- **CORS protection** with configurable origins
- **SQL injection prevention** through Prisma ORM
- **Authorization checks** for protected resources

## 📊 API Documentation

The API follows RESTful principles with:

- **Consistent response formats**
- **Proper HTTP status codes**
- **Comprehensive error messages**
- **Request/response validation**
- **Authentication middleware**

## 🔧 Development Scripts

```bash
npm run dev          # Start development server
npm run start        # Start production server
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to database
npm run db:migrate   # Run database migrations
npm run db:studio    # Open Prisma Studio
npm run db:setup     # Seed database with sample data
npm run test:api     # Run API tests
npm run setup        # Complete setup (install, generate, push, seed)
```

## 🚀 Deployment

### Prerequisites

1. Node.js 16+ 
2. PostgreSQL database
3. Environment variables configured

### Environment Variables for Production

```env
DATABASE_URL="postgresql://user:pass@host:port/dbname"
JWT_SECRET="strong-random-secret-key"
PORT=3000
NODE_ENV=production
CORS_ORIGIN="https://your-domain.com"
```

### Build and Deploy

```bash
# Install dependencies
npm ci

# Generate Prisma client
npm run db:generate

# Run database migrations
npm run db:migrate

# Start production server
npm start
```

## 🔍 Monitoring and Logging

- Database connection status logging
- Request/response logging in development
- Error handling with detailed messages
- WebSocket connection tracking
- Graceful shutdown handling

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Express.js for the robust web framework
- Prisma for excellent database tooling
- Socket.IO for real-time communication
- PostgreSQL for reliable data storage

---

**Made with ❤️ for Move37 Ventures Backend Developer Challenge**
