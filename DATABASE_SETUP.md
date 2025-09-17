# PostgreSQL Setup Guide

## Option 1: Install PostgreSQL Locally (Recommended)

### Windows Installation:

1. **Download PostgreSQL:**
   - Go to https://www.postgresql.org/download/windows/
   - Download the latest version (15 or 16)
   - Run the installer

2. **During Installation:**
   - Remember the superuser (postgres) password you set
   - Default port: 5432
   - Default locale is fine

3. **After Installation:**
   - PostgreSQL should start automatically
   - You can access it via pgAdmin (installed with PostgreSQL)

### Create Database and User:

Open pgAdmin or use psql command line:

```sql
-- Connect as postgres superuser
-- Create database
CREATE DATABASE polling_db;

-- Create user (optional - for better security)
CREATE USER polling_user WITH PASSWORD 'secure_password';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE polling_db TO polling_user;
```

### Update .env file:

**If using postgres superuser:**
```env
DATABASE_URL="postgresql://postgres:YOUR_POSTGRES_PASSWORD@localhost:5432/polling_db"
```

**If you created a specific user:**
```env
DATABASE_URL="postgresql://polling_user:secure_password@localhost:5432/polling_db"
```

## Option 2: Use Docker (Alternative)

If you prefer Docker:

```bash
# Run PostgreSQL in Docker
docker run --name postgres-polling -e POSTGRES_PASSWORD=mypassword -e POSTGRES_DB=polling_db -p 5432:5432 -d postgres:15

# Update .env
DATABASE_URL="postgresql://postgres:mypassword@localhost:5432/polling_db"
```

## Option 3: Use SQLite (Quickest for testing)

If you want to get started immediately, you can temporarily use SQLite:

1. Update `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}
```

2. Update `.env`:
```env
DATABASE_URL="file:./dev.db"
```

**Note:** You'll need to change back to PostgreSQL later for the full challenge requirements.

## Troubleshooting

### Common Issues:

1. **PostgreSQL not running:**
   ```bash
   # Windows - check if service is running
   sc query postgresql-x64-15  # (adjust version number)
   
   # Start service if needed
   net start postgresql-x64-15
   ```

2. **Wrong password:**
   - Check the password you set during PostgreSQL installation
   - Try common defaults: `postgres`, `root`, `admin`

3. **Wrong port:**
   - Default is 5432, but check your PostgreSQL configuration
   - Update the port in DATABASE_URL if different

4. **Database doesn't exist:**
   - Create the `polling_db` database first using pgAdmin or psql

### Test Connection:

You can test your PostgreSQL connection using psql:

```bash
# Test connection
psql -h localhost -p 5432 -U postgres -d polling_db

# Or with the specific user
psql -h localhost -p 5432 -U polling_user -d polling_db
```
