import { getInstance } from '@/shared/http/axios.http';
import {
  type User,
  type UserAlbum,
  type UserPost,
  UserAlbumsResponseSchema,
  UserPostsResponseSchema,
  UserSchema,
  UsersResponseSchema,
} from './-users.schema';

const HTTP = getInstance({ baseURL: '/placeholder/', withCredentials: false });

export const usersRepository = {
  list: () => HTTP.get<User[]>('users', UsersResponseSchema),
  getById: (id: number) => HTTP.get<User>(`users/${id}`, UserSchema),
  getPostsByUser: (userId: number) =>
    HTTP.get<UserPost[]>(`users/${userId}/posts`, UserPostsResponseSchema),
  getAlbumsByUser: (userId: number) =>
    HTTP.get<UserAlbum[]>(`users/${userId}/albums`, UserAlbumsResponseSchema),
};
