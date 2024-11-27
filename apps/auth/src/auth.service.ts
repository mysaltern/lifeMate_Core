import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async signUp(email: string, password: string): Promise<{ status: string; message: string }> {
    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltOrRounds);

    const user = this.usersRepository.create({
      email,
      password: hashedPassword,
    });

    try {
      await this.usersRepository.save(user);
      return {
        status: 'success',
        message: 'User successfully registered',
      };
    } catch (error) {
      if (error.code === '23505') {
        // Unique constraint violation (e.g., duplicate email)
        return {
          status: 'error',
          message: 'Email is already in use',
        };
      }
      throw new Error('Registration failed. Please try again later.');
    }
  }

  async signIn(email: string, password: string): Promise<{ status: string; message: string; accessToken?: string }> {
    const user = await this.usersRepository.findOne({ where: { email } });

    if (!user) {
      return {
        status: 'error',
        message: 'Invalid email or password',
      };
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return {
        status: 'error',
        message: 'Invalid email or password',
      };
    }

    const payload = { email: user.email, sub: user.id };
    const accessToken = await this.jwtService.signAsync(payload);

    return {
      status: 'success',
      message: 'Sign-in successful',
      accessToken,
    };
  }
}
