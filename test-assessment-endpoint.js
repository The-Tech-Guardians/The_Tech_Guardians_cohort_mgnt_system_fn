// Test script to verify assessment endpoints
// Run this in browser console on your assessment page

async function testAssessmentEndpoints() {
  const token = localStorage.getItem('token') || localStorage.getItem('auth_token');
  
  if (!token) {
    console.error('No auth token found. Please login first.');
    return;
  }

  console.log('🧪 Testing Assessment Endpoints...\n');

  // Test 1: Check debug questions endpoint
  try {
    console.log('1. Testing debug questions endpoint...');
    const questionsResponse = await fetch('http://localhost:3000/backend/debug/questions', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Status:', questionsResponse.status);
    const questionsData = await questionsResponse.json();
    console.log('Response:', questionsData);
    
    if (questionsResponse.ok) {
      console.log('✅ Debug questions endpoint working');
      console.log(`Found ${questionsData.totalQuestions} questions and ${questionsData.totalOptions} options`);
    } else {
      console.log('❌ Debug questions endpoint failed:', questionsData.error);
    }
  } catch (error) {
    console.log('❌ Debug questions endpoint error:', error.message);
  }

  console.log('\n' + '='.repeat(50) + '\n');

  // Test 2: Add sample questions
  try {
    console.log('2. Adding sample questions...');
    const addResponse = await fetch('http://localhost:3000/backend/debug/add-sample-questions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Status:', addResponse.status);
    const addData = await addResponse.json();
    console.log('Response:', addData);
    
    if (addResponse.ok) {
      console.log('✅ Sample questions added successfully');
      console.log(`Created ${addData.questions.length} questions`);
    } else {
      console.log('❌ Failed to add sample questions:', addData.error);
    }
  } catch (error) {
    console.log('❌ Add sample questions error:', error.message);
  }

  console.log('\n' + '='.repeat(50) + '\n');

  // Test 3: Check specific assessment with questions
  try {
    console.log('3. Testing getAssessmentWithQuestions...');
    const assessmentResponse = await fetch('http://localhost:3000/backend/assessments/72a43fd0-a02e-4fac-8a85-4a5301a92e92/with-questions', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Status:', assessmentResponse.status);
    const assessmentData = await assessmentResponse.json();
    console.log('Response:', assessmentData);
    
    if (assessmentResponse.ok) {
      console.log('✅ getAssessmentWithQuestions working');
      console.log(`Assessment: ${assessmentData.assessment.title}`);
      console.log(`Questions found: ${assessmentData.questions.length}`);
    } else {
      console.log('❌ getAssessmentWithQuestions failed:', assessmentData.error);
    }
  } catch (error) {
    console.log('❌ getAssessmentWithQuestions error:', error.message);
  }

  console.log('\n🏁 Test completed!');
}

// Auto-run the test
testAssessmentEndpoints();
