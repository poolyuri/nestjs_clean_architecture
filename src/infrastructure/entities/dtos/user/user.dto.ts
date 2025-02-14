import { ApiProperty, OmitType } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Exclude } from 'class-transformer';
import { Column } from 'typeorm';

export class CreateUserDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  username: string;
  
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  @Column({ select: false })
  password: string;
};

export class CreatedUserDto {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  @Exclude()
  password: string;
};

export class UpdateUserDto extends OmitType(CreateUserDto, ['password' as const]) {};
