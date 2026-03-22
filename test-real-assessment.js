// Test script to verify your actual assessment data
// Run this in browser console on your assessment page

async function testRealAssessment() {
  const token = localStorage.getItem('token') || localStorage.getItem('auth_token');
  
  if (!token) {
    console.error('No auth token found. Please login first.');
    return;
  }

  console.log('🧪 Testing Real Assessment Data...\n');

  // Test your specific assessment
  const assessmentId = '5c245988-3c69-4bc8-b976-374b19d1bdb1';

  try {
    console.log('1. Testing getAssessmentWithQuestions with your assessment ID...');
    const response = await fetch(`http://localhost:3000/backend/assessments/${assessmentId}/with-questions`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Status:', response.status);
    const data = await response.json();
    console.log('Response:', data);
    
    if (response.ok) {
      console.log('✅ Assessment data retrieved successfully');
      console.log(`Assessment: ${data.assessment.title}`);
      console.log(`Questions found: ${data.questions.length}`);
      
      // Show question details
      data.questions.forEach((q, index) => {
        console.log(`\nQuestion ${index + 1}:`);
        console.log(`- Text: ${q.questionText}`);
        console.log(`- Type: ${q.type}`);
        console.log(`- Points: ${q.points}`);
        console.log(`- Options: ${q.options.length}`);
        q.options.forEach((opt, optIndex) => {
          console.log(`  ${optIndex}: ${opt.optionText} (Correct: ${opt.isCorrect})`);
        });
      });
    } else {
      console.log('❌ Failed to get assessment:', data.error);
    }
  } catch (error) {
    console.log('❌ Error:', error.message);
  }

  console.log('\n🏁 Test completed!');
}

// Auto-run the test
testRealAssessment();
