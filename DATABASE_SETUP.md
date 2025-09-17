# PostgreSQL Setup Guide - Simple & Easy

This guide helps you set up PostgreSQL database on your Windows computer.

## 🎯 What You Need

You need PostgreSQL database to store polls, users, and votes. Don't worry - it's easier than it sounds!

## 📥 Step 1: Download PostgreSQL

1. **Go to:** https://www.postgresql.org/download/windows/
2. **Click:** "Download the installer"
3. **Choose:** Latest version (PostgreSQL 15 or 16)
4. **Download:** The `.exe` file (about 350MB)

## 🚀 Step 2: Install PostgreSQL

1. **Run the downloaded .exe file**
2. **Click "Next"** through the welcome screens
3. **Important:** When asked for a password, choose something you'll remember (like `password123`)
   - Write it down! You'll need this password
4. **Keep default port:** 5432
5. **Keep default locale:** Your country/language
6. **Install:** Click through the rest with default settings

## ✅ Step 3: Verify Installation

After installation completes:
1. **Look for "pgAdmin 4"** in your Start menu
2. **Open pgAdmin 4** - this is your database manager
3. **You should see "PostgreSQL 15" or "PostgreSQL 16"** in the left sidebar

## 📊 Step 4: Create Your Database

1. **In pgAdmin:**
   - Right-click "PostgreSQL 15" → "Connect Server"
   - Enter the password you set during installation
   
2. **Create database:**
   - Right-click "Databases" → "Create" → "Database"
   - Name: `polling_db`
   - Click "Save"

3. **Done!** You should see `polling_db` in your databases list

## 🔧 Step 5: Update Your .env File

Open your `.env` file in the project and update it:

```env
# Replace YOUR_PASSWORD with the password you set during installation
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/polling_db"

JWT_SECRET="my-secret-key-for-jwt-tokens-12345"
PORT=3000
NODE_ENV=development
```

**Example:**
If your password is `password123`, your DATABASE_URL should be:
```env
DATABASE_URL="postgresql://postgres:password123@localhost:5432/polling_db"
```

## 🧪 Step 6: Test the Connection

1. **Open terminal in your project folder**
2. **Run:** `npm run db:push`
   - This creates the tables in your database
3. **Run:** `npm run db:setup`
   - This adds sample data for testing
4. **If successful:** You'll see "✅ Database setup completed successfully!"

## 🎉 You're Done!

Your PostgreSQL database is now ready! You can:
- **Start your server:** `npm start`
- **Run tests:** `npm run test:api`
- **View your data:** Open pgAdmin and explore the `polling_db` database

## 🆘 Troubleshooting

### "Connection failed" error:
1. **Check if PostgreSQL is running:**
   - Open "Services" (Windows + R, type `services.msc`)
   - Look for "postgresql-x64-15" or similar
   - Should say "Running"
   
2. **Check your password:**
   - Make sure the password in `.env` matches what you set during installation
   
3. **Check the database name:**
   - Make sure you created a database called `polling_db`

### Still having issues?
- **Restart PostgreSQL service** in Windows Services
- **Double-check your .env file** for typos
- **Try pgAdmin** - can you connect there with your password?

---

**That's it!** PostgreSQL setup is complete. The advanced Docker/cloud options have been removed to keep this simple and focused on what you actually need.

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
