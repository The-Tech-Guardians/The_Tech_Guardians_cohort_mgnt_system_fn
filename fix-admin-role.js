// Fix Admin Role Script
// Run this in browser console to fix the admin user's role

import { authAPI } from './lib/auth.js';

async function fixAdminRole() {
  try {
    console.log('Fixing admin role...');
    const response = await authAPI.fixAdminRole();

    if (response.success) {
      console.log('✅ Admin role fixed successfully!');
      console.log('Response:', response);

      // Clear localStorage to force fresh login
      localStorage.removeItem('user_data');
      localStorage.removeItem('auth_token');

      console.log('🔄 Local storage cleared. Please login again to get updated role.');
      console.log('📝 After logging in, you should see ADMIN role instead of LEARNER.');
    } else {
      console.error('❌ Failed to fix admin role:', response.error || response.message);
    }
  } catch (error) {
    console.error('❌ Error fixing admin role:', error);
  }
}

// Auto-run the fix
fixAdminRole();