export interface BlobAvatarOptions {
  size?: number;
  colors?: string[];
  background?: string;
}
export function blobAvatar(seed: string | number, opts?: BlobAvatarOptions): string;
export function blobAvatarDataUri(seed: string | number, opts?: BlobAvatarOptions): string;
