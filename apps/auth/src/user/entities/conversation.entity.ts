import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { ImportanceLevel } from './importanceLevel.entity';

@Entity()
export class Conversation {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  text: string;

  @Column()
  date: Date;

  @ManyToOne(() => ImportanceLevel, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'importanceLevelId' })
  importanceLevel: ImportanceLevel;
}
