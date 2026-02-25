import React, { useState } from 'react';
import { Calendar, Disc3, User, Tag } from 'lucide-react';
import { StreamingPlatformButtons } from './StreamingPlatformButtons';
import type { MusicEntry } from '../backend';

interface MusicCardProps {
  entry: MusicEntry;
}

export function MusicCard({ entry }: MusicCardProps) {
  const [imgError, setImgError] = useState(false);

  const coverSrc =
    !imgError && entry.coverImageUrl && entry.coverImageUrl.trim() !== ''
      ? entry.coverImageUrl
      : '/assets/generated/default-cover.dim_400x400.png';

  return (
    <article
      className="card-hover group relative flex flex-col rounded-sm overflow-hidden"
      style={{
        background: 'oklch(0.17 0.01 260)',
        border: '1px solid oklch(0.28 0.02 260)',
        boxShadow: '0 4px 24px oklch(0 0 0 / 0.4)',
      }}
    >
      {/* Cover Image */}
      <div className="relative aspect-square overflow-hidden bg-surface-overlay">
        <img
          src={coverSrc}
          alt={`${entry.title} cover`}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={() => setImgError(true)}
        />
        {/* Overlay gradient on hover */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: 'linear-gradient(to top, oklch(0.08 0.01 260 / 0.8) 0%, transparent 60%)',
          }}
        />
        {/* Genre badge */}
        {entry.genre && (
          <div
            className="absolute top-3 right-3 px-2 py-0.5 rounded-sm text-xs font-semibold font-body tracking-wider uppercase"
            style={{
              background: 'oklch(0.78 0.15 75 / 0.9)',
              color: 'oklch(0.1 0.01 260)',
            }}
          >
            {entry.genre}
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="flex flex-col flex-1 p-4 gap-3">
        {/* Title */}
        <div>
          <h3
            className="font-display text-foreground leading-tight mb-1"
            style={{ fontSize: '1.35rem' }}
            title={entry.title}
          >
            {entry.title}
          </h3>
          {/* Artist */}
          <div className="flex items-center gap-1.5 text-sm font-body" style={{ color: 'oklch(0.78 0.15 75)' }}>
            <User className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="font-medium truncate">{entry.artist}</span>
          </div>
        </div>

        {/* Meta info */}
        <div className="flex flex-wrap gap-x-4 gap-y-1">
          {entry.album && (
            <div className="flex items-center gap-1.5 text-xs font-body" style={{ color: 'oklch(0.55 0.01 260)' }}>
              <Disc3 className="w-3 h-3 flex-shrink-0" />
              <span className="truncate max-w-[120px]" title={entry.album}>{entry.album}</span>
            </div>
          )}
          <div className="flex items-center gap-1.5 text-xs font-body" style={{ color: 'oklch(0.55 0.01 260)' }}>
            <Calendar className="w-3 h-3 flex-shrink-0" />
            <span>{entry.releaseYear.toString()}</span>
          </div>
          {entry.genre && (
            <div className="flex items-center gap-1.5 text-xs font-body" style={{ color: 'oklch(0.55 0.01 260)' }}>
              <Tag className="w-3 h-3 flex-shrink-0" />
              <span>{entry.genre}</span>
            </div>
          )}
        </div>

        {/* Divider */}
        {entry.streamingPlatforms && entry.streamingPlatforms.length > 0 && (
          <div
            className="h-px w-full"
            style={{ background: 'oklch(0.28 0.02 260)' }}
          />
        )}

        {/* Streaming Buttons */}
        <div className="mt-auto">
          <StreamingPlatformButtons platforms={entry.streamingPlatforms || []} />
        </div>
      </div>
    </article>
  );
}
