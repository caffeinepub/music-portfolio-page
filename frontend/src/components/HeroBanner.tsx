import React from 'react';
import { Zap } from 'lucide-react';

export function HeroBanner() {
  return (
    <div className="relative w-full overflow-hidden" style={{ height: '320px' }}>
      {/* Background image */}
      <img
        src="/assets/generated/hero-banner.dim_1200x400.png"
        alt="LNT Hero"
        className="absolute inset-0 w-full h-full object-cover"
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = 'none';
        }}
      />
      {/* Dark overlay gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(135deg, oklch(0.08 0.01 260 / 0.95) 0%, oklch(0.12 0.02 260 / 0.78) 50%, oklch(0.08 0.01 260 / 0.92) 100%)',
        }}
      />
      {/* Decorative gold line */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, oklch(0.78 0.15 75), transparent)' }}
      />
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 text-center">
        <div className="flex items-center gap-3 mb-3">
          <Zap className="w-6 h-6 text-gold" />
          <span className="text-gold text-xs font-body font-semibold tracking-[0.4em] uppercase">
            MakeItHappen.com
          </span>
          <Zap className="w-6 h-6 text-gold" />
        </div>
        <h1
          className="font-display text-foreground leading-none mb-3"
          style={{ fontSize: 'clamp(4rem, 14vw, 9rem)', letterSpacing: '0.08em' }}
        >
          LNT
        </h1>
        <div
          className="h-px w-32 mb-3"
          style={{ background: 'linear-gradient(90deg, transparent, oklch(0.78 0.15 75), transparent)' }}
        />
        <p className="text-muted-foreground text-base md:text-lg max-w-xl font-body font-light tracking-wide">
          Stream, discover, and connect — find my latest tracks on your favorite platform
        </p>
      </div>
    </div>
  );
}
