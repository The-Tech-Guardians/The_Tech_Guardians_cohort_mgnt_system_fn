"use client"

import { useState, useCallback, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import Logo from '@/components/ui/navbar/Logo';
import OtpVerifyForm from '@/components/banner/auth/Continue-button/OtpVerifyForm';
import MethodSelector from '@/components/banner/auth/role-badge/MethodSelector';
import UserPill from '@/components/banner/auth/audit-note/UserPill';

import { authAPI, tokenManager } from '@/lib/auth';
import { TwoFAMethod, TwoFAStep, OtpStatus } from '@/components/banner/auth/two-fa/types';

const OTP_DURATION = 30;

export default function Verify2FAPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [step, setStep] = useState<TwoFAStep>('otp');
  const [selectedMethod, setSelectedMethod] = useState<TwoFAMethod>('email');
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));  
  const [otpStatus, setOtpStatus] = useState<OtpStatus>('idle');
  const [timeLeft, setTimeLeft] = useState(OTP_DURATION);
  const [canResend, setCanResend] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize from query params
  useEffect(() => {
    const token = searchParams.get('token') || '';
    const userId = searchParams.get('user_id') || '';
    
    if (!token || !userId) {
      router.replace('/login');
      return;
    }

    // Set token
    tokenManager.setToken(token);
    
    // Extract user info from token payload
    try {
      const payloadStr = token.split('.')[1];
      if (!payloadStr) throw new Error('Invalid token');
      interface TokenPayload {
        uuid?: string;
        email?: string;
        firstName?: string;
        lastName?: string;
        role?: string;
      }
      const tokenPayload: TokenPayload = JSON.parse(atob(payloadStr));
      const userData = {
        uuid: tokenPayload.uuid || userId,
        email: tokenPayload.email || '',
        firstName: tokenPayload.firstName || '',
        lastName: tokenPayload.lastName || '',
        role: tokenPayload.role || 'LEARNER'
      };
      tokenManager.setUser(userData);
    } catch (error) {
      console.warn('Failed to parse token payload:', error);
    }
  }, []); // Remove deps to avoid cascading renders

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setTimeLeft(OTP_DURATION);
    setCanResend(false);
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          setCanResend(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  }, []);

  useEffect(() => {
    return () => { 
      if (timerRef.current) clearInterval(timerRef.current); 
    };
  }, []);

  const handleOtpChange = (value: string[], autoSubmit: boolean) => {
    setOtp(value);
    setOtpStatus('idle');
    if (autoSubmit && value.join('').length === 6) {
      setTimeout(() => verifyOTP(value.join('')), 150);
    }
  };

  const verifyOTP = async (code: string) => {
    setOtpStatus('loading');
    try {
      const userData = tokenManager.getUser();
      const response = await authAPI.verify2FA(userData?.email || '', code);
      
      if (response.success) {
        setOtpStatus('success');
        if (timerRef.current) clearInterval(timerRef.current);
        setTimeout(() => {
          const role = tokenManager.getRoleFromToken();
          if (role === 'ADMIN') router.push('/admin');
          else if (role === 'LEARNER') router.push('/learner');
          else router.push('/instructor');
        }, 1500);
      } else {
        setOtpStatus('error');
        setTimeout(() => setOtpStatus('idle'), 2000);
        setOtp(Array(6).fill(''));
      }
    } catch (error) {
      console.error('2FA verification failed:', error);
      setOtpStatus('error');
      setTimeout(() => setOtpStatus('idle'), 2000);
      setOtp(Array(6).fill(''));
    }
  };

  const handleResend = async () => {
    setOtp(Array(6).fill(''));
    setOtpStatus('idle');
    startTimer();
    
    // Call resend endpoint
    try {
      const userData = tokenManager.getUser();
      const userId = userData?.uuid || tokenManager.getUserIdFromToken?.() || '';
      if (userId) {
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
        await fetch(`${API_BASE_URL}/auth/resend-2fa`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: userId })
        });
      }
    } catch (error) {
      console.error('Resend failed:', error);
    }
  };

  const userData = tokenManager.getUser();

  if (isInitializing) {
    return (
      <div className={`min-h-screen bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center`}>
        <div className={`text-white text-xl animate-pulse`}>Loading...</div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-white flex`}>
      <div className={`hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-blue-600 to-cyan-500`}>
        <div className={`absolute inset-0 opacity-[0.08]`} style={{
          backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
          backgroundSize: '28px 28px'
        }} />
        <div className={`absolute -top-20 -right-20 w-72 h-72 rounded-full bg-white/10 blur-3xl`} />
        <div className={`absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-white/10 blur-3xl`} />

        <div className={`relative z-10 flex flex-col justify-between p-12 w-full`}>
          <Logo textMain={`text-white`} />
          <div className={`space-y-8`}>
            <div className={`space-y-3`}>
              <h2 className={`text-4xl font-bold text-white leading-tight pt-4`}>
                Learn together,
                <br />
                <span className={`text-white/75`}>grow together.</span>
              </h2>
            </div>
          </div>
        </div>
      </div>

      <div className={`flex-1 flex items-center justify-center px-6 py-12 bg-[#F9FAFB]`}>
        <div className={`w-full max-w-md`}>
          <div className={`mb-8 text-center`}>
            <h1 className={`text-2xl font-bold text-[#111827]`}>Enter Verification Code</h1>
            <p className={`text-sm text-gray-500 mt-2`}>
              Check your email for the 6-digit code
              {userData?.email && ` sent to ${userData.email}`}
            </p>
          </div>

          <div className={`bg-white rounded-3xl shadow-xl border border-gray-100 p-8 mb-6`}>
            {userData && (
              <UserPill 
                initials={`${(userData.firstName?.[0] || 'U')}${(userData.lastName?.[0] || '')}`.toUpperCase()} 
                name={`${userData.firstName || ''} ${userData.lastName || ''}`.trim() || userData.email || 'User'} 
                email={userData.email || ''} 
                role={userData.role} 
              />
            )}
            
            {step === 'method' ? (
              <MethodSelector 
                selected={selectedMethod}
                onSelect={setSelectedMethod}
                onContinue={() => {
                  setStep('otp');
                  startTimer();
                }} 
              />
            ) : (
              <OtpVerifyForm
                method={selectedMethod}
                otp={otp}
                status={otpStatus}
                timeLeft={timeLeft}
                canResend={canResend}
                onOtpChange={handleOtpChange}
                onVerify={() => verifyOTP(otp.join(''))}
                onResend={handleResend}
                onChangeMethod={() => setStep('method')}
              />
            )}
          </div>

          <button
            onClick={() => router.push('/login')}
            className={`w-full text-sm text-gray-500 hover:text-gray-700 font-medium py-2 transition-colors`}
          >
            ← Back to login
          </button>
        </div>
      </div>
    </div>
  );
}

