import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserAuthentication } from './entities/userAuthentication.entity';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { JwtPayload } from './types/jwtPayload';
import { EnvironmentVariables } from 'src/constants/enviromentVariables';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
    @InjectRepository(UserAuthentication)
    private userAuthenticationRepository: Repository<UserAuthentication>,
    private readonly configService: ConfigService,
  ) {}

  private readonly JWT_ACCESS_EXPIRATION_FALLBACK = '3600';
  private readonly JWT_REFRESH_EXPIRATION_FALLBACK = '86400';

  async generateAccessToken(userId: number): Promise<string> {
    const user = await this.userService.getOneById(userId);
    const payload: JwtPayload = { userId: user.id };

    const expiresIn = parseInt(
      this.configService.get<string>(
        EnvironmentVariables.JWT_ACCESS_EXPIRATION,
      ) || this.JWT_ACCESS_EXPIRATION_FALLBACK,
    );

    const secret = this.configService.get<string>(
      EnvironmentVariables.JWT_SECRET,
    );
    if (!secret) {
      throw new Error('JWT_SECRET is not set');
    }

    return this.jwtService.sign(payload, {
      secret: secret,
      expiresIn: expiresIn,
    });
  }

  async generateRefreshToken(userId: number): Promise<string> {
    const user = await this.userService.getOneById(userId);
    const payload: JwtPayload = { userId: user.id };

    const expiresIn = parseInt(
      this.configService.get<string>(
        EnvironmentVariables.JWT_REFRESH_EXPIRATION,
      ) || this.JWT_REFRESH_EXPIRATION_FALLBACK,
    );

    const secret = this.configService.get<string>(
      EnvironmentVariables.JWT_REFRESH_SECRET,
    );
    if (!secret) {
      throw new Error('JWT_REFRESH_SECRET is not set');
    }

    return this.jwtService.sign(payload, {
      secret: secret,
      expiresIn: expiresIn,
    });
  }

  async generateTokens(
    user: User,
    userAgent: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const accessToken = await this.generateAccessToken(user.id);
    const refreshToken = await this.generateRefreshToken(user.id);

    const accessExpirationSeconds = parseInt(
      this.configService.get<string>(
        EnvironmentVariables.JWT_ACCESS_EXPIRATION,
      ) || this.JWT_ACCESS_EXPIRATION_FALLBACK,
    );

    const refreshExpirationSeconds = parseInt(
      this.configService.get<string>(
        EnvironmentVariables.JWT_REFRESH_EXPIRATION,
      ) || this.JWT_REFRESH_EXPIRATION_FALLBACK,
    );

    const userAuthentication = new UserAuthentication();
    userAuthentication.user = user;
    userAuthentication.user_id = user.id;
    userAuthentication.auth_token = accessToken;
    userAuthentication.refresh_token = refreshToken;
    userAuthentication.browser_agent = userAgent;
    userAuthentication.auth_expires_at = new Date(
      Date.now() + accessExpirationSeconds * 1000,
    );
    userAuthentication.refresh_expires_at = new Date(
      Date.now() + refreshExpirationSeconds * 1000,
    );

    await this.userAuthenticationRepository.save(userAuthentication);

    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshAccessToken(
    refreshToken: string,
    userAgent: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const tokenEntity = await this.userAuthenticationRepository.findOne({
      where: { refresh_token: refreshToken, browser_agent: userAgent },
      relations: ['user'],
    });

    if (!tokenEntity) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (tokenEntity.is_revoked) {
      throw new UnauthorizedException('Token has been revoked');
    }

    if (tokenEntity.browser_agent !== userAgent) {
      throw new UnauthorizedException('User agent mismatch');
    }

    if (tokenEntity.refresh_expires_at < new Date()) {
      throw new UnauthorizedException('Refresh token expired');
    }

    const user = tokenEntity.user;
    const accessToken = await this.generateAccessToken(user.id);
    const newRefreshToken = await this.generateRefreshToken(user.id);

    const accessExpirationSeconds = parseInt(
      this.configService.get<string>(
        EnvironmentVariables.JWT_ACCESS_EXPIRATION,
      ) || this.JWT_ACCESS_EXPIRATION_FALLBACK,
    );

    const refreshExpirationSeconds = parseInt(
      this.configService.get<string>(
        EnvironmentVariables.JWT_REFRESH_EXPIRATION,
      ) || this.JWT_REFRESH_EXPIRATION_FALLBACK,
    );

    tokenEntity.auth_token = accessToken;
    tokenEntity.refresh_token = newRefreshToken;
    tokenEntity.auth_expires_at = new Date(
      Date.now() + accessExpirationSeconds * 1000,
    );
    tokenEntity.refresh_expires_at = new Date(
      Date.now() + refreshExpirationSeconds * 1000,
    );

    await this.userAuthenticationRepository.save(tokenEntity);

    return {
      accessToken,
      refreshToken: newRefreshToken,
    };
  }

  async revokeRefreshToken(refreshToken: string): Promise<void> {
    await this.userAuthenticationRepository.update(
      { refresh_token: refreshToken },
      { is_revoked: true },
    );
  }

  async validateRefreshToken(
    refreshToken: string,
  ): Promise<UserAuthentication | null> {
    const tokenEntity = await this.userAuthenticationRepository.findOne({
      where: { refresh_token: refreshToken },
      relations: ['user'],
      order: { created_at: 'DESC' },
    });

    if (
      !tokenEntity ||
      tokenEntity.refresh_expires_at < new Date() ||
      tokenEntity.is_revoked
    ) {
      return null;
    }

    return tokenEntity;
  }

  async validateAuthToken(
    authToken: string,
  ): Promise<UserAuthentication | null> {
    const tokenEntity = await this.userAuthenticationRepository.findOne({
      where: { auth_token: authToken },
      relations: ['user'],
      order: { created_at: 'DESC' },
    });

    if (
      !tokenEntity ||
      tokenEntity.auth_expires_at < new Date() ||
      tokenEntity.is_revoked
    ) {
      return null;
    }

    return tokenEntity;
  }

  async revokeAllUserTokens(userId: number): Promise<void> {
    await this.userAuthenticationRepository.update(
      { user_id: userId },
      { is_revoked: true },
    );
  }
}
