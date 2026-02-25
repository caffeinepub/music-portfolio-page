import React, { useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile, useSaveCallerUserProfile } from '../hooks/useQueries';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, User } from 'lucide-react';

export function ProfileSetupModal() {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const { mutateAsync: saveProfile, isPending } = useSaveCallerUserProfile();

  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const showModal = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError('Please enter your name.');
      return;
    }
    setError('');
    try {
      await saveProfile({ name: trimmed });
    } catch (err) {
      setError('Failed to save profile. Please try again.');
    }
  };

  return (
    <Dialog open={showModal}>
      <DialogContent
        className="sm:max-w-md"
        style={{
          background: 'oklch(0.17 0.01 260)',
          border: '1px solid oklch(0.28 0.02 260)',
        }}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div
              className="w-10 h-10 rounded-sm flex items-center justify-center"
              style={{ background: 'oklch(0.78 0.15 75 / 0.15)', border: '1px solid oklch(0.78 0.15 75 / 0.3)' }}
            >
              <User className="w-5 h-5 text-gold" />
            </div>
            <div>
              <DialogTitle className="font-display text-foreground" style={{ fontSize: '1.5rem' }}>
                WELCOME TO LNT
              </DialogTitle>
              <DialogDescription className="font-body text-sm" style={{ color: 'oklch(0.55 0.01 260)' }}>
                MakeItHappen.com
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <p className="font-body text-sm mb-4" style={{ color: 'oklch(0.70 0.01 260)' }}>
          You're in. Enter your name to complete your profile setup.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="profile-name" className="font-body text-sm font-medium text-foreground">
              Your Name
            </Label>
            <Input
              id="profile-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name…"
              disabled={isPending}
              className="font-body"
              style={{
                background: 'oklch(0.22 0.01 260)',
                border: '1px solid oklch(0.35 0.02 260)',
                color: 'oklch(0.97 0.005 260)',
              }}
            />
            {error && (
              <p className="text-xs font-body" style={{ color: 'oklch(0.62 0.22 25)' }}>
                {error}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isPending || !name.trim()}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-sm font-body font-semibold text-sm tracking-wide transition-all disabled:opacity-50"
            style={{
              background: 'oklch(0.78 0.15 75)',
              color: 'oklch(0.10 0.01 260)',
            }}
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving…
              </>
            ) : (
              'Save Profile'
            )}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
