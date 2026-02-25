import React, { useState } from 'react';
import { Link, useRouter } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { Shield, LogIn, LogOut, Menu, X, Music2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Navigation() {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();

  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === 'logging-in';

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
    } else {
      try {
        await login();
      } catch (error: any) {
        if (error?.message === 'User is already authenticated') {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  const currentPath = router.state.location.pathname;

  return (
    <nav
      className="sticky top-0 z-50 w-full"
      style={{
        background: 'oklch(0.10 0.01 260 / 0.97)',
        borderBottom: '1px solid oklch(0.28 0.02 260)',
        backdropFilter: 'blur(12px)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src="/assets/generated/lnt-logo.dim_400x120.png"
              alt="LNT"
              className="h-8 w-auto object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
            <div className="flex flex-col leading-none">
              <span
                className="font-display text-xl tracking-widest"
                style={{ color: 'oklch(0.78 0.15 75)' }}
              >
                LNT
              </span>
              <span
                className="font-body text-xs tracking-[0.15em] uppercase"
                style={{ color: 'oklch(0.55 0.01 260)' }}
              >
                MakeItHappen.com
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className="flex items-center gap-2 font-body text-sm font-medium tracking-wide transition-colors"
              style={{
                color: currentPath === '/' ? 'oklch(0.78 0.15 75)' : 'oklch(0.70 0.01 260)',
              }}
            >
              <Music2 className="w-4 h-4" />
              Music
            </Link>

            {isAuthenticated && (
              <Link
                to="/admin"
                className="flex items-center gap-2 font-body text-sm font-medium tracking-wide transition-colors"
                style={{
                  color: currentPath === '/admin' ? 'oklch(0.78 0.15 75)' : 'oklch(0.70 0.01 260)',
                }}
              >
                <Shield className="w-4 h-4" />
                Admin
              </Link>
            )}

            <button
              onClick={handleAuth}
              disabled={isLoggingIn}
              className="flex items-center gap-2 px-4 py-2 rounded-sm font-body text-sm font-semibold tracking-wide transition-all disabled:opacity-50"
              style={{
                background: isAuthenticated
                  ? 'oklch(0.22 0.01 260)'
                  : 'oklch(0.78 0.15 75)',
                color: isAuthenticated
                  ? 'oklch(0.70 0.01 260)'
                  : 'oklch(0.10 0.01 260)',
                border: isAuthenticated
                  ? '1px solid oklch(0.35 0.02 260)'
                  : '1px solid transparent',
              }}
            >
              {isLoggingIn ? (
                <>
                  <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Logging in…
                </>
              ) : isAuthenticated ? (
                <>
                  <LogOut className="w-4 h-4" />
                  Logout
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  Login
                </>
              )}
            </button>
          </div>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden p-2 rounded-sm transition-colors"
            style={{ color: 'oklch(0.70 0.01 260)' }}
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div
          className="md:hidden px-4 pb-4 pt-2 flex flex-col gap-3"
          style={{ borderTop: '1px solid oklch(0.22 0.01 260)' }}
        >
          <Link
            to="/"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-2 py-2 font-body text-sm font-medium"
            style={{ color: currentPath === '/' ? 'oklch(0.78 0.15 75)' : 'oklch(0.70 0.01 260)' }}
          >
            <Music2 className="w-4 h-4" />
            Music
          </Link>

          {isAuthenticated && (
            <Link
              to="/admin"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 py-2 font-body text-sm font-medium"
              style={{ color: currentPath === '/admin' ? 'oklch(0.78 0.15 75)' : 'oklch(0.70 0.01 260)' }}
            >
              <Shield className="w-4 h-4" />
              Admin
            </Link>
          )}

          <button
            onClick={() => { handleAuth(); setMobileOpen(false); }}
            disabled={isLoggingIn}
            className="flex items-center gap-2 py-2 px-4 rounded-sm font-body text-sm font-semibold w-full justify-center transition-all disabled:opacity-50"
            style={{
              background: isAuthenticated ? 'oklch(0.22 0.01 260)' : 'oklch(0.78 0.15 75)',
              color: isAuthenticated ? 'oklch(0.70 0.01 260)' : 'oklch(0.10 0.01 260)',
            }}
          >
            {isLoggingIn ? (
              <>
                <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Logging in…
              </>
            ) : isAuthenticated ? (
              <>
                <LogOut className="w-4 h-4" />
                Logout
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                Login
              </>
            )}
          </button>
        </div>
      )}
    </nav>
  );
}
