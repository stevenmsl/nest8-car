import { report } from 'superagent';
import {
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import { Report } from '../reports/report.entity';

@Entity() /* #03-01 */
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  /* #09-04 
    - the default value is set just to showcase
      how to set a default value on a column 
  */
  @Column({ default: true })
  admin: boolean;

  /* 08-01 */
  @OneToMany(() => Report, (report) => report.user)
  reports: Report[];
  /* #03-10 */
  @AfterInsert()
  logInsert() {
    console.log('Inserted User with id', this.id);
  }

  @AfterUpdate()
  logUpdate() {
    console.log('Updated User with id', this.id);
  }

  @AfterRemove()
  logRemove() {
    console.log('Removed User with id', this.id);
  }
}
