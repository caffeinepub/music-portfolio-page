import React from 'react';
import { ExternalLink, Music, Headphones } from 'lucide-react';
import { SiSpotify, SiYoutube, SiApplemusic, SiSoundcloud, SiBandcamp } from 'react-icons/si';
import type { StreamingPlatform } from '../backend';

interface PlatformConfig {
  icon: React.ReactNode;
  bg: string;
  text: string;
  border: string;
  hoverBg: string;
  label: string;
}

function getPlatformConfig(name: string): PlatformConfig {
  const lower = name.toLowerCase();

  if (lower.includes('spotify')) {
    return {
      icon: <SiSpotify className="w-3.5 h-3.5" />,
      bg: 'oklch(0.72 0.2 145 / 0.15)',
      text: 'oklch(0.72 0.2 145)',
      border: 'oklch(0.72 0.2 145 / 0.4)',
      hoverBg: 'oklch(0.72 0.2 145 / 0.25)',
      label: 'Spotify',
    };
  }
  if (lower.includes('youtube')) {
    return {
      icon: <SiYoutube className="w-3.5 h-3.5" />,
      bg: 'oklch(0.62 0.22 25 / 0.15)',
      text: 'oklch(0.62 0.22 25)',
      border: 'oklch(0.62 0.22 25 / 0.4)',
      hoverBg: 'oklch(0.62 0.22 25 / 0.25)',
      label: 'YouTube',
    };
  }
  if (lower.includes('apple')) {
    return {
      icon: <SiApplemusic className="w-3.5 h-3.5" />,
      bg: 'oklch(0.65 0.22 10 / 0.15)',
      text: 'oklch(0.65 0.22 10)',
      border: 'oklch(0.65 0.22 10 / 0.4)',
      hoverBg: 'oklch(0.65 0.22 10 / 0.25)',
      label: 'Apple Music',
    };
  }
  if (lower.includes('soundcloud')) {
    return {
      icon: <SiSoundcloud className="w-3.5 h-3.5" />,
      bg: 'oklch(0.68 0.18 45 / 0.15)',
      text: 'oklch(0.68 0.18 45)',
      border: 'oklch(0.68 0.18 45 / 0.4)',
      hoverBg: 'oklch(0.68 0.18 45 / 0.25)',
      label: 'SoundCloud',
    };
  }
  if (lower.includes('tidal')) {
    return {
      icon: <Headphones className="w-3.5 h-3.5" />,
      bg: 'oklch(0.75 0.01 260 / 0.15)',
      text: 'oklch(0.85 0.01 260)',
      border: 'oklch(0.75 0.01 260 / 0.4)',
      hoverBg: 'oklch(0.75 0.01 260 / 0.25)',
      label: 'Tidal',
    };
  }
  if (lower.includes('deezer')) {
    return {
      icon: <Music className="w-3.5 h-3.5" />,
      bg: 'oklch(0.65 0.18 200 / 0.15)',
      text: 'oklch(0.65 0.18 200)',
      border: 'oklch(0.65 0.18 200 / 0.4)',
      hoverBg: 'oklch(0.65 0.18 200 / 0.25)',
      label: 'Deezer',
    };
  }
  if (lower.includes('amazon')) {
    return {
      icon: <Music className="w-3.5 h-3.5" />,
      bg: 'oklch(0.75 0.14 55 / 0.15)',
      text: 'oklch(0.75 0.14 55)',
      border: 'oklch(0.75 0.14 55 / 0.4)',
      hoverBg: 'oklch(0.75 0.14 55 / 0.25)',
      label: 'Amazon Music',
    };
  }
  if (lower.includes('bandcamp')) {
    return {
      icon: <SiBandcamp className="w-3.5 h-3.5" />,
      bg: 'oklch(0.55 0.15 175 / 0.15)',
      text: 'oklch(0.55 0.15 175)',
      border: 'oklch(0.55 0.15 175 / 0.4)',
      hoverBg: 'oklch(0.55 0.15 175 / 0.25)',
      label: 'Bandcamp',
    };
  }

  // Generic fallback
  return {
    icon: <ExternalLink className="w-3.5 h-3.5" />,
    bg: 'oklch(0.78 0.15 75 / 0.15)',
    text: 'oklch(0.78 0.15 75)',
    border: 'oklch(0.78 0.15 75 / 0.4)',
    hoverBg: 'oklch(0.78 0.15 75 / 0.25)',
    label: name,
  };
}

interface StreamingPlatformButtonsProps {
  platforms: StreamingPlatform[];
}

export function StreamingPlatformButtons({ platforms }: StreamingPlatformButtonsProps) {
  const validPlatforms = platforms.filter((p) => p.url && p.url.trim() !== '');

  if (validPlatforms.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {validPlatforms.map((platform, index) => {
        const config = getPlatformConfig(platform.name);
        return (
          <a
            key={index}
            href={platform.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-semibold font-body tracking-wide transition-all duration-150 hover:scale-105 active:scale-95"
            style={{
              background: config.bg,
              color: config.text,
              border: `1px solid ${config.border}`,
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background = config.hoverBg;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background = config.bg;
            }}
            title={`Listen on ${config.label}`}
          >
            {config.icon}
            <span>{config.label}</span>
          </a>
        );
      })}
    </div>
  );
}
