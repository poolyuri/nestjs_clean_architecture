import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class CreateTodoDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  name: string;
  
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsBoolean()
  isDone: boolean;
};

export class CreatedTodoDto extends CreateTodoDto {};
export class UpdateTodoDto extends CreateTodoDto {};
