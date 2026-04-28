import { useQuery } from '@tanstack/react-query';
import { usersUseCase } from './-users.use-case';

export const usersQueryKeys = {
  all: ['users'] as const,
  detail: (id: number) => ['users', id] as const,
  posts: (userId: number) => ['users', userId, 'posts'] as const,
  albums: (userId: number) => ['users', userId, 'albums'] as const,
};

export function useUsers() {
  return useQuery({
    queryKey: usersQueryKeys.all,
    queryFn: async () => {
      const result = await usersUseCase.list();
      return result.getOrElse((error) => {
        throw error;
      }).data;
    },
  });
}

export function useUserPosts(userId: number) {
  return useQuery({
    queryKey: usersQueryKeys.posts(userId),
    queryFn: async () => {
      const result = await usersUseCase.getPostsByUser(userId);
      return result.getOrElse((error) => {
        throw error;
      }).data;
    },
    enabled: userId > 0,
  });
}

export function useUserAlbums(userId: number) {
  return useQuery({
    queryKey: usersQueryKeys.albums(userId),
    queryFn: async () => {
      const result = await usersUseCase.getAlbumsByUser(userId);
      return result.getOrElse((error) => {
        throw error;
      }).data;
    },
    enabled: userId > 0,
  });
}
