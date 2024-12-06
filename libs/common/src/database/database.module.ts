import { Module, Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import * as path from 'path';

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
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: path.resolve('./apps/auth/.env'),
    }),
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
          autoLoadEntities: true, // Automatically load entities registered with TypeOrmModule.forFeature
          synchronize: true,
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [EntityLogger],
  exports: [TypeOrmModule], // Export TypeOrmModule for other modules to use
})
export class DatabaseModule {}
