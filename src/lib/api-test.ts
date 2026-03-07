// API Test Utility - Add this to verify your backend is working

const API_URL = 'http://localhost:3001/api';

export async function testBackendConnection() {
  console.log('🔍 Testing backend connection...\n');

  try {
    // Test 1: Basic connectivity
    console.log('Test 1: Basic connectivity to backend');
    const response = await fetch(`${API_URL}/auth/test`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    console.log('✅ Backend responding:\n', data, '\n');
  } catch (error) {
    console.error('❌ Failed to connect to backend:\n', error);
    console.log('   Make sure backend is running on http://localhost:3000\n');
    return false;
  }

  try {
    // Test 2: Get courses (without auth - should work or give auth error)
    console.log('Test 2: Fetching courses (may require auth)');
    const response = await fetch(`${API_URL}/courses`);
    const data = await response.json();
    
    if (response.ok) {
      const courseCount = data.courses?.length || data.length || 0;
      console.log(`✅ Courses endpoint working. Found ${courseCount} courses\n`);
    } else {
      console.log('⚠️  Auth required or endpoint error (this is expected)');
      console.log('   Response:', data, '\n');
    }
  } catch (error) {
    console.error('❌ Error calling courses endpoint:\n', error, '\n');
  }

  console.log('✅ Backend connectivity test complete!');
  console.log('   If you see this, backend is responding with JSON (not HTML error pages)');
}

// Call this in a component or browser console:
// import { testBackendConnection } from '@/lib/api-test';
// testBackendConnection();

export async function testAuthFlow() {
  console.log('\n🔐 Testing authentication flow...\n');

  try {
    // Test with dummy credentials
    const response = await fetch(`${API_URL}/auth/Login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'wrongpassword'
      })
    });

    const data = await response.json();
    console.log('Auth endpoint response:', data);
    console.log('✅ Auth endpoint responding with JSON\n');
  } catch (error) {
    console.error('❌ Auth endpoint error:\n', error, '\n');
  }
}

export async function testAllEndpoints() {
  console.log('\n📋 Testing all major endpoints...\n');

  const endpoints = [
    { method: 'GET', path: '/courses', auth: true },
    { method: 'GET', path: '/modules', auth: true },
    { method: 'GET', path: '/lessons', auth: true },
    { method: 'GET', path: '/assessments', auth: true },
    { method: 'GET', path: '/users', auth: true },
  ];

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(`${API_URL}${endpoint.path}`, {
        method: endpoint.method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer dummy-token`
        }
      });

      const status = response.ok ? '✅' : '⚠️';
      console.log(`${status} ${endpoint.method} ${endpoint.path} - Status: ${response.status}`);
    } catch (error) {
      console.log(`❌ ${endpoint.method} ${endpoint.path} - Error connecting`);
    }
  }
  console.log('\nEndpoint testing complete!\n');
}
