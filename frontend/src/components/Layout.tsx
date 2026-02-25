import React from 'react';
import { Navigation } from './Navigation';
import { ProfileSetupModal } from './ProfileSetupModal';
import { Music2 } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'oklch(0.12 0.01 260)' }}>
      <Navigation />
      <ProfileSetupModal />
      <main className="flex-1">
        {children}
      </main>
      <footer
        className="w-full py-8 px-6 mt-auto"
        style={{
          borderTop: '1px solid oklch(0.28 0.02 260)',
          background: 'oklch(0.10 0.01 260)',
        }}
      >
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm font-body" style={{ color: 'oklch(0.45 0.01 260)' }}>
            <Music2 className="w-4 h-4 text-gold" />
            <span>© {new Date().getFullYear()} LNT | MakeItHappen.com. All rights reserved.</span>
          </div>
          <p className="text-sm font-body" style={{ color: 'oklch(0.45 0.01 260)' }}>
            Built with{' '}
            <span className="text-gold">♪</span>
            {' '}using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== 'undefined' ? window.location.hostname : 'lnt-makeitHappen')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold transition-colors hover:text-gold"
              style={{ color: 'oklch(0.55 0.01 260)' }}
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
