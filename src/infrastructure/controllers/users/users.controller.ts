import { Body, Controller, Delete, Get, Inject, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UserEntity } from '../../entities/user.entity';
import { CreateUserDto, UpdateUserDto } from '../../entities/dtos/user/user.dto';
import { JwtAuthGuard } from '@infrastructure/common/guards/auth.guard';
import { IUserServiceInterface, USER_PORT_SERVICE, Result } from '@core';

@Controller('users')
@ApiResponse({ status: 401, description: 'No authorization token was found' })
@ApiResponse({ status: 500, description: 'Internal error' })
export class UsersController {
  constructor(
    @Inject(USER_PORT_SERVICE)
    private readonly userServiceInterface: IUserServiceInterface
  ) {}

  @ApiBearerAuth()
  @ApiResponse({ description: "Find all users", type: Array<UserEntity> })
  @ApiOperation({ summary: 'Find all users' })
  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(): Promise<Result> {
    return await this.userServiceInterface.findAll();
  }

  @ApiBearerAuth()
  @ApiResponse({ description: "Find user", type: UserEntity })
  @ApiOperation({ summary: 'Find user' })
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Result> {    
    return await this.userServiceInterface.findOne(id);
  }

  @ApiResponse({ description: "Create user", type: CreateUserDto })
  @ApiOperation({ summary: 'Create user' })
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.userServiceInterface.create(createUserDto);
  }

  @ApiBearerAuth()
  @ApiResponse({ description: "Update user", type: UpdateUserDto })
  @ApiOperation({ summary: 'Update user' })
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    return await this.userServiceInterface.update(id, updateUserDto);
  }

  @ApiBearerAuth()
  @ApiResponse({ description: "Delete user", type: [Number] })
  @ApiOperation({ summary: 'Delete user' })
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: number) {
    return this.userServiceInterface.delete(id);
  }
}
