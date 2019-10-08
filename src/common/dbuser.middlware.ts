import { NestMiddleware } from '@nestjs/common';
import { WorkerService } from '../worker/worker.service';


export class DbUserMiddleware implements NestMiddleware {

  constructor(private readonly workerService: WorkerService) {}

  async use(req, res, next) {
    if(req.user) {
      const params = { authId: req.user.sub };
      const dbUser = await this.workerService.findOneWhere({ where: params });
      if(!(dbUser && dbUser.isEnabled)) {
        throw new Error('Not Authorised');
      }
      req.dbUser = dbUser.toJSON();
    }
    next();
  };

}
