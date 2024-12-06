import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Conversation } from './conversation.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Conversation, (conversation) => conversation.user)
  conversations: Conversation[];
}
