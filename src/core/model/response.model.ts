import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsObject, IsString } from "class-validator";

export class Result {
  constructor(success: boolean, message: string, data?: object) {
    this.success = success;
    this.message = message;
    this.data = data;
  }

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  private success: boolean;
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  private message: string;
  @ApiProperty({ required: false })
  @IsObject()
  private data?: object;
}
