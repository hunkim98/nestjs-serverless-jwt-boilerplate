import { User } from '@prisma/client';
import { Request } from 'express';

interface RequestWithUser extends Request {
  user: Omit<User, 'password'>;
}

export default RequestWithUser;
