import { usersRepository } from './-users.repository';

export const usersUseCase = {
  list: () => usersRepository.list(),
  getById: (id: number) => usersRepository.getById(id),
  getPostsByUser: (userId: number) => usersRepository.getPostsByUser(userId),
  getAlbumsByUser: (userId: number) => usersRepository.getAlbumsByUser(userId),
};
