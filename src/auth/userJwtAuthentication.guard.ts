import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { AuthStrategies } from 'src/constants/authStrategies';

@Injectable()
export class UserJwtAuthenticationGuard extends AuthGuard(AuthStrategies.JWT) {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    return super.canActivate(context);
  }
}
