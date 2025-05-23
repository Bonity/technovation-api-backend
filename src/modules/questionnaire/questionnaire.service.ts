import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Questionnaire } from './questionnaire.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class QuestionnaireService {
  constructor(
    @InjectRepository(Questionnaire)
    private questionnaireRepository: Repository<Questionnaire>,
  ) {}

  async create(user: User, answers: Record<number, string>): Promise<Questionnaire> {
    // Delete any existing questionnaire for this user
    await this.questionnaireRepository.delete({ user });
    
    const questionnaire = this.questionnaireRepository.create({
      user,
      answers,
    });
    return this.questionnaireRepository.save(questionnaire);
  }

  async findByUser(user: User): Promise<Questionnaire[]> {
    return this.questionnaireRepository.find({
      where: { user },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Questionnaire | null> {
    return this.questionnaireRepository.findOne({
      where: { id },
    });
  }
} 