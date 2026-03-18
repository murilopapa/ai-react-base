import { getInstance } from '@/shared/http/axios.http';
import { type Post, PostSchema, type PostsResponse, PostsResponseSchema } from './-post.schema';

const HTTP = getInstance({ baseURL: '/api/', withCredentials: false });

type ListParams = { limit: number; skip: number };

export const postRepository = {
  list: (params: ListParams) => HTTP.get<PostsResponse>('posts', PostsResponseSchema, { params }),
  getById: (id: number) => HTTP.get<Post>(`posts/${id}`, PostSchema),
};
