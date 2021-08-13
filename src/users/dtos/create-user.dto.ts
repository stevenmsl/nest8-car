import { IsEmail, IsString } from 'class-validator';

/* #03-04 */
export class CreateUserDto {
  /* #03-05 */
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
