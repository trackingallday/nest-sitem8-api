import { Item } from './items.entity';


export const itemsProviders = [
  {
    provide: 'ITEMS_REPOSITORY',
    useValue: Item,
  },
];
