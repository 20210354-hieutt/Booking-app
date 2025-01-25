import { SetMetadata } from '@nestjs/common';
import { ROLE } from 'src/user/enum/role.enum';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: [ROLE, ...ROLE[]]) =>
  SetMetadata(ROLES_KEY, roles);
