import { postUseCase } from './-post.use-case';

export const postController = {
  list: async (params: { limit: number; skip: number }) => {
    const result = await postUseCase.list(params);
    const { data } = result.getOrElse((error) => {
      throw error;
    });
    return data;
  },
  getById: async (id: number) => {
    const result = await postUseCase.getById(id);
    const { data } = result.getOrElse((error) => {
      throw error;
    });
    return data;
  },
};
