// Test comprehensive assessment fetching - run in browser console
async function testComprehensiveAssessments() {
  const token = localStorage.getItem('token') || localStorage.getItem('auth_token');
  
  console.log('🧪 Testing Comprehensive Assessment Fetching...\n');

  try {
    // Get current user ID from token (simplified)
    const userId = 'current-user-id'; // Replace with actual user ID
    
    console.log('Testing comprehensive endpoint...');
    
    const response = await fetch(`http://localhost:3000/backend/assessments/comprehensive/${userId}`, {
      headers: { 
        'Authorization': `Bearer ${token}`, 
        'Content-Type': 'application/json' 
      }
    });
    
    console.log('Status:', response.status);
    const data = await response.json();
    console.log('Response:', data);
    
    if (response.ok) {
      console.log('✅ Success!');
      console.log('Total assessments:', data.assessments?.length || 0);
      
      data.assessments?.forEach((assessment, index) => {
        console.log(`\nAssessment ${index + 1}:`);
        console.log(`- Title: ${assessment.title}`);
        console.log(`- Questions: ${assessment.questions?.length || 0}`);
        console.log(`- Attempts: ${assessment.attempts?.length || 0}`);
        console.log(`- Course: ${assessment.courses?.title}`);
        console.log(`- Module: ${assessment.modules?.title}`);
        
        if (assessment.questions && assessment.questions.length > 0) {
          console.log(`- First question: ${assessment.questions[0].questionText}`);
        }
      });
    } else {
      console.log('❌ Error:', data.error || data.message);
    }
  } catch (error) {
    console.log('❌ Network error:', error.message);
  }
}

// Run the test
testComprehensiveAssessments();
