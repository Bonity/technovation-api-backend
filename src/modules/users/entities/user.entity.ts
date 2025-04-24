import { UserAuthentication } from '../../../modules/authentication/entities/userAuthentication.entity';
import {
  Column,
  OneToMany,
  OneToOne,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PrimaryGeneratedColumn } from 'typeorm';
import { Entity } from 'typeorm';
import { Questionnaire } from '../../questionnaire/questionnaire.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  accepted_terms: boolean;

  @CreateDateColumn()
  created_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(
    () => UserAuthentication,
    (userAuthentication) => userAuthentication.user,
  )
  user_authentications: UserAuthentication[];

  @OneToOne(() => Questionnaire, questionnaire => questionnaire.user)
  questionnaire: Questionnaire;
}
