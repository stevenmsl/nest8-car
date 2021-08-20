import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '../user.entity';

/* #05-07 
   - the first parameter has a type never, which
     means we don't want whoever uses this decorator
     to pass in any parameter
*/
export const CurrentUser = createParamDecorator(
  (data: never, context: ExecutionContext) => {
    /* #05-08
       - by simply returning the user object
         will populate the parameter who
         is decorated with this decorator
    */
    const request = context.switchToHttp().getRequest();
    return request.currentUser as User;
  },
);
