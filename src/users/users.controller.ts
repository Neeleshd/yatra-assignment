import { Body, Controller, Delete, Get, Param, Post, Put, Query, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  async findAll(@Query('type') type: number) {
    return await this.usersService.findAll(type);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Post()
  create(@Body() body: any) {
    return this.usersService.create(body);
  }

  @Put(':id')
  async update(@Body() body: any, @Param('id') id: string) {
    await this.usersService.update(body, id);
    return 'User updated successfully';
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.usersService.delete(id);
    return 'User deleted successfully'
  }

  @Post('login')
  async login(@Body() body: any) {
    return await this.usersService.login(body);
  }

  @Post('verify-otp')
  async verifyOtp(@Body() body: any) {
    return await this.usersService.verifyOtp(body);
  }

  @Post('upload-files/:id')
  @UseInterceptors(FilesInterceptor('images'))
  async uploadFiles(@Param() id: string, @UploadedFiles() files: any[]) {
    return await this.usersService.uploadFiles(id, files);
  }

  @Post('order/:userId')
  async orderProduct(@Param('userId') userId: string, @Body() body: any) {
    return await this.usersService.orderProduct(userId, body);
  }

  @Get('order/list/:userId')
  async getOrders(@Param('userId') userId: string) {
    return await this.usersService.getOrders(userId);
  }
}
