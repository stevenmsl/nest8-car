import { Expose } from 'class-transformer';

export class UserDto {
  /* #04-01 */
  @Expose()
  id: number;

  @Expose()
  email: string;
}
