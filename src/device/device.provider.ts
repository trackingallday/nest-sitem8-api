
import { Device } from './device.entity';


export const DeviceProvider = [
  {
    provide: 'DEVICE_REPOSITORY',
    useValue: Device,
  },
];

