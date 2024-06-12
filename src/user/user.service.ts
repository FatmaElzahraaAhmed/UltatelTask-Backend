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

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly authService: AuthService
  ) {}
  async register(registerDto: RegisterDto): Promise<User> {
    const { password, confirmPassword } = registerDto;

    if (password !== confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }
    try {
      return await this.userRepository.register(registerDto);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('Email is already taken');
      }
    }
  }

  async login(email: string, password: string): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.userRepository.login(email, password);
    const { accessToken, refreshToken } = await this.authService.generateTokens(user.id);
    return { accessToken, refreshToken };
  }


  async validateUser(userId: number) {
    return await User.findOneBy({ id: userId });
  }
}
