import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({path: path.resolve(__dirname + '/.env.test') });
import { databaseProviders } from '../src/db/database.providers';
import { Company } from '../src/company/company.entity';
import { Worker } from '../src/worker/worker.entity';
import { Device } from '../src/device/device.entity';
import { Site } from '../src/site/site.entity';
import { LocationTimestamp } from '../src/locationTimestamp/locationTimestamp.entity';
import { genLocationTimestamp } from './dataGenerators';
import testconstants from './test-constants';

export default async function() {
  const seqfactory = databaseProviders[0];
  const seq = await seqfactory.useFactory();
  const companyRepo =  seq.getRepository(Company);
  const workerRepo = seq.getRepository(Worker);
  const deviceRepo = seq.getRepository(Device);
  const siteRepo = seq.getRepository(Site);
  const locRepo = seq.getRepository(LocationTimestamp);
  await companyRepo.create(testconstants.company);
  await workerRepo.create(testconstants.admin);
  await workerRepo.create(testconstants.supervisor);
  await workerRepo.create(testconstants.worker);
  await deviceRepo.create(testconstants.device);
  await siteRepo.create(testconstants.site);
  const locs = testconstants.nearOrbicaPoints.map((c, i) => {
    return genLocationTimestamp(testconstants.device.deviceId, c[1], c[0], i);
  });
  await Promise.all(locs.map(l => locRepo.create(
    { ...l, closestSiteId: 1, closestSiteDistance: Math.random() * 30, workerId: 3 })));
}
