'use client';

import { Button } from '@/components/ui/button';

export type AuthMethod = 'email' | 'phone' | 'google';

interface AuthMethodSelectorProps {
  selected: AuthMethod;
  onSelect: (method: AuthMethod) => void;
}

export function AuthMethodSelector({ selected, onSelect }: AuthMethodSelectorProps) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">Choose sign in method</p>
      <div className="flex gap-2">
        <Button
          type="button"
          variant={selected === 'email' ? 'default' : 'outline'}
          onClick={() => onSelect('email')}
          className="flex-1"
        >
          Email
        </Button>
        <Button
          type="button"
          variant={selected === 'phone' ? 'default' : 'outline'}
          onClick={() => onSelect('phone')}
          className="flex-1"
        >
          Phone
        </Button>
        <Button
          type="button"
          variant={selected === 'google' ? 'default' : 'outline'}
          onClick={() => onSelect('google')}
          className="flex-1"
        >
          Google
        </Button>
      </div>
    </div>
  );
}
