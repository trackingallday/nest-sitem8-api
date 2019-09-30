import { NestMiddleware } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { Worker } from '../worker/worker.entity';

const { DBDATABASE, DBPASSWORD, DBPROVIDE, DBPOSTGRESUSERNAME, DBDIALECT, DBHOST, DBPORT } = process.env;

console.log( DBDATABASE, DBPASSWORD, DBPROVIDE, DBPOSTGRESUSERNAME, DBDIALECT, DBHOST, DBPORT)
const sequelize = new Sequelize(DBDATABASE, DBPOSTGRESUSERNAME, DBPASSWORD, {
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
