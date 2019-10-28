import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({path: path.resolve(__dirname + '/.env.test') });
import { databaseProviders } from '../src/db/database.providers';
import { Company } from '../src/company/company.entity';
import { Worker } from '../src/worker/worker.entity';
import { Device } from '../src/device/device.entity';
import { Site } from '../src/site/site.entity';
import { LocationTimestamp } from '../src/locationTimestamp/locationTimestamp.entity';
import { genLocationTimestamp } from './utils/dataGenerators';
import testconstants from './testdata/test-constants';


async function setupAsync() {
  const seqfactory = databaseProviders[0];
  const seq = await seqfactory.useFactory();
  const companyRepo =  seq.getRepository(Company);
  const workerRepo = seq.getRepository(Worker);
  const deviceRepo = seq.getRepository(Device);
  const siteRepo = seq.getRepository(Site);
  const locRepo = seq.getRepository(LocationTimestamp);

  await companyRepo.create(testconstants.company);

  await workerRepo.create(testconstants.admin);// id 1
  await workerRepo.create(testconstants.supervisor);// id 2
  await workerRepo.create(testconstants.worker);// id 3
  await workerRepo.create(testconstants.worker2);//id 4

  await deviceRepo.create(testconstants.device);// id 1
  await deviceRepo.create(testconstants.device2);// id 2

  await siteRepo.create(testconstants.site);// 1

  const locs = testconstants.nearOrbicaPoints.map(
    (c, i) => genLocationTimestamp(testconstants.device.deviceId, c[1], c[0], i));

  await locRepo.bulkCreate(locs.map(
    (l, i) => ({ ...l, closestSiteId: 1, closestSiteDistance: i * 30, workerId: 3 })));

}

export default async function setup() {
  await setupAsync();
}
