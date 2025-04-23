import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  UseGuards,
  Body,
  Query,
} from '@nestjs/common';
import { UserViewModel } from './users/types/userViewModel';
import { UsersService } from './users/users.service';
import { UserJwtAuthenticationGuard } from 'src/auth/userJwtAuthentication.guard';
import { UserInputModel } from './users/types/userInputModel';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of users',
    type: UserViewModel,
    isArray: true,
  })
  async findAll(): Promise<UserViewModel[]> {
    return this.usersService.get();
  }

  @Get('check-email')
  @ApiOperation({ summary: 'Check if email exists' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Email check result',
    schema: {
      type: 'object',
      properties: {
        exists: {
          type: 'boolean',
          description: 'Whether the email exists',
        },
      },
    },
  })
  async checkEmailExists(
    @Query('email') email: string,
  ): Promise<{ exists: boolean }> {
    return this.usersService.checkEmailExists(email);
  }

  @ApiBearerAuth()
  @UseGuards(UserJwtAuthenticationGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Get a user by ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User found',
    type: UserViewModel,
    isArray: false,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User not found' })
  async findOne(@Param('id') id: number): Promise<UserViewModel> {
    return this.usersService.getOneById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User created successfully',
    type: UserViewModel,
  })
  async createUser(@Body() user: UserInputModel): Promise<UserViewModel> {
    return this.usersService.createUser(user);
  }
}
