// Quick test to check your assessment data
// Run this in browser console

async function checkAssessmentData() {
  const token = localStorage.getItem('token') || localStorage.getItem('auth_token');
  
  console.log('🧪 Checking Assessment Data...\n');

  // Test your specific assessment
  const assessmentId = '5c245988-3c69-4bc8-b976-374b19d1bdb1';

  try {
    console.log('Testing assessment with questions...');
    const response = await fetch(`http://localhost:3000/backend/assessments/${assessmentId}/with-questions`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Status:', response.status);
    const data = await response.json();
    console.log('Assessment data:', data);
    
    if (response.ok) {
      console.log('✅ Success!');
      console.log(`Title: ${data.assessment.title}`);
      console.log(`Questions: ${data.questions.length}`);
      
      data.questions.forEach((q, i) => {
        console.log(`\nQuestion ${i+1}: ${q.questionText}`);
        console.log(`Type: ${q.type}, Points: ${q.points}`);
        console.log(`Options: ${q.options.length}`);
        q.options.forEach((opt, j) => {
          console.log(`  ${j}: ${opt.optionText} ${opt.isCorrect ? '(CORRECT)' : ''}`);
        });
      });
    } else {
      console.log('❌ Error:', data.error);
    }
  } catch (error) {
    console.log('❌ Network error:', error.message);
  }
}

// Run the test
checkAssessmentData();
