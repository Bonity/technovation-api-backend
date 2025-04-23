import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Questionnaire } from '../questionnaire/questionnaire.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Questionnaire, questionnaire => questionnaire.user)
  questionnaires: Questionnaire[];
} 