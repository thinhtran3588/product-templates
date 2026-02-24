import type { Query } from '@app/common/interfaces';

export interface FindUsersQuery extends Query {
  readonly name?: string;
}
