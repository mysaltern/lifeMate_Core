import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ImportanceLevel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string; // E.g., 'low', 'medium', 'high'
}