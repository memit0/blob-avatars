export interface BlobAvatarOptions {
  size?: number;
  colors?: string[];
  /** Any CSS color, or 'none' / 'transparent' for no background. */
  background?: string;
  /** Eyes and mouth color. Defaults to `background`, or '#111111' when there is none. */
  face?: string;
}
export function blobAvatar(seed: string | number, opts?: BlobAvatarOptions): string;
export function blobAvatarDataUri(seed: string | number, opts?: BlobAvatarOptions): string;
