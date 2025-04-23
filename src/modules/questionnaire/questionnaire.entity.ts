import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from '../user/user.entity';

@Entity('questionnaires')
export class Questionnaire {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('jsonb')
  answers: Record<number, string>;

  @ManyToOne(() => User, user => user.questionnaires)
  user: User;

  @CreateDateColumn()
  createdAt: Date;
} 