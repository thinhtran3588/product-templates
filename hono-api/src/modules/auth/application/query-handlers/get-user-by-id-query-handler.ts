import type { QueryHandler } from '@app/common/interfaces';
import type { UserRepository } from '@app/modules/auth/domain/interfaces';
import type { GetUserByIdQuery, User } from '@app/modules/auth/interfaces';

export class GetUserByIdQueryHandler implements QueryHandler<
  GetUserByIdQuery,
  User | undefined
> {
  private userRepository: UserRepository;

  constructor({ userRepository }: { userRepository: UserRepository }) {
    this.userRepository = userRepository;
  }

  async execute(query: GetUserByIdQuery): Promise<User | undefined> {
    return this.userRepository.findById(query.id);
  }
}
