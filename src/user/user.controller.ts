import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UsePipes,
  ValidationPipe,
  Get,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { UserService } from './user.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { User } from './entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { AuthService } from 'src/auth/auth.service';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post('register')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @ApiOperation({ summary: 'Create a user' })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully created.',
    type: User,
  })
  @ApiResponse({ status: 400, description: 'Invalid input.' })
  async register(@Body() registerDto: RegisterDto) {
    const user = await this.userService.register(registerDto);
    return {
      message:
        'Registration successful. Please check your email to confirm your account.',
      emailToken: user.emailConfirmationToken,
    };
  }

  @Get('confirm-email')
  @ApiOperation({ summary: 'Confirm user email' })
  @ApiResponse({ status: 200, description: 'Email confirmed successfully' })
  @ApiResponse({ status: 400, description: 'Invalid token' })
  async confirmEmail(@Query('token') token: string) {
    try {
      await this.userService.confirmEmail(token);
      return { message: 'Email confirmed successfully' };
    } catch (error) {
      throw new BadRequestException('Invalid or expired confirmation token');
    }
  }

  @Post('login')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 201, description: 'User logged in successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input.' })
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto): Promise<{ accessToken: string }> {
    const { accessToken } = await this.userService.login(
      loginDto.email,
      loginDto.password,
    );
    return { accessToken };
  }

  @Post('refresh-token')
  @ApiOperation({ summary: 'Refresh access token using refresh token' })
  @ApiResponse({ status: 201, description: 'New access token generated' })
  @ApiResponse({ status: 400, description: 'Invalid input.' })
  async refreshToken(
    @Body('refreshToken') refreshToken: string,
  ): Promise<{ accessToken: string }> {
    const payload = await this.authService.verifyRefreshToken(refreshToken);
    const { accessToken } = await this.authService.generateTokens(
      payload.userId,
    );
    return { accessToken };
  }
}
