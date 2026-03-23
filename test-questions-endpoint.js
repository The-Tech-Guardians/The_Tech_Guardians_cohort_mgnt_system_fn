// Test questions endpoint - run in browser console
async function testQuestions() {
  const token = localStorage.getItem('token') || localStorage.getItem('auth_token');
  const iqTestId = '69bac48ccacde2722c079519';
  
  try {
    const response = await fetch(`http://localhost:3000/backend/assessments/${iqTestId}/with-questions`, {
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
    });
    
    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Questions count:', data.questions?.length || 0);
    console.log('Data:', data);
  } catch (error) {
    console.log('Error:', error.message);
  }
}
testQuestions();
