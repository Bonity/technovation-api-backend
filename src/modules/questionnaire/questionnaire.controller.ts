import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { QuestionnaireService } from './questionnaire.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../users/entities/user.entity';

@Controller('questionnaires')
@UseGuards(JwtAuthGuard)
export class QuestionnaireController {
  constructor(private readonly questionnaireService: QuestionnaireService) {}

  @Post()
  async create(
    @Request() req,
    @Body('answers') answers: Record<number, string>,
  ) {
    return this.questionnaireService.create(req.user, answers);
  }

  @Get()
  async findAll(@Request() req) {
    return this.questionnaireService.findByUser(req.user);
  }

  @Get(':id')
  async findOne(@Request() req, id: number) {
    return this.questionnaireService.findOne(id);

  }

  @Get('hasAnswered')
  async hasAnswered():Promise<boolean>{
    return true
  }
} 