export interface Playlist {
  id: string;
  name: string;
  description?: string;
  trackIds: string[];
  coverUrl?: string[];
  uid: string;
}

export interface CollectionRegistry {
  playlists: Playlist;
}

export interface RegisterInput {
  email: string;
  password: string;
  displayName: string;
}

export type CollectionName = keyof CollectionRegistry;

export type CreatePlaylistInput = Omit<Playlist, 'id'>;

export type UpdatePlaylistInput = Partial<Omit<Playlist, 'id'>>;
