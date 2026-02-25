import React from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  resultCount?: number;
  totalCount?: number;
}

export function SearchBar({ value, onChange, placeholder = 'Search by title, artist, album, or genre…', resultCount, totalCount }: SearchBarProps) {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        className="relative flex items-center rounded-sm overflow-hidden transition-all duration-200"
        style={{
          background: 'oklch(0.20 0.01 260)',
          border: value
            ? '1px solid oklch(0.78 0.15 75 / 0.6)'
            : '1px solid oklch(0.28 0.02 260)',
          boxShadow: value ? '0 0 16px oklch(0.78 0.15 75 / 0.15)' : 'none',
        }}
      >
        <Search
          className="absolute left-4 w-5 h-5 flex-shrink-0"
          style={{ color: value ? 'oklch(0.78 0.15 75)' : 'oklch(0.55 0.01 260)' }}
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent pl-12 pr-12 py-4 text-foreground placeholder:text-muted-foreground font-body text-base outline-none"
        />
        {value && (
          <button
            onClick={() => onChange('')}
            className="absolute right-4 p-1 rounded-sm transition-colors hover:text-foreground"
            style={{ color: 'oklch(0.55 0.01 260)' }}
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
      {typeof resultCount === 'number' && typeof totalCount === 'number' && value && (
        <p className="mt-2 text-center text-sm font-body" style={{ color: 'oklch(0.55 0.01 260)' }}>
          Showing{' '}
          <span className="text-gold font-semibold">{resultCount}</span>
          {' '}of{' '}
          <span className="font-semibold text-foreground">{totalCount}</span>
          {' '}tracks
        </p>
      )}
    </div>
  );
}
