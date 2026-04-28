import { Skeleton } from '@/shared/components/ui/skeleton';
import { FileText } from 'lucide-react';
import { useUserPosts } from '../-users.controller';

type UserPostsTabProps = {
  userId: number;
};

export function UserPostsTab({ userId }: UserPostsTabProps) {
  const { data: posts, isLoading, isError } = useUserPosts(userId);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3 p-4">
        {Array.from({ length: 5 }).map((_, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton list
          <div key={i} className="flex flex-col gap-1.5">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (isError || !posts) {
    return (
      <p className="text-destructive text-sm p-4">Failed to load posts.</p>
    );
  }

  return (
    <div className="flex flex-col divide-y divide-border">
      {posts.map((post) => (
        <div key={post.id} className="flex gap-3 p-4 hover:bg-muted/30 transition-colors">
          <FileText className="size-4 text-muted-foreground mt-0.5 shrink-0" />
          <div className="min-w-0">
            <p className="text-sm font-medium leading-snug capitalize">{post.title}</p>
            <p className="text-muted-foreground text-xs mt-0.5 line-clamp-2">{post.body}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
