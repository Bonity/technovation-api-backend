import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UserViewModel } from './types/userViewModel';
import {
  UsersToUserViewModelsMappers,
  UserToUserViewModelMapper,
} from './mappers/userToUserViewModel';
import { InjectRepository } from '@nestjs/typeorm';
import { PasswordService } from '../authentication/password.service';
import { UserInputModel } from './types/userInputModel';
import { inputModelToUser } from './mappers/inputModelToUser';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly passwordService: PasswordService,
  ) {}

  async get(): Promise<UserViewModel[]> {
    const users = await this.userRepository.find();
    return UsersToUserViewModelsMappers(users);
  }

  async getOneById(id: number): Promise<UserViewModel> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return UserToUserViewModelMapper(user);
  }

  async getAndValidateUser(email: string, password: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isPasswordValid = await this.passwordService.comparePassword(
      password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    return user;
  }

  async createUser(userInput: UserInputModel): Promise<UserViewModel> {
    // Validate password strength before creating user
    if (!this.passwordService.validatePasswordStrength(userInput.password)) {
      throw new BadRequestException(
        'Password must be at least 8 characters and include uppercase, lowercase, number, and special character',
      );
    }

    const hashedPassword = await this.passwordService.hashPassword(
      userInput.password,
    );

    const mappedUser = inputModelToUser(userInput);

    mappedUser.password = hashedPassword;

    const newUser = this.userRepository.create(mappedUser);

    await this.userRepository.save(newUser);
    return UserToUserViewModelMapper(newUser);
  }

  async checkEmailExists(email: string): Promise<{ exists: boolean }> {
    const user = await this.userRepository.findOne({ where: { email } });
    return { exists: !!user };
  }
}
