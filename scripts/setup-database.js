/**
 * Database setup and seeding script
 * Run this script to set up the database with sample data
 */

const { prisma, connectDatabase, disconnectDatabase } = require('../src/utils/database');
const { hashPassword } = require('../src/utils/password');

async function setupDatabase() {
  try {
    console.log('🔄 Setting up database...');
    
    // Connect to database
    await connectDatabase();
    
    // Clear existing data (be careful in production!)
    console.log('🗑️  Clearing existing data...');
    await prisma.vote.deleteMany({});
    await prisma.pollOption.deleteMany({});
    await prisma.poll.deleteMany({});
    await prisma.user.deleteMany({});
    
    // Create sample users
    console.log('👥 Creating sample users...');
    const users = await Promise.all([
      prisma.user.create({
        data: {
          name: 'Alice Johnson',
          email: 'alice@example.com',
          passwordHash: await hashPassword('password123')
        }
      }),
      prisma.user.create({
        data: {
          name: 'Bob Smith',
          email: 'bob@example.com',
          passwordHash: await hashPassword('password123')
        }
      }),
      prisma.user.create({
        data: {
          name: 'Charlie Brown',
          email: 'charlie@example.com',
          passwordHash: await hashPassword('password123')
        }
      })
    ]);
    
    console.log(`✅ Created ${users.length} users`);
    
    // Create sample polls
    console.log('📊 Creating sample polls...');
    
    const poll1 = await prisma.poll.create({
      data: {
        question: 'What is your favorite programming language?',
        isPublished: true,
        creatorId: users[0].id,
        options: {
          create: [
            { text: 'JavaScript' },
            { text: 'Python' },
            { text: 'Java' },
            { text: 'TypeScript' },
            { text: 'Go' }
          ]
        }
      },
      include: { options: true }
    });
    
    const poll2 = await prisma.poll.create({
      data: {
        question: 'Which database do you prefer for web applications?',
        isPublished: true,
        creatorId: users[1].id,
        options: {
          create: [
            { text: 'PostgreSQL' },
            { text: 'MongoDB' },
            { text: 'MySQL' },
            { text: 'Redis' }
          ]
        }
      },
      include: { options: true }
    });
    
    const poll3 = await prisma.poll.create({
      data: {
        question: 'What is the best way to learn programming?',
        isPublished: false,
        creatorId: users[2].id,
        options: {
          create: [
            { text: 'Online courses' },
            { text: 'Books' },
            { text: 'Practice projects' },
            { text: 'Coding bootcamps' }
          ]
        }
      },
      include: { options: true }
    });
    
    console.log('✅ Created 3 sample polls');
    
    // Create sample votes
    console.log('🗳️  Creating sample votes...');
    
    // Alice votes on Bob's database poll
    await prisma.vote.create({
      data: {
        userId: users[0].id,
        pollOptionId: poll2.options[0].id // PostgreSQL
      }
    });
    
    // Bob votes on Alice's programming language poll
    await prisma.vote.create({
      data: {
        userId: users[1].id,
        pollOptionId: poll1.options[1].id // Python
      }
    });
    
    // Charlie votes on Alice's programming language poll
    await prisma.vote.create({
      data: {
        userId: users[2].id,
        pollOptionId: poll1.options[0].id // JavaScript
      }
    });
    
    // Charlie votes on Bob's database poll
    await prisma.vote.create({
      data: {
        userId: users[2].id,
        pollOptionId: poll2.options[0].id // PostgreSQL
      }
    });
    
    console.log('✅ Created sample votes');
    
    // Display summary
    const userCount = await prisma.user.count();
    const pollCount = await prisma.poll.count();
    const voteCount = await prisma.vote.count();
    
    console.log('\n🎉 Database setup completed!');
    console.log('📈 Summary:');
    console.log(`   Users: ${userCount}`);
    console.log(`   Polls: ${pollCount}`);
    console.log(`   Votes: ${voteCount}`);
    
    console.log('\n👤 Sample users (password: password123):');
    users.forEach(user => {
      console.log(`   - ${user.name} (${user.email})`);
    });
    
  } catch (error) {
    console.error('❌ Database setup failed:', error);
  } finally {
    await disconnectDatabase();
  }
}

// Run the setup
if (require.main === module) {
  setupDatabase();
}

module.exports = { setupDatabase };
