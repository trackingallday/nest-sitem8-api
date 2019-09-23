import { NestMiddleware } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { Worker } from '../worker/worker.entity';
import constants from '../constants';

const { database, password, provide, username } = constants.db.dev;
const sequelize = new Sequelize(database, username, password, {
  dialect: 'postgres',
});
sequelize.addModels([
  Worker,
]);

export class DbUserMiddleware implements NestMiddleware {

  async use(req, res, next) {
    if(req.user) {
      const params = { authId: req.user.sub };
      const dbUser = await Worker.findOne<Worker>({ where: params });
      req.dbUser = dbUser.toJSON();
    }
    next();
  };

}
