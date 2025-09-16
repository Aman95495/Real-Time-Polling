# Real-Time Polling Application

A backend service for a real-time polling application built with Node.js, Express, PostgreSQL, Prisma, and WebSockets.

## Features

- RESTful API for CRUD operations
- Real-time poll results using WebSockets
- PostgreSQL database with Prisma ORM
- User authentication and authorization
- Live vote counting and broadcasting

## Tech Stack

- **Backend**: Node.js with Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Real-time**: Socket.IO
- **Authentication**: JWT

## Project Structure

```
├── src/
│   ├── controllers/     # Request handlers
│   ├── routes/         # API routes
│   ├── middleware/     # Custom middleware
│   ├── utils/          # Utility functions
│   └── server.js       # Main server file
├── prisma/
│   └── schema.prisma   # Database schema
├── .env.example        # Environment variables template
├── package.json
└── README.md
```

## Setup Instructions

### 1. Clone the repository
```bash
git clone <repository-url>
cd real-time-polling
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Setup
```bash
cp .env.example .env
```

Edit `.env` file with your database credentials:
```
DATABASE_URL="postgresql://username:password@localhost:5432/polling_db"
JWT_SECRET="your-secret-key"
PORT=3000
```

### 4. Database Setup
```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Or run migrations (for production)
npm run db:migrate
```

### 5. Run the application
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## API Endpoints

### Users
- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login user
- `GET /api/users/profile` - Get user profile

### Polls
- `POST /api/polls` - Create a new poll
- `GET /api/polls` - Get all polls
- `GET /api/polls/:id` - Get specific poll
- `PUT /api/polls/:id/publish` - Publish a poll

### Votes
- `POST /api/votes` - Cast a vote
- `GET /api/polls/:id/results` - Get poll results

## WebSocket Events

### Client to Server
- `join-poll` - Join a specific poll room
- `leave-poll` - Leave a poll room

### Server to Client
- `poll-updated` - Real-time poll results update
- `new-vote` - New vote notification

## Development

### Database Management
```bash
# View database in browser
npm run db:studio

# Reset database
npx prisma db reset
```

## Testing

Test the API endpoints using tools like Postman or curl. WebSocket functionality can be tested using the browser's developer console.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License
