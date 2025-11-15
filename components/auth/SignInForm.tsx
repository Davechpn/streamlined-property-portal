'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AuthMethodSelector, type AuthMethod } from './AuthMethodSelector';
import { EmailPasswordForm } from './EmailPasswordForm';
import { PhoneOTPForm, OTPVerification, useOTPCountdown } from './PhoneOTPForm';
import { GoogleAuthButton } from './GoogleAuthButton';
import { useLogin, useRequestOTP, useVerifyOTP } from '@/lib/hooks/useAuth';

export function SignInForm() {
  const [method, setMethod] = useState<AuthMethod>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOTP] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [otpRequested, setOTPRequested] = useState(false);

  const login = useLogin();
  const requestOTP = useRequestOTP();
  const verifyOTP = useVerifyOTP();
  const { countdown, canResend, startCountdown } = useOTPCountdown();

  const handleRequestOTP = async () => {
    try {
      await requestOTP.mutateAsync({ phoneNumber: phone });
      setOTPRequested(true);
      startCountdown();
    } catch (error) {
      // Error handled by mutation
    }
  };

  const handleResendOTP = async () => {
    await handleRequestOTP();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (method === 'email') {
      login.mutate({ method: 'email', email, password, rememberMe });
    } else if (method === 'phone') {
      if (!otpRequested) {
        await handleRequestOTP();
      } else {
        verifyOTP.mutate({ phoneNumber: phone, code: otp });
      }
    }
    // Google is handled by GoogleAuthButton
  };

  const isLoading = login.isPending || requestOTP.isPending || verifyOTP.isPending;
  const error = login.error || requestOTP.error || verifyOTP.error;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Welcome back</CardTitle>
        <CardDescription>
          Sign in to your Streamlined Portal account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Method Selector */}
          <AuthMethodSelector selected={method} onSelect={setMethod} />

          {/* Error Alert */}
          {error && (
            <Alert variant="destructive">
              <AlertDescription>
                {error instanceof Error ? error.message : 'An error occurred'}
              </AlertDescription>
            </Alert>
          )}

          {/* Email/Password Form */}
          {method === 'email' && (
            <EmailPasswordForm
              email={email}
              password={password}
              onEmailChange={setEmail}
              onPasswordChange={setPassword}
              showRememberMe
              rememberMe={rememberMe}
              onRememberMeChange={setRememberMe}
            />
          )}

          {/* Phone/OTP Form */}
          {method === 'phone' && !otpRequested && (
            <PhoneOTPForm
              phone={phone}
              onPhoneChange={setPhone}
              onRequestOTP={handleRequestOTP}
              isRequestingOTP={requestOTP.isPending}
              otpRequested={otpRequested}
            />
          )}

          {/* OTP Verification */}
          {method === 'phone' && otpRequested && (
            <OTPVerification
              otp={otp}
              onOTPChange={setOTP}
              onResendOTP={handleResendOTP}
              canResend={canResend}
              countdown={countdown}
            />
          )}

          {/* Google OAuth */}
          {method === 'google' && (
            <GoogleAuthButton />
          )}

          {/* Forgot Password Link (Email only) */}
          {method === 'email' && (
            <div className="flex justify-end">
              <Link
                href="/reset-password"
                className="text-sm text-primary hover:underline"
              >
                Forgot password?
              </Link>
            </div>
          )}

          {/* Submit Button (Email and Phone OTP) */}
          {method !== 'google' && (
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          )}
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          Don't have an account?{' '}
          <Link href="/signup" className="font-medium text-primary hover:underline">
            Sign up
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
