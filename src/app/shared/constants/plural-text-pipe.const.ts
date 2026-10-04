export type TextVariant = 'song' | 'track';

export const PLURAL_MAP: Record<TextVariant, { one: string; many: string }> = {
  track: { one: 'track', many: 'tracks' },
  song: { one: 'song', many: 'songs' },
};
