import React, { useState, useMemo } from 'react';
import { Music2, Loader2, AlertCircle, Radio } from 'lucide-react';
import { useGetAllEntries } from '../hooks/useQueries';
import { HeroBanner } from '../components/HeroBanner';
import { SearchBar } from '../components/SearchBar';
import { MusicCard } from '../components/MusicCard';
import type { MusicEntry } from '../backend';

function EmptyState({ hasSearch }: { hasSearch: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
      <div
        className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
        style={{ background: 'oklch(0.78 0.15 75 / 0.1)', border: '1px solid oklch(0.78 0.15 75 / 0.2)' }}
      >
        {hasSearch ? (
          <Radio className="w-9 h-9 text-gold" />
        ) : (
          <Music2 className="w-9 h-9 text-gold" />
        )}
      </div>
      <h3 className="font-display text-foreground mb-2" style={{ fontSize: '2rem' }}>
        {hasSearch ? 'NO RESULTS FOUND' : 'NO TRACKS YET'}
      </h3>
      <p className="text-muted-foreground font-body max-w-sm">
        {hasSearch
          ? 'Try a different search term — check the title, artist, album, or genre.'
          : 'Music entries will appear here once they are added to the catalog.'}
      </p>
    </div>
  );
}

function LoadingGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="rounded-sm overflow-hidden animate-pulse"
          style={{ background: 'oklch(0.17 0.01 260)', border: '1px solid oklch(0.28 0.02 260)' }}
        >
          <div className="aspect-square" style={{ background: 'oklch(0.22 0.01 260)' }} />
          <div className="p-4 space-y-3">
            <div className="h-5 rounded-sm" style={{ background: 'oklch(0.22 0.01 260)', width: '75%' }} />
            <div className="h-3 rounded-sm" style={{ background: 'oklch(0.22 0.01 260)', width: '50%' }} />
            <div className="h-3 rounded-sm" style={{ background: 'oklch(0.22 0.01 260)', width: '40%' }} />
            <div className="flex gap-2 pt-2">
              <div className="h-7 w-20 rounded-sm" style={{ background: 'oklch(0.22 0.01 260)' }} />
              <div className="h-7 w-20 rounded-sm" style={{ background: 'oklch(0.22 0.01 260)' }} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function MusicCatalog() {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: entries, isLoading, isError, error } = useGetAllEntries();

  const filteredEntries = useMemo<MusicEntry[]>(() => {
    if (!entries) return [];
    if (!searchTerm.trim()) return entries;

    const term = searchTerm.toLowerCase().trim();
    return entries.filter((entry) => {
      const fields = [entry.title, entry.artist, entry.album, entry.genre ?? ''];
      return fields.some((f) => f.toLowerCase().includes(term));
    });
  }, [entries, searchTerm]);

  return (
    <div>
      {/* Hero */}
      <HeroBanner />

      {/* Main content */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Search */}
        <section className="mb-10">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            resultCount={filteredEntries.length}
            totalCount={entries?.length ?? 0}
          />
        </section>

        {/* Stats bar */}
        {!isLoading && !isError && entries && entries.length > 0 && (
          <div className="flex items-center gap-3 mb-8">
            <div
              className="h-px flex-1"
              style={{ background: 'linear-gradient(90deg, oklch(0.78 0.15 75 / 0.5), transparent)' }}
            />
            <span
              className="text-xs font-body font-semibold tracking-[0.2em] uppercase"
              style={{ color: 'oklch(0.78 0.15 75)' }}
            >
              {searchTerm ? `${filteredEntries.length} tracks` : `${entries.length} tracks`}
            </span>
            <div
              className="h-px flex-1"
              style={{ background: 'linear-gradient(90deg, transparent, oklch(0.78 0.15 75 / 0.5))' }}
            />
          </div>
        )}

        {/* Error state */}
        {isError && (
          <div
            className="flex items-center gap-3 p-4 rounded-sm mb-8"
            style={{ background: 'oklch(0.62 0.22 25 / 0.1)', border: '1px solid oklch(0.62 0.22 25 / 0.3)' }}
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0" style={{ color: 'oklch(0.62 0.22 25)' }} />
            <p className="text-sm font-body text-foreground">
              Failed to load music entries.{' '}
              <span style={{ color: 'oklch(0.55 0.01 260)' }}>
                {error instanceof Error ? error.message : 'Please try again later.'}
              </span>
            </p>
          </div>
        )}

        {/* Loading */}
        {isLoading && <LoadingGrid />}

        {/* Grid */}
        {!isLoading && !isError && (
          <>
            {filteredEntries.length === 0 ? (
              <EmptyState hasSearch={!!searchTerm.trim()} />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredEntries.map((entry) => (
                  <MusicCard key={entry.id.toString()} entry={entry} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
