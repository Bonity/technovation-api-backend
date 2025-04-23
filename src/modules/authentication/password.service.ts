import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from 'src/constants/enviromentVariables';

@Injectable()
export class PasswordService {
  private readonly saltRounds: number;

  constructor(private configService: ConfigService) {
    this.saltRounds =
      this.configService.get<number>(EnvironmentVariables.BCRYPT_SALT_ROUNDS) ||
      12;
  }

  async hashPassword(password: string): Promise<string> {
    try {
      return await bcrypt.hash(password, Number(this.saltRounds));
    } catch (error) {
      throw new Error(`Password hashing failed: ${error.message}`);
    }
  }

  async comparePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    try {
      return await bcrypt.compare(password, hashedPassword);
    } catch (error) {
      throw new Error(`Password comparison failed: ${error.message}`);
    }
  }

  validatePasswordStrength(password: string): boolean {
    // Minimum requirements: 8+ chars, uppercase, lowercase, number, special char
    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return strongPasswordRegex.test(password);
  }
}
