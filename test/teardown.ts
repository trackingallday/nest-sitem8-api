import { Sequelize } from 'sequelize-typescript';

const { DBDATABASE, DBPASSWORD, DBPROVIDE, DBPOSTGRESUSERNAME, DBDIALECT, DBHOST, DBPORT } = process.env;

const sequelize = new Sequelize(DBDATABASE, DBPOSTGRESUSERNAME, DBPASSWORD, {
  dialect: 'postgres',
});

export default async function() {
  const tables = [
    'item',
    'locationtimestamp',
    'accesstoken',
    'notification',
    'site',
    'siteassignment',
    'timesheet',
    'timesheetentry',
    'workerassignment',
    'dayofweektimesetting',
    'locationevent',
    'device',
    'worker',
    'company',
  ];

  await new Promise((res) => setTimeout(res, 5000));

  //clear all data - reset autoincrements
  await Promise.all(tables.map(async t => await sequelize.query(`TRUNCATE TABLE ${t} CASCADE`)));
  await Promise.all(tables.map(async t => await sequelize.query(`ALTER SEQUENCE ${t}_id_seq RESTART WITH 1`)));

  console.log('TEARDOWN COMPLETE');
  process.exit();

}
