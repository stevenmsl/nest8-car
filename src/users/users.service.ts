import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  /* #03-08 */
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  create(email: string, password: string) {
    const user = this.repo.create({ email, password });
    return this.repo.save(user);
  }

  findOne(id: number) {
    return this.repo.findOne(id);
  }

  find(email: string) {
    return this.repo.find({ email });
  }

  /* #03-09 */
  async update(id: number, attrs: Partial<User>) {
    /* #03-11 trigger hooks
       - use repo to retrieve the record from db
         - this is crucial
       - overwrite the value of the properties
         you want to update
       - update record using the repo save method
    */

    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('user not found');
    }
    Object.assign(user, attrs);
    return this.repo.save(user);
  }

  async remove(id: number) {
    /* #03-11 check the update method */
    const user = await this.findOne(id);
    if (!user) {
      /* #03-12 */
      throw new NotFoundException('user not found');
    }
    return this.repo.remove(user);
  }
}
