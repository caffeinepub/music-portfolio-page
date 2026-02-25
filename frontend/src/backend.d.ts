import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface StreamingPlatform {
    url: string;
    name: string;
}
export interface MusicEntry {
    id: bigint;
    coverImageUrl: string;
    title: string;
    album: string;
    streamingPlatforms: Array<StreamingPlatform>;
    genre?: string;
    artist: string;
    releaseYear: bigint;
}
export interface UserProfile {
    name: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addMusicEntry(title: string, artist: string, album: string, coverImageUrl: string, releaseYear: bigint, genre: string | null, platforms: Array<StreamingPlatform>): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteMusicEntry(id: bigint): Promise<void>;
    getAllEntries(): Promise<Array<MusicEntry>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getIdEntry(id: bigint): Promise<MusicEntry>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    searchEntries(searchTerm: string): Promise<Array<MusicEntry>>;
    updateMusicEntry(id: bigint, title: string, artist: string, album: string, coverImageUrl: string, releaseYear: bigint, genre: string | null, platforms: Array<StreamingPlatform>): Promise<void>;
}
