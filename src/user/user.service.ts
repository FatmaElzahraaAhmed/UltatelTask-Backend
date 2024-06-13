import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { User } from './entities/user.entity';
import { UserRepository } from './user.repository';
import { AuthService } from '../auth/auth.service';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly authService: AuthService,
    private readonly emailService: EmailService,
  ) {}

  async register(registerDto: RegisterDto): Promise<User> {
    const { password, confirmPassword, email } = registerDto;

    if (password !== confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }
    try {
      const user = await this.userRepository.register(registerDto);
      await this.emailService.sendConfirmationEmail(
        user.email,
        user.emailConfirmationToken,
      );
      return user;
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('Email is already taken');
      }
      throw error;
    }
  }

  async resendConfirmationEmail(email: string): Promise<void> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (user.isEmailConfirmed) {
      throw new BadRequestException('Email is already confirmed');
    }

    await this.emailService.sendConfirmationEmail(
      user.email,
      user.emailConfirmationToken,
    );
  }

  async confirmEmail(token: string): Promise<void> {
    await this.userRepository.confirmEmail(token);
  }
  
  async login(
    email: string,
    password: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.userRepository.login(email, password);
    const { accessToken, refreshToken } = await this.authService.generateTokens(
      user.id,
    );
    return { accessToken, refreshToken };
  }

  async validateUser(userId: number) {
    return await User.findOneBy({ id: userId });
  }
}
