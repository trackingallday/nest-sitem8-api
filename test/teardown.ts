import { Sequelize } from 'sequelize-typescript';

const { DBDATABASE, DBPASSWORD, DBPROVIDE, DBPOSTGRESUSERNAME, DBDIALECT, DBHOST, DBPORT } = process.env;

const sequelize = new Sequelize(DBDATABASE, DBPOSTGRESUSERNAME, DBPASSWORD, {
  dialect: 'postgres',
});

export default async function() {
  const tables = [
    'company',
    'item',
    'accesstoken',
    'worker',
    'device',
    'locationtimestamp',
    'notification',
    'site',
    'siteassignment',
    'timesheet',
    'timesheetentry',
    'workerassignment',
    'dayofweektimesetting'
  ];

  await Promise.all(tables.map(async t => await sequelize.query(`TRUNCATE TABLE ${t} CASCADE`)));
  await Promise.all(tables.map(async t => await sequelize.query(`ALTER SEQUENCE ${t}_id_seq RESTART WITH 1`)));

  console.log('TEARDOWN COMPLETE');

}
