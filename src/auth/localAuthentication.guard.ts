import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthStrategies } from '../constants/authStrategies';

@Injectable()
export class LocalAuthGuard extends AuthGuard(AuthStrategies.LOCAL) {}
