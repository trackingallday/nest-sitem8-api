import { Sequelize } from 'sequelize-typescript';
import constants from '../constants';

const { DBDATABASE, DBPASSWORD, DBPROVIDE, DBPOSTGRESUSERNAME, DBDIALECT, DBHOST, DBPORT } = process.env;

export default new Sequelize(DBDATABASE, DBPOSTGRESUSERNAME, DBPASSWORD, {
  dialect: 'postgres',
});

