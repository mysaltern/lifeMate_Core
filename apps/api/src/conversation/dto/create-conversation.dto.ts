import { IsUUID, IsString, IsNotEmpty } from 'class-validator';

export class CreateConversationDto {
  @IsString()
  @IsNotEmpty()
  text: string;

  @IsString()
  @IsNotEmpty()
  date: string;

  @IsUUID()
  userId: Number; // Foreign key reference to user.id

  @IsUUID()
  importanceLevelId: string; // Foreign key reference to importance_level.id
}
