'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useRequestPasswordReset, useResetPassword } from '@/lib/hooks/useAuth';
import { CheckCircle2 } from 'lucide-react';

export function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const requestReset = useRequestPasswordReset();
  const resetPassword = useResetPassword();

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    requestReset.mutate({ email });
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      return; // Show error
    }
    if (token) {
      resetPassword.mutate({ token, newPassword });
    }
  };

  // Show success message after request
  if (requestReset.isSuccess && !token) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            Check your email
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            We've sent a password reset link to <strong>{email}</strong>.
          </p>
          <p className="text-sm text-muted-foreground">
            Click the link in the email to reset your password. The link will expire in 1 hour.
          </p>
        </CardContent>
        <CardFooter>
          <Link href="/signin" className="text-sm text-primary hover:underline">
            Back to sign in
          </Link>
        </CardFooter>
      </Card>
    );
  }

  // Token-based reset form
  if (token) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Reset your password</CardTitle>
          <CardDescription>Enter your new password below</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleResetPassword} className="space-y-4">
            {resetPassword.error && (
              <Alert variant="destructive">
                <AlertDescription>
                  {resetPassword.error instanceof Error
                    ? resetPassword.error.message
                    : 'Failed to reset password'}
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              {confirmPassword && newPassword !== confirmPassword && (
                <p className="text-sm text-destructive">Passwords do not match</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={resetPassword.isPending}>
              {resetPassword.isPending ? 'Resetting...' : 'Reset Password'}
            </Button>
          </form>
        </CardContent>
      </Card>
    );
  }

  // Email request form
  return (
    <Card>
      <CardHeader>
        <CardTitle>Reset your password</CardTitle>
        <CardDescription>
          Enter your email and we'll send you a reset link
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleRequestReset} className="space-y-4">
          {requestReset.error && (
            <Alert variant="destructive">
              <AlertDescription>
                {requestReset.error instanceof Error
                  ? requestReset.error.message
                  : 'Failed to send reset email'}
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={requestReset.isPending}>
            {requestReset.isPending ? 'Sending...' : 'Send Reset Link'}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Link href="/signin" className="text-sm text-primary hover:underline">
          Back to sign in
        </Link>
      </CardFooter>
    </Card>
  );
}
