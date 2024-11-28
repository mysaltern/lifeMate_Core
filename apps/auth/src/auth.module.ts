import { Module, Injectable, OnModuleInit } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/entities/user.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { UserModule } from './user/user.module';

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
    ConfigModule.forRoot(), // Load environment variables
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule,UserModule],
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
    TypeOrmModule.forFeature([User]),
  
  ],
  controllers: [AuthController],
  providers: [AuthService, EntityLogger],
})
export class AuthModule {}