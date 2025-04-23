import { ForbiddenException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthStrategies } from 'src/constants/authStrategies';
import { AuthenticationService } from '../authentication.service';
import { User } from '../../users/entities/user.entity';
import { JwtPayload } from '../types/jwtPayload';
import { EnvironmentVariables } from 'src/constants/enviromentVariables';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  AuthStrategies.JWT_REFRESH,
) {
  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly configService: ConfigService,
  ) {
    const jwtRefreshSecret = configService.get<string>(
      EnvironmentVariables.JWT_REFRESH_SECRET,
    );

    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),
      ignoreExpiration: false,
      secretOrKey: jwtRefreshSecret,
      passReqToCallback: true,
    });
  }

  async validate(
    req: Request & { body: { refreshToken: string } },
    payload: JwtPayload,
  ): Promise<User> {
    const refreshToken = req.body.refreshToken;

    const userAuth =
      await this.authenticationService.validateRefreshToken(refreshToken);

    if (!userAuth) {
      throw new ForbiddenException('Invalid refresh token');
    }

    const user = userAuth.user;

    return user;
  }
}
