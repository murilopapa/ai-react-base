import { Skeleton } from '@/shared/components/ui/skeleton';
import { ImageIcon } from 'lucide-react';
import { useUserAlbums } from '../-users.controller';

type UserAlbumsTabProps = {
  userId: number;
};

export function UserAlbumsTab({ userId }: UserAlbumsTabProps) {
  const { data: albums, isLoading, isError } = useUserAlbums(userId);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3 p-4">
        {Array.from({ length: 5 }).map((_, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton list
          <Skeleton key={i} className="h-9 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (isError || !albums) {
    return (
      <p className="text-destructive text-sm p-4">Failed to load albums.</p>
    );
  }

  return (
    <div className="flex flex-col divide-y divide-border">
      {albums.map((album) => (
        <div key={album.id} className="flex items-center gap-3 p-4 hover:bg-muted/30 transition-colors">
          <div className="flex items-center justify-center size-8 rounded-md bg-primary/10 shrink-0">
            <ImageIcon className="size-4 text-primary" />
          </div>
          <p className="text-sm capitalize">{album.title}</p>
        </div>
      ))}
    </div>
  );
}
