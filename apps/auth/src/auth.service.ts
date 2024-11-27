import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import  
{ User } from '../src/user/entities/user.entity'; 
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class  
 AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService  

  ) {}

  async signUp(email: string, password: string): Promise<void> { 
    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltOrRounds);

    const user = this.usersRepository.create({
      email,
      password: hashedPassword,
    });
    try {
      await this.usersRepository.save(user);
    } catch (error)  
 { 
      // Handle duplicate email error (usually a unique constraint violation)
    }
  }

  async signIn(email: string, password: string): Promise<{ accessToken: string }> {
    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid  
 = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new  
 UnauthorizedException('Invalid email or password');
    }

    const payload = { email: user.email,  
 sub: user.id }; 
    return {
      accessToken: await this.jwtService.signAsync(payload),
    };
  }
}