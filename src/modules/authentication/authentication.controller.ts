import {
  Controller,
  Post,
  Body,
  Request,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { LocalAuthGuard } from 'src/auth/localAuthentication.guard';
import { UserJwtAuthenticationGuard } from 'src/auth/userJwtAuthentication.guard';
import { JwtRefreshGuard } from 'src/auth/refreshTokenAuthentication.guard';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('authentication')
@Controller('authentication')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @UseGuards(LocalAuthGuard)
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          example: 'myEmail@email.com',
        },
        password: {
          type: 'string',
          example: '********',
        },
        userAgent: {
          type: 'string',
          example: 'User Agent',
        },
      },
    },
  })
  @Post('login')
  async login(
    @Request() request: any,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    return this.authenticationService.generateTokens(
      request.user,
      request.headers['user-agent'],
    );
  }

  @UseGuards(JwtRefreshGuard)
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        refreshToken: { type: 'string' },
      },
    },
  })
  @Post('refresh')
  async refresh(
    @Body('refreshToken') refreshToken: string,
    @Request() request: any,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    return this.authenticationService.refreshAccessToken(
      refreshToken,
      request.headers['user-agent'],
    );
  }

  @UseGuards(UserJwtAuthenticationGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({ status: HttpStatus.NO_CONTENT, type: undefined })
  @Post('logout')
  async logout(@Body('refreshToken') refreshToken: string): Promise<void> {
    await this.authenticationService.revokeRefreshToken(refreshToken);
  }
}
