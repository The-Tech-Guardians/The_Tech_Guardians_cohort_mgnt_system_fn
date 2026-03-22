// Test the getAssessmentWithQuestions endpoint directly
// Run this in browser console

async function testQuestionEndpoint() {
  const token = localStorage.getItem('token') || localStorage.getItem('auth_token');
  
  console.log('🧪 Testing getAssessmentWithQuestions endpoint...\n');

  // Test the assessment that we know has questions
  const assessmentId = '5c245988-3c69-4bc8-b976-374b19d1bdb1';
  
  try {
    console.log(`Testing: http://localhost:3000/backend/assessments/${assessmentId}/with-questions`);
    
    const response = await fetch(`http://localhost:3000/backend/assessments/${assessmentId}/with-questions`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Status:', response.status);
    const data = await response.json();
    console.log('Full response:', data);
    
    if (response.ok) {
      console.log('✅ Success!');
      console.log('Assessment:', data.assessment);
      console.log('Questions:', data.questions);
      console.log('Questions count:', data.questions?.length || 0);
    } else {
      console.log('❌ Error:', data.error || data.message);
    }
  } catch (error) {
    console.log('❌ Network error:', error.message);
  }

  // Also test one of the assessments that's showing 0 questions
  console.log('\n' + '='.repeat(50));
  console.log('Testing IQ Test assessment...');
  
  try {
    // First, let's find the IQ Test assessment ID from the debug output
    const iqTestResponse = await fetch('http://localhost:3000/backend/assessments?search=IQ%20Test', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    const iqTestData = await iqTestResponse.json();
    console.log('IQ Test search results:', iqTestData);
    
    if (iqTestData.assessments && iqTestData.assessments.length > 0) {
      const iqTestAssessment = iqTestData.assessments[0];
      console.log('Testing IQ Test with questions:', iqTestAssessment.id);
      
      const iqTestQuestionsResponse = await fetch(`http://localhost:3000/backend/assessments/${iqTestAssessment.id}/with-questions`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const iqTestQuestionsData = await iqTestQuestionsResponse.json();
      console.log('IQ Test questions response:', iqTestQuestionsData);
      console.log('IQ Test questions count:', iqTestQuestionsData.questions?.length || 0);
    }
  } catch (error) {
    console.log('❌ IQ Test error:', error.message);
  }
}

// Run the test
testQuestionEndpoint();
