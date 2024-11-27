import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from '../user/entities/user.entity'; 

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>, 
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const newUser = this.usersRepository.create(createUserDto);
      return await this.usersRepository.save(newUser); 
    } catch (error) {
      // More specific error handling
      if (error.code === '23505') { 
        // Unique constraint violation (e.g., duplicate email)
        throw new BadRequestException('Email already exists'); 
      } else if (error.name === 'QueryFailedError') {
        // More detailed information from TypeORM
        if (error.message.includes('duplicate key value violates unique constraint')) {
          // Extract the column name causing the conflict (e.g., email, username)
          const columnName = error.detail.match(/Key \((.+)\)=\(/)[1]; 
          throw new BadRequestException(`${columnName} already exists`);
        } else {
          throw new BadRequestException(`Database error: ${error.message}`); 
        }
      } else {
        // For other unexpected errors
        console.error(error); // Log the full error for debugging
        throw new BadRequestException('Failed to create user'); 
      }
    }
  }

  async findAll(): Promise<User[]> {
    return await this.usersRepository.find();
  }

  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id); // Use findOne to check if the user exists

    // Update the user object with the new data
    Object.assign(user, updateUserDto);

    return await this.usersRepository.save(user);
  }

  async remove(id: number): Promise<void> {
    const result = await this.usersRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }
}