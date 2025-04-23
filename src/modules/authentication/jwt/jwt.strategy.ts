import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../types/jwtPayload';
import { User } from '../../users/entities/user.entity';
import { AuthenticationService } from '../authentication.service';
import { EnvironmentVariables } from 'src/constants/enviromentVariables';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly configService: ConfigService,
  ) {
    const jwtSecret = configService.get<string>(
      EnvironmentVariables.JWT_SECRET,
    );

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: JwtPayload): Promise<User> {
    const authToken = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    const userAuth =
      await this.authenticationService.validateAuthToken(authToken);

    if (!userAuth || !userAuth.user) {
      throw new UnauthorizedException('Invalid token');
    }

    return userAuth.user;
  }
}
