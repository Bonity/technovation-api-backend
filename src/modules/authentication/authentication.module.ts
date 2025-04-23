import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthenticationService } from './authentication.service';
import { JwtModule } from '@nestjs/jwt';
import { UserAuthentication } from './entities/userAuthentication.entity';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local/local.strategy';
import { JwtStrategy } from './jwt/jwt.strategy';
import { UsersModule } from '../users/users.module';
import { AuthenticationController } from './authentication.controller';
import { JwtRefreshStrategy } from './jwt/jwtRefreshToken.strategy';
import { EnvironmentVariables } from '../../constants/enviromentVariables';
import { ConfigurationModule } from '../../config/configuration.module';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigurationModule,
    PassportModule,
    TypeOrmModule.forFeature([UserAuthentication]),
    JwtModule.registerAsync({
      imports: [ConfigurationModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>(EnvironmentVariables.JWT_SECRET),
        signOptions: {
          expiresIn: configService.get<string>(
            EnvironmentVariables.JWT_ACCESS_EXPIRATION,
          ),
        },
      }),
    }),
    UsersModule,
  ],
  controllers: [AuthenticationController],
  providers: [
    AuthenticationService,
    LocalStrategy,
    JwtStrategy,
    JwtRefreshStrategy,
  ],
  exports: [AuthenticationService],
})
export class AuthenticationModule {}
