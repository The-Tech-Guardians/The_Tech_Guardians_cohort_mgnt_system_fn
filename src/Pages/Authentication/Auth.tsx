
import { useState } from 'react';

import LoginForm from './Components/Login';
import RegisterForm from './Components/Register';
const Auth = () => {

  const [isRegistering, setIsRegistering] = useState(true);
  return (
    <div className="h-screen overflow-hidden bg-gray-200 flex justify-center items-center">
       
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden max-w-4xl w-full mx-4 max-h-[95vh]">
        <div className="flex flex-col items-center p-8 overflow-y-auto max-h-[95vh]">
          
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-bold text-slate-800 mb-2">
              {isRegistering ? 'Create Account' : 'Login'}
            </h1>
            <p className="text-slate-600 text-sm">
              {isRegistering ? 'Already have an account?' : "Don't have an account?"}{' '}
              <a 
                href="#" 
                className="text-teal-600 hover:text-teal-700 font-medium" 
                onClick={(e) => {
                  e.preventDefault();
                  setIsRegistering(prevIsRegistering => !prevIsRegistering);
                }}
              >
                {isRegistering ? 'Log in' : 'Create account'}
              </a>
            </p>
          </div>

          
          <div className="w-full max-w-2xl">
            {isRegistering ? <RegisterForm /> : <LoginForm />}
          </div>
         
        </div>
      </div>
     
    </div>
  );
};

export default Auth;

