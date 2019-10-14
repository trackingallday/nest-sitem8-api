import { NestMiddleware } from '@nestjs/common';
import { WorkerService } from '../worker/worker.service';


export class DbUserMiddleware implements NestMiddleware {

  constructor(private readonly workerService: WorkerService) {}

  //req is an express object - but we use any to make typscript not flip out
  async use(req:any, res: Response, next:Function) {
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
