import { BadRequestException, Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async register(registerDto: RegisterDto): Promise<User> {
    const { password, confirmPassword, ...userData } = registerDto;

    if (password !== confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const emailConfirmationToken = uuidv4();
    const user = User.create({
      ...userData,
      password: hashedPassword,
      emailConfirmationToken,
      isEmailConfirmed: false,
    });

    await user.save();
    return user;
  }

  async confirmEmail(token: string): Promise<User> {
    const user = await this.findOne({ where: { emailConfirmationToken: token } });
    if (!user) {
      throw new BadRequestException('Invalid or expired confirmation token');
    }

    user.isEmailConfirmed = true;
    user.emailConfirmationToken = null;
    return await this.save(user);
  }

  async login(email: string, password: string): Promise<User> {
    const user = await this.findOne({ where: { email } });
    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }

    if (!user.isEmailConfirmed) {
        throw new BadRequestException('Email not confirmed');
      }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new BadRequestException('Invalid credentials');
    }

    return user;
  }
}
