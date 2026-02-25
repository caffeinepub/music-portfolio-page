import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { MusicEntry, UserProfile, StreamingPlatform } from '../backend';

// ─── Music Entries ────────────────────────────────────────────────────────────

export function useGetAllEntries() {
  const { actor, isFetching } = useActor();

  return useQuery<MusicEntry[]>({
    queryKey: ['musicEntries'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllEntries();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 10000,
    keepPreviousData: true,
  } as any);
}

export function useAddMusicEntry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      title: string;
      artist: string;
      album: string;
      coverImageUrl: string;
      releaseYear: bigint;
      genre: string | null;
      platforms: StreamingPlatform[];
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addMusicEntry(
        params.title,
        params.artist,
        params.album,
        params.coverImageUrl,
        params.releaseYear,
        params.genre,
        params.platforms,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['musicEntries'] });
    },
  });
}

export function useDeleteMusicEntry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteMusicEntry(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['musicEntries'] });
    },
  });
}

// ─── User Profile ─────────────────────────────────────────────────────────────

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}
