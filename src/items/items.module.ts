import { Module } from '@nestjs/common';
import { ItemsController } from './items.controller';
import { ItemsService } from './items.service';
import { itemsProviders } from './items.providers';
import { DatabaseModule } from '../db/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [ItemsController],
  providers: [
    ItemsService,
    ...itemsProviders,
  ],
})
export class ItemsModule {}
