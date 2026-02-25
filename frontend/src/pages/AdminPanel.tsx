import React, { useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetAllEntries, useAddMusicEntry, useDeleteMusicEntry } from '../hooks/useQueries';
import type { StreamingPlatform } from '../backend';
import {
  Plus,
  Trash2,
  Loader2,
  LogIn,
  Shield,
  Music2,
  Link as LinkIcon,
  X,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

// ─── Platform Link Row ────────────────────────────────────────────────────────

interface PlatformRowProps {
  platform: StreamingPlatform;
  index: number;
  onChange: (index: number, field: keyof StreamingPlatform, value: string) => void;
  onRemove: (index: number) => void;
  canRemove: boolean;
}

function PlatformRow({ platform, index, onChange, onRemove, canRemove }: PlatformRowProps) {
  return (
    <div className="flex gap-2 items-start">
      <div className="flex-1 grid grid-cols-2 gap-2">
        <Input
          placeholder="Platform (e.g. Spotify)"
          value={platform.name}
          onChange={(e) => onChange(index, 'name', e.target.value)}
          className="font-body text-sm"
          style={{
            background: 'oklch(0.22 0.01 260)',
            border: '1px solid oklch(0.35 0.02 260)',
            color: 'oklch(0.97 0.005 260)',
          }}
        />
        <Input
          placeholder="https://..."
          value={platform.url}
          onChange={(e) => onChange(index, 'url', e.target.value)}
          className="font-body text-sm"
          style={{
            background: 'oklch(0.22 0.01 260)',
            border: '1px solid oklch(0.35 0.02 260)',
            color: 'oklch(0.97 0.005 260)',
          }}
        />
      </div>
      {canRemove && (
        <button
          type="button"
          onClick={() => onRemove(index)}
          className="mt-1 p-2 rounded-sm transition-colors hover:opacity-80"
          style={{ color: 'oklch(0.62 0.22 25)', background: 'oklch(0.62 0.22 25 / 0.1)' }}
          aria-label="Remove platform"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

// ─── Add Entry Form ───────────────────────────────────────────────────────────

const EMPTY_PLATFORM: StreamingPlatform = { name: '', url: '' };

function AddEntryForm() {
  const { mutateAsync: addEntry, isPending } = useAddMusicEntry();

  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [album, setAlbum] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [releaseYear, setReleaseYear] = useState('');
  const [genre, setGenre] = useState('');
  const [platforms, setPlatforms] = useState<StreamingPlatform[]>([{ ...EMPTY_PLATFORM }]);
  const [formError, setFormError] = useState('');

  const handlePlatformChange = (index: number, field: keyof StreamingPlatform, value: string) => {
    setPlatforms((prev) => prev.map((p, i) => (i === index ? { ...p, [field]: value } : p)));
  };

  const handleAddPlatform = () => {
    setPlatforms((prev) => [...prev, { ...EMPTY_PLATFORM }]);
  };

  const handleRemovePlatform = (index: number) => {
    setPlatforms((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!title.trim() || !artist.trim() || !album.trim()) {
      setFormError('Title, artist, and album are required.');
      return;
    }

    const year = parseInt(releaseYear, 10);
    if (!releaseYear || isNaN(year) || year < 1900 || year > 2100) {
      setFormError('Please enter a valid release year (1900–2100).');
      return;
    }

    const validPlatforms = platforms.filter((p) => p.name.trim() && p.url.trim());

    try {
      await addEntry({
        title: title.trim(),
        artist: artist.trim(),
        album: album.trim(),
        coverImageUrl: coverImageUrl.trim(),
        releaseYear: BigInt(year),
        genre: genre.trim() || null,
        platforms: validPlatforms,
      });

      // Reset form
      setTitle('');
      setArtist('');
      setAlbum('');
      setCoverImageUrl('');
      setReleaseYear('');
      setGenre('');
      setPlatforms([{ ...EMPTY_PLATFORM }]);
      toast.success('Entry added successfully!');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to add entry.';
      setFormError(msg);
      toast.error('Failed to add entry.');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-sm p-6 flex flex-col gap-5"
      style={{
        background: 'oklch(0.17 0.01 260)',
        border: '1px solid oklch(0.28 0.02 260)',
      }}
    >
      <div className="flex items-center gap-3 mb-1">
        <div
          className="w-8 h-8 rounded-sm flex items-center justify-center"
          style={{ background: 'oklch(0.78 0.15 75 / 0.15)', border: '1px solid oklch(0.78 0.15 75 / 0.3)' }}
        >
          <Plus className="w-4 h-4 text-gold" />
        </div>
        <h2 className="font-display text-foreground" style={{ fontSize: '1.5rem' }}>
          ADD NEW ENTRY
        </h2>
      </div>

      {/* Basic fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <Label className="font-body text-xs font-semibold tracking-wider uppercase" style={{ color: 'oklch(0.78 0.15 75)' }}>
            Title *
          </Label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Song or content title"
            disabled={isPending}
            style={{ background: 'oklch(0.22 0.01 260)', border: '1px solid oklch(0.35 0.02 260)', color: 'oklch(0.97 0.005 260)' }}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label className="font-body text-xs font-semibold tracking-wider uppercase" style={{ color: 'oklch(0.78 0.15 75)' }}>
            Artist *
          </Label>
          <Input
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
            placeholder="Artist name"
            disabled={isPending}
            style={{ background: 'oklch(0.22 0.01 260)', border: '1px solid oklch(0.35 0.02 260)', color: 'oklch(0.97 0.005 260)' }}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label className="font-body text-xs font-semibold tracking-wider uppercase" style={{ color: 'oklch(0.78 0.15 75)' }}>
            Album *
          </Label>
          <Input
            value={album}
            onChange={(e) => setAlbum(e.target.value)}
            placeholder="Album name"
            disabled={isPending}
            style={{ background: 'oklch(0.22 0.01 260)', border: '1px solid oklch(0.35 0.02 260)', color: 'oklch(0.97 0.005 260)' }}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label className="font-body text-xs font-semibold tracking-wider uppercase" style={{ color: 'oklch(0.78 0.15 75)' }}>
            Release Year *
          </Label>
          <Input
            type="number"
            value={releaseYear}
            onChange={(e) => setReleaseYear(e.target.value)}
            placeholder="e.g. 2024"
            min={1900}
            max={2100}
            disabled={isPending}
            style={{ background: 'oklch(0.22 0.01 260)', border: '1px solid oklch(0.35 0.02 260)', color: 'oklch(0.97 0.005 260)' }}
          />
        </div>
        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <Label className="font-body text-xs font-semibold tracking-wider uppercase" style={{ color: 'oklch(0.78 0.15 75)' }}>
            Cover Image URL
          </Label>
          <Input
            value={coverImageUrl}
            onChange={(e) => setCoverImageUrl(e.target.value)}
            placeholder="https://example.com/cover.jpg"
            disabled={isPending}
            style={{ background: 'oklch(0.22 0.01 260)', border: '1px solid oklch(0.35 0.02 260)', color: 'oklch(0.97 0.005 260)' }}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label className="font-body text-xs font-semibold tracking-wider uppercase" style={{ color: 'oklch(0.78 0.15 75)' }}>
            Genre <span style={{ color: 'oklch(0.55 0.01 260)' }}>(optional)</span>
          </Label>
          <Input
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            placeholder="e.g. Hip-Hop, R&B, Pop"
            disabled={isPending}
            style={{ background: 'oklch(0.22 0.01 260)', border: '1px solid oklch(0.35 0.02 260)', color: 'oklch(0.97 0.005 260)' }}
          />
        </div>
      </div>

      {/* Streaming Platforms */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <LinkIcon className="w-4 h-4 text-gold" />
          <Label className="font-body text-xs font-semibold tracking-wider uppercase" style={{ color: 'oklch(0.78 0.15 75)' }}>
            Streaming Links
          </Label>
        </div>
        <div className="flex flex-col gap-2">
          {platforms.map((platform, index) => (
            <PlatformRow
              key={index}
              platform={platform}
              index={index}
              onChange={handlePlatformChange}
              onRemove={handleRemovePlatform}
              canRemove={platforms.length > 1}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={handleAddPlatform}
          disabled={isPending}
          className="flex items-center gap-2 text-sm font-body font-medium transition-colors self-start px-3 py-1.5 rounded-sm"
          style={{
            color: 'oklch(0.78 0.15 75)',
            background: 'oklch(0.78 0.15 75 / 0.08)',
            border: '1px solid oklch(0.78 0.15 75 / 0.2)',
          }}
        >
          <Plus className="w-3.5 h-3.5" />
          Add Platform
        </button>
      </div>

      {/* Error */}
      {formError && (
        <div
          className="flex items-center gap-2 p-3 rounded-sm text-sm font-body"
          style={{ background: 'oklch(0.62 0.22 25 / 0.1)', border: '1px solid oklch(0.62 0.22 25 / 0.3)', color: 'oklch(0.80 0.15 25)' }}
        >
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {formError}
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={isPending}
        className="flex items-center justify-center gap-2 w-full py-3 rounded-sm font-body font-semibold text-sm tracking-wide transition-all disabled:opacity-50"
        style={{
          background: 'oklch(0.78 0.15 75)',
          color: 'oklch(0.10 0.01 260)',
        }}
      >
        {isPending ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Adding Entry…
          </>
        ) : (
          <>
            <Plus className="w-4 h-4" />
            Add Entry
          </>
        )}
      </button>
    </form>
  );
}

// ─── Entry List ───────────────────────────────────────────────────────────────

function EntryList() {
  const { data: entries, isLoading, isError } = useGetAllEntries();
  const { mutate: deleteEntry, isPending: isDeleting, variables: deletingId } = useDeleteMusicEntry();

  const handleDelete = (id: bigint) => {
    if (window.confirm('Remove this entry from the catalog?')) {
      deleteEntry(id, {
        onSuccess: () => toast.success('Entry removed.'),
        onError: () => toast.error('Failed to remove entry.'),
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-8 h-8 animate-spin text-gold" />
      </div>
    );
  }

  if (isError) {
    return (
      <div
        className="flex items-center gap-3 p-4 rounded-sm"
        style={{ background: 'oklch(0.62 0.22 25 / 0.1)', border: '1px solid oklch(0.62 0.22 25 / 0.3)' }}
      >
        <AlertCircle className="w-5 h-5 flex-shrink-0" style={{ color: 'oklch(0.62 0.22 25)' }} />
        <p className="text-sm font-body text-foreground">Failed to load entries.</p>
      </div>
    );
  }

  if (!entries || entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Music2 className="w-10 h-10 text-gold mb-3 opacity-50" />
        <p className="font-body text-sm" style={{ color: 'oklch(0.55 0.01 260)' }}>
          No entries yet. Add your first one above.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {entries.map((entry) => {
        const isThisDeleting = isDeleting && deletingId === entry.id;
        return (
          <div
            key={entry.id.toString()}
            className="flex items-center gap-4 p-4 rounded-sm transition-all"
            style={{
              background: 'oklch(0.17 0.01 260)',
              border: '1px solid oklch(0.28 0.02 260)',
              opacity: isThisDeleting ? 0.5 : 1,
            }}
          >
            {/* Cover thumbnail */}
            <div
              className="w-14 h-14 rounded-sm overflow-hidden flex-shrink-0"
              style={{ background: 'oklch(0.22 0.01 260)' }}
            >
              <img
                src={entry.coverImageUrl || '/assets/generated/default-cover.dim_400x400.png'}
                alt={entry.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/assets/generated/default-cover.dim_400x400.png';
                }}
              />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="font-display text-foreground truncate" style={{ fontSize: '1.1rem' }}>
                {entry.title}
              </p>
              <p className="font-body text-xs truncate" style={{ color: 'oklch(0.55 0.01 260)' }}>
                {entry.artist} · {entry.album} · {entry.releaseYear.toString()}
              </p>
              {entry.streamingPlatforms && entry.streamingPlatforms.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1">
                  {entry.streamingPlatforms.map((p, i) => (
                    <span
                      key={i}
                      className="text-xs font-body px-1.5 py-0.5 rounded-sm"
                      style={{
                        background: 'oklch(0.78 0.15 75 / 0.1)',
                        color: 'oklch(0.78 0.15 75)',
                        border: '1px solid oklch(0.78 0.15 75 / 0.2)',
                      }}
                    >
                      {p.name}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Delete button */}
            <button
              onClick={() => handleDelete(entry.id)}
              disabled={isDeleting}
              className="flex-shrink-0 p-2 rounded-sm transition-all disabled:opacity-50 hover:opacity-80"
              style={{
                background: 'oklch(0.62 0.22 25 / 0.1)',
                border: '1px solid oklch(0.62 0.22 25 / 0.3)',
                color: 'oklch(0.80 0.15 25)',
              }}
              aria-label="Delete entry"
            >
              {isThisDeleting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
            </button>
          </div>
        );
      })}
    </div>
  );
}

// ─── Login Prompt ─────────────────────────────────────────────────────────────

function LoginPrompt() {
  const { login, loginStatus } = useInternetIdentity();
  const isLoggingIn = loginStatus === 'logging-in';

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
      <div
        className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
        style={{ background: 'oklch(0.78 0.15 75 / 0.1)', border: '1px solid oklch(0.78 0.15 75 / 0.2)' }}
      >
        <Shield className="w-9 h-9 text-gold" />
      </div>
      <h2 className="font-display text-foreground mb-2" style={{ fontSize: '2.5rem' }}>
        ADMIN ACCESS
      </h2>
      <p className="font-body text-sm mb-8 max-w-sm" style={{ color: 'oklch(0.55 0.01 260)' }}>
        You must be logged in to manage the LNT catalog. Only the owner can add or remove entries.
      </p>
      <button
        onClick={login}
        disabled={isLoggingIn}
        className="flex items-center gap-2 px-8 py-3 rounded-sm font-body font-semibold text-sm tracking-wide transition-all disabled:opacity-50"
        style={{
          background: 'oklch(0.78 0.15 75)',
          color: 'oklch(0.10 0.01 260)',
        }}
      >
        {isLoggingIn ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Logging in…
          </>
        ) : (
          <>
            <LogIn className="w-4 h-4" />
            Login to Continue
          </>
        )}
      </button>
    </div>
  );
}

// ─── Admin Panel Page ─────────────────────────────────────────────────────────

export function AdminPanel() {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  if (!isAuthenticated) {
    return <LoginPrompt />;
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Page Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <Shield className="w-6 h-6 text-gold" />
          <span className="font-body text-xs font-semibold tracking-[0.3em] uppercase" style={{ color: 'oklch(0.78 0.15 75)' }}>
            Owner Panel
          </span>
        </div>
        <h1 className="font-display text-foreground" style={{ fontSize: 'clamp(2rem, 6vw, 3.5rem)' }}>
          MANAGE CATALOG
        </h1>
        <p className="font-body text-sm mt-1" style={{ color: 'oklch(0.55 0.01 260)' }}>
          Add new music entries and streaming links, or remove existing ones from the LNT catalog.
        </p>
        <div
          className="h-px mt-4"
          style={{ background: 'linear-gradient(90deg, oklch(0.78 0.15 75 / 0.5), transparent)' }}
        />
      </div>

      {/* Add Entry Form */}
      <section className="mb-10">
        <AddEntryForm />
      </section>

      {/* Existing Entries */}
      <section>
        <div className="flex items-center gap-3 mb-5">
          <Music2 className="w-5 h-5 text-gold" />
          <h2 className="font-display text-foreground" style={{ fontSize: '1.5rem' }}>
            CURRENT CATALOG
          </h2>
        </div>
        <EntryList />
      </section>
    </div>
  );
}
