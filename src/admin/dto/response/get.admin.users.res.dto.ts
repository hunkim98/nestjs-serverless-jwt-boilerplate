import { User } from '@prisma/client';

export class GetAdminUsersResDto {
  users: Array<
    Pick<
      User,
      | 'id'
      | 'createdAt'
      | 'updatedAt'
      | 'deleted'
      | 'name'
      | 'telephone'
      | 'nickname'
      | 'email'
    >
  >;
  pagesCount: number;
}
