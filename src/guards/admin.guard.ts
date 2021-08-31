import { CanActivate, ExecutionContext } from '@nestjs/common';
import { User } from '../users/user.entity';

export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    /* #09-05 
      - the currentUser on a request should be 
        populated by the current user middleware 
        for authenticated users already
      - check if the user has admin privilege  
    */
    if (!request.currentUser) {
      return false;
    }
    const user = request.currentUser as User;

    return user.admin;
  }
}
