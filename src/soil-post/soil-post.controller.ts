import { Controller, Get, Post, Body, Patch, Delete, Param } from '@nestjs/common';
import { SoilPostService } from './soil-post.service';

@Controller('soil-posts')
export class SoilPostController {
  constructor(private readonly service: SoilPostService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get('hidden')
  findHidden() {
    return this.service.findHidden();
  }

  @Post()
  create(@Body() body: any) {
    return this.service.create(body);
  }

  @Patch(':id/hide')
  hide(@Param('id') id: string) {
    return this.service.hide(Number(id));
  }

  @Patch(':id/restore')
  restore(@Param('id') id: string) {
    return this.service.restore(Number(id));
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.service.update(Number(id), body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(Number(id));
  }
}