import { Module, Injectable, OnModuleInit } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/entities/user.entity'; 
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { DataSource } from 'typeorm';

@Injectable()
class EntityLogger implements OnModuleInit {
  constructor(private readonly dataSource: DataSource) {}

  async onModuleInit() {
    const entities = this.dataSource.entityMetadatas.map((meta) => meta.name);
    console.log('Loaded entities:', entities);
  }
}

@Module({
  imports: [
    // Load environment variables
    ConfigModule.forRoot(),

    // Configure TypeORM with explicit entity import
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const dbPassword = String(configService.get<string>('DB_PASSWORD'));
        return {
          type: 'postgres',
          host: configService.get<string>('DB_HOST'),
          port: configService.get<number>('DB_PORT'),
          username: configService.get<string>('DB_USERNAME'),
          password: dbPassword,
          database: configService.get<string>('DB_NAME'),
          entities: [User],
          synchronize: true,
        };
      },
      inject: [ConfigService],
    }),

    // Register specific entities for this module
    TypeOrmModule.forFeature([User]),

    // JWT Module for Authentication
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
      inject: [ConfigService],
    }),

    // Import the UserModule
    UserModule,
  ],

  // Register controllers and services
  controllers: [AuthController],
  providers: [AuthService, EntityLogger],
})
export class AuthModule {}
