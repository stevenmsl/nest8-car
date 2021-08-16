import {
  UseInterceptors,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToClass, ClassConstructor } from 'class-transformer';

/* #04-04
  - T is the type of the DTO object you want
    to transform to from an entity
  - use ClassConstructor to make sure the
    type of DTO is also a class
   
*/
export function Serialize<T>(dto: ClassConstructor<T>) {
  return UseInterceptors(new SerializeInterceptor(dto));
}

/* Interceptor 
   - define a constructor to accept the type of the Dto
     to instruct how the response should be transformed
     from a entity to a DTO
   - define intercept to perform the actual
    transformation  
*/

export class SerializeInterceptor<TEntity, TDto>
  implements NestInterceptor<TEntity, TDto>
{
  /* #04-02 */
  constructor(private dto: ClassConstructor<TDto>) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<TEntity>,
  ): Observable<TDto> | Promise<Observable<TDto>> {
    return next.handle().pipe(
      map((data) => {
        /* #04-03
          - data is the entity returned from the API
          - you then transform it to a DTO 
            using plainToClass
          - set excludeExtraneousValues to true 
            so only properties with           
            @Expose decorator in the DTO 
            will be included in the response  
        */
        const response = plainToClass(this.dto, data, {
          excludeExtraneousValues: true,
        });

        return response;
      }),
    );
  }
}
