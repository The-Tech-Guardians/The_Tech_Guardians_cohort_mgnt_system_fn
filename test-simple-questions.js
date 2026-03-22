// Simple test to check if questions are being fetched
// Run this in browser console

async function testSimpleQuestions() {
  const token = localStorage.getItem('token') || localStorage.getItem('auth_token');
  
  console.log('🧪 Testing Simple Questions Fetch...\n');

  try {
    // Test the IQ Test assessment
    const assessmentId = '69bac48ccacde2722c079519';
    
    console.log(`Testing: http://localhost:3000/backend/assessments/${assessmentId}/with-questions`);
    
    const response = await fetch(`http://localhost:3000/backend/assessments/${assessmentId}/with-questions`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Success!');
      console.log('Assessment:', data.assessment?.title);
      console.log('Questions count:', data.questions?.length || 0);
      
      if (data.questions && data.questions.length > 0) {
        console.log('\nFirst question details:');
        console.log('- Question:', data.questions[0].questionText);
        console.log('- Type:', data.questions[0].type);
        console.log('- Points:', data.questions[0].points);
        console.log('- Options count:', data.questions[0].options?.length || 0);
        
        if (data.questions[0].options && data.questions[0].options.length > 0) {
          console.log('\nOptions:');
          data.questions[0].options.forEach((opt, index) => {
            console.log(`  ${index + 1}. ${opt.optionText} (Correct: ${opt.isCorrect})`);
          });
        }
      } else {
        console.log('❌ No questions found in response');
      }
    } else {
      const errorData = await response.json();
      console.log('❌ Error:', errorData);
    }
  } catch (error) {
    console.log('❌ Network error:', error.message);
  }
}

// Run the test
testSimpleQuestions();
