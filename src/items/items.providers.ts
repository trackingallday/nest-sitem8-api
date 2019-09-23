import { Item } from './items.entity';
import constants from '../constants';


export const itemsProviders = [
  {
    provide: constants.repositories.items,
    useValue: Item,
  },
];
