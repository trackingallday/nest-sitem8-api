import { Test, TestingModule } from '@nestjs/testing';
import { DeviceController } from '../src/device/device.controller';
import { DeviceDto } from '../src/device/device.dto';
import { DeviceModule } from '../src/device/device.module';
import { DatabaseModule } from '../src/db/database.module';


let mockCreatePassword = jest.fn();
mockCreatePassword.mockReturnValue("password");

jest.mock('../src/common/global', function() {
  return { createPassword: jest.fn().mockImplementation(() => {
    return mockCreatePassword();
  })
  }
});


describe('tests the Access Token', () => {

  let deviceController: DeviceController;
  let device_id: number;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule, DeviceModule],
    }).compile();
    deviceController = app.get<DeviceController>(DeviceController);
  });

  describe('test up the device service', () => {

    it('creates device', async () => {
      const props:DeviceDto = {
        companyId: 1,
        deviceId: '2345fgbsdfw456436',
      }
      const dev:any = await deviceController.create(props);
      expect(dev.id).toBeTruthy();
      device_id = dev.id;
    });

    it('gets one device', async () => {
      const dev:any = await deviceController.findById(device_id);
      expect(dev.companyId).toBe(1);
    });

    it('gets all the devices', async () => {
      const devs = await deviceController.findAll();
      expect(devs.length).toBeGreaterThan(1);
    });

    it('updates the device', async () => {
      const props:DeviceDto = {
        deviceId: '555555555555',
        companyId: 1,
      }
      const dev:any = await deviceController.update(device_id, props);
      expect(dev.deviceId).toBe('555555555555');
    });

  });

});

