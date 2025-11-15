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
import { useRegister, useRequestOTP, useVerifyOTP } from '@/lib/hooks/useAuth';

export function SignUpForm() {
  const [method, setMethod] = useState<AuthMethod>('email');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOTP] = useState('');
  const [otpRequested, setOTPRequested] = useState(false);

  const register = useRegister();
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
      register.mutate({ method: 'email', email, password, name });
    } else if (method === 'phone') {
      if (!otpRequested) {
        await handleRequestOTP();
      } else {
        verifyOTP.mutate({ phoneNumber: phone, code: otp });
      }
    }
    // Google is handled by GoogleAuthButton
  };

  const isLoading = register.isPending || requestOTP.isPending || verifyOTP.isPending;
  const error = register.error || requestOTP.error || verifyOTP.error;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>
          Sign up to get started with Streamlined Portal
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
            <>
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  required
                />
              </div>
              <EmailPasswordForm
                email={email}
                password={password}
                onEmailChange={setEmail}
                onPasswordChange={setPassword}
              />
            </>
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

          {/* Submit Button (Email and Phone OTP) */}
          {method !== 'google' && (
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Creating account...' : 'Sign Up'}
            </Button>
          )}
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link href="/signin" className="font-medium text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
