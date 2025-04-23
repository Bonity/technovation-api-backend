// jwt-refresh.guard.ts
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthStrategies } from '../constants/authStrategies';

@Injectable()
export class JwtRefreshGuard extends AuthGuard(AuthStrategies.JWT_REFRESH) {}
