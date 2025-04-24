import { Entity, PrimaryGeneratedColumn, Column, OneToOne, CreateDateColumn } from 'typeorm';
import { User } from '../users/entities/user.entity';

@Entity('questionnaires')
export class Questionnaire {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('jsonb')
  answers: Record<number, string>;

  @OneToOne(() => User, user => user.questionnaire)
  user: User;

  @CreateDateColumn()
  createdAt: Date;
} 