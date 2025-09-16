/**
 * Simple API testing script
 * Tests basic functionality of the polling API
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:3000';
let authToken = '';
let testUserId = null;
let testPollId = null;

// Create axios instance with base configuration
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to requests when available
api.interceptors.request.use((config) => {
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }
  return config;
});

async function testAPI() {
  console.log('🧪 Starting API tests...\n');

  try {
    // Test 1: Server health check
    console.log('1️⃣  Testing server health...');
    const healthResponse = await api.get('/health');
    console.log('✅ Server is healthy:', healthResponse.data.status);

    // Test 2: User registration
    console.log('\n2️⃣  Testing user registration...');
    const registerData = {
      name: 'Test User',
      email: `test${Date.now()}@example.com`,
      password: 'TestPassword123!'
    };
    
    const registerResponse = await api.post('/api/users/register', registerData);
    console.log('✅ User registered successfully');
    
    authToken = registerResponse.data.token;
    testUserId = registerResponse.data.user.id;
    console.log('🔑 Auth token received');

    // Test 3: User login
    console.log('\n3️⃣  Testing user login...');
    const loginResponse = await api.post('/api/users/login', {
      email: registerData.email,
      password: registerData.password
    });
    console.log('✅ User login successful');

    // Test 4: Get user profile
    console.log('\n4️⃣  Testing get user profile...');
    const profileResponse = await api.get('/api/users/profile');
    console.log('✅ User profile retrieved:', profileResponse.data.user.name);

    // Test 5: Create a poll
    console.log('\n5️⃣  Testing poll creation...');
    const pollData = {
      question: 'What is your favorite testing framework?',
      options: [
        { text: 'Jest' },
        { text: 'Mocha' },
        { text: 'Cypress' },
        { text: 'Playwright' }
      ]
    };
    
    const createPollResponse = await api.post('/api/polls', pollData);
    console.log('✅ Poll created successfully');
    testPollId = createPollResponse.data.poll.id;

    // Test 6: Get all polls
    console.log('\n6️⃣  Testing get all polls...');
    const pollsResponse = await api.get('/api/polls');
    console.log('✅ Polls retrieved, count:', pollsResponse.data.polls.length);

    // Test 7: Get specific poll
    console.log('\n7️⃣  Testing get specific poll...');
    const specificPollResponse = await api.get(`/api/polls/${testPollId}`);
    console.log('✅ Specific poll retrieved:', specificPollResponse.data.poll.question);

    // Test 8: Publish poll
    console.log('\n8️⃣  Testing publish poll...');
    const publishResponse = await api.put(`/api/polls/${testPollId}/publish`);
    console.log('✅ Poll published successfully');

    // Test 9: Register another user to test voting
    console.log('\n9️⃣  Creating second user for voting test...');
    const voter = {
      name: 'Voter User',
      email: `voter${Date.now()}@example.com`,
      password: 'VoterPassword123!'
    };
    
    const voterRegisterResponse = await api.post('/api/users/register', voter);
    console.log('✅ Voter user created');
    
    // Switch to voter's token
    const voterToken = authToken;
    authToken = voterRegisterResponse.data.token;

    // Test 10: Cast a vote
    console.log('\n🔟 Testing vote casting...');
    
    // Get the poll to find an option ID
    const pollForVoting = await api.get(`/api/polls/${testPollId}`);
    const optionId = pollForVoting.data.poll.options[0].id;
    
    const voteResponse = await api.post('/api/votes', {
      pollOptionId: optionId
    });
    console.log('✅ Vote cast successfully');

    // Test 11: Get poll results
    console.log('\n1️⃣1️⃣ Testing poll results...');
    const resultsResponse = await api.get(`/api/votes/results/${testPollId}`);
    console.log('✅ Poll results retrieved, total votes:', resultsResponse.data.totalVotes);

    // Test 12: Get user voting history
    console.log('\n1️⃣2️⃣ Testing user voting history...');
    const votingHistoryResponse = await api.get('/api/votes/user');
    console.log('✅ Voting history retrieved, votes:', votingHistoryResponse.data.votes.length);

    // Test 13: Test error handling (try to vote again on same poll)
    console.log('\n1️⃣3️⃣ Testing error handling (duplicate vote)...');
    try {
      await api.post('/api/votes', { pollOptionId: optionId });
      console.log('❌ Should have failed with duplicate vote error');
    } catch (error) {
      if (error.response?.status === 400) {
        console.log('✅ Duplicate vote properly rejected');
      } else {
        throw error;
      }
    }

    // Test 14: Test unauthorized access
    console.log('\n1️⃣4️⃣ Testing unauthorized access...');
    const tempToken = authToken;
    authToken = '';
    
    try {
      await api.get('/api/users/profile');
      console.log('❌ Should have failed with unauthorized error');
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Unauthorized access properly rejected');
      } else {
        throw error;
      }
    }
    
    authToken = tempToken;

    console.log('\n🎉 All tests completed successfully!');
    console.log('\n📋 Test Summary:');
    console.log('   ✅ Server health check');
    console.log('   ✅ User registration');
    console.log('   ✅ User login');
    console.log('   ✅ Get user profile');
    console.log('   ✅ Create poll');
    console.log('   ✅ Get all polls');
    console.log('   ✅ Get specific poll');
    console.log('   ✅ Publish poll');
    console.log('   ✅ Create voter user');
    console.log('   ✅ Cast vote');
    console.log('   ✅ Get poll results');
    console.log('   ✅ Get voting history');
    console.log('   ✅ Error handling');
    console.log('   ✅ Authorization check');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    process.exit(1);
  }
}

// Helper function to wait for server
async function waitForServer(retries = 10, delay = 1000) {
  for (let i = 0; i < retries; i++) {
    try {
      await api.get('/health');
      return true;
    } catch (error) {
      if (i === retries - 1) throw error;
      console.log(`⏳ Waiting for server... (attempt ${i + 1}/${retries})`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  return false;
}

// Run tests
async function runTests() {
  try {
    console.log('⏳ Waiting for server to be ready...');
    await waitForServer();
    console.log('🚀 Server is ready, starting tests...\n');
    await testAPI();
  } catch (error) {
    console.error('❌ Failed to connect to server:', error.message);
    console.log('\n💡 Make sure the server is running on http://localhost:3000');
    console.log('   Run: npm run dev');
    process.exit(1);
  }
}

if (require.main === module) {
  runTests();
}

module.exports = { testAPI, waitForServer };
