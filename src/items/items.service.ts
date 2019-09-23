import { Injectable, Inject } from '@nestjs/common';
import { Item } from './items.entity';
import { ItemInterface } from './items.interface';
import constants from '../constants'

@Injectable()
export class ItemsService {

  @Inject(constants.repositories.items) private readonly ITEMS_REPOSITORY: typeof Item;

  async findAll(): Promise<Item[]> {
    const items = await this.ITEMS_REPOSITORY.findAll<any>();
    return items.map(i => ({ ...i.toJSON(), companyId: 18 }))
  }

  async create(itemprops: ItemInterface): Promise<Item> {
    return await this.ITEMS_REPOSITORY.create<Item>(itemprops);
  }

  async findById(id: number): Promise<Item> {
    return await this.ITEMS_REPOSITORY.findByPk<Item>(id);
  }
}
