import { Sequelize } from 'sequelize-typescript';
import constants from '../constants';

const { database, password, provide, username } = constants.db.dev;

export default new Sequelize(database, username, password, {
  dialect: 'postgres',
});

