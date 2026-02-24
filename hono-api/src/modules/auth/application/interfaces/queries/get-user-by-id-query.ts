import type { Query } from '@app/common/interfaces';

export interface GetUserByIdQuery extends Query {
  readonly id: string;
}
