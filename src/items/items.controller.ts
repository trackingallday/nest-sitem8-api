import { Get, Post, Body, Param,Controller, UsePipes, Req } from '@nestjs/common';
import { Request } from 'express';
import { ItemsService } from './items.service';
import { Item } from './items.entity';
import CreateItemDto from './create-item.dto';
import { ValidationPipe } from '../common/validation.pipe';


@Controller('items')
export class ItemsController {

  constructor(private readonly itemsService: ItemsService) {
  }

  @Get()
  async findAll(@Req() req): Promise<Item[]> {
    return this.itemsService.findAll();
  }

  @Get('/:id')
  async findById(@Param() params): Promise<Item> {
    return this.itemsService.findById(parseInt(params.id));
  }

  @Post()
  @UsePipes(new ValidationPipe())
  async create(@Body() item: CreateItemDto) {
    this.itemsService.create(item);
  }

  @Post('/:id')
  @UsePipes(new ValidationPipe())
  async update(@Param() id: number, @Body() item: CreateItemDto) {
    const thisItem = await this.itemsService.findById(id);
    thisItem.set(item);
    await thisItem.save();
    return thisItem;
  }
}
