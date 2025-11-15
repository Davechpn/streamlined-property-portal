'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';

interface PhoneOTPFormProps {
  phone: string;
  onPhoneChange: (phone: string) => void;
  onRequestOTP: () => void;
  isRequestingOTP: boolean;
  otpRequested: boolean;
  phoneError?: string;
}

export function PhoneOTPForm({
  phone,
  onPhoneChange,
  onRequestOTP,
  isRequestingOTP,
  otpRequested,
  phoneError,
}: PhoneOTPFormProps) {
  return (
    <div className="space-y-4">
      {/* Phone Input */}
      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <div className="flex gap-2">
          <Input
            id="phone"
            type="tel"
            placeholder="+1 (555) 000-0000"
            value={phone}
            onChange={(e) => onPhoneChange(e.target.value)}
            className={phoneError ? 'border-destructive' : ''}
            disabled={otpRequested}
          />
          <Button
            type="button"
            onClick={onRequestOTP}
            disabled={isRequestingOTP || otpRequested || !phone}
          >
            {isRequestingOTP ? 'Sending...' : 'Send OTP'}
          </Button>
        </div>
        {phoneError && (
          <p className="text-sm text-destructive">{phoneError}</p>
        )}
      </div>
    </div>
  );
}

interface OTPVerificationProps {
  otp: string;
  onOTPChange: (otp: string) => void;
  onResendOTP: () => void;
  canResend: boolean;
  countdown: number;
  otpError?: string;
}

export function OTPVerification({
  otp,
  onOTPChange,
  onResendOTP,
  canResend,
  countdown,
  otpError,
}: OTPVerificationProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Enter 6-digit code</Label>
        <InputOTP
          maxLength={6}
          value={otp}
          onChange={onOTPChange}
        >
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
        {otpError && (
          <p className="text-sm text-destructive">{otpError}</p>
        )}
      </div>

      {/* Resend OTP */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">
          {countdown > 0 ? `Resend in ${countdown}s` : 'Didn\'t receive code?'}
        </span>
        <Button
          type="button"
          variant="link"
          onClick={onResendOTP}
          disabled={!canResend}
          className="px-0"
        >
          Resend
        </Button>
      </div>
    </div>
  );
}

// Hook for OTP countdown timer
export function useOTPCountdown(initialSeconds = 60) {
  const [countdown, setCountdown] = useState(0);
  const [canResend, setCanResend] = useState(true);

  const startCountdown = () => {
    setCountdown(initialSeconds);
    setCanResend(false);
  };

  useEffect(() => {
    if (countdown <= 0) {
      setCanResend(true);
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  return { countdown, canResend, startCountdown };
}
