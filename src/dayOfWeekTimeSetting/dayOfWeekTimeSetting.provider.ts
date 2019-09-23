
import { DayOfWeekTimeSetting } from './dayOfWeekTimeSetting.entity';


export const DayOfWeekTimeSettingProvider = [
  {
    provide: 'DAYOFWEEKTIMESETTING_REPOSITORY',
    useValue: DayOfWeekTimeSetting,
  },
];

