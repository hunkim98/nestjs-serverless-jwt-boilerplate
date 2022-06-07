import { Request } from 'express';
import { Users } from '../../entities/users.entity';

interface RequestWithUser extends Request {
  user: Users;
}

export default RequestWithUser;
