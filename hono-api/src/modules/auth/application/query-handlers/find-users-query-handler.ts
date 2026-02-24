import type { QueryHandler } from '@app/common/interfaces';
import type { UserRepository } from '@app/modules/auth/domain/interfaces';
import type { FindUsersQuery, User } from '@app/modules/auth/interfaces';

export class FindUsersQueryHandler implements QueryHandler<
  FindUsersQuery,
  User[]
> {
  private userRepository: UserRepository;

  constructor({ userRepository }: { userRepository: UserRepository }) {
    this.userRepository = userRepository;
  }

  async execute(query: FindUsersQuery): Promise<User[]> {
    return this.userRepository.findAll({ name: query.name });
  }
}
