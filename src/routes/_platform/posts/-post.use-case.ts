import { postRepository } from './-post.repository';

export const postUseCase = {
  list: (params: { limit: number; skip: number }) => postRepository.list(params),
  getById: (id: number) => postRepository.getById(id),
};
