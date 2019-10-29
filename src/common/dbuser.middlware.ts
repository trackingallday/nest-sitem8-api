import { NestMiddleware, Injectable } from '@nestjs/common';
import { WorkerService } from '../worker/worker.service';
import { Company } from '../company/company.entity';

@Injectable()
export class DbUserMiddleware implements NestMiddleware {

  constructor(private readonly workerService: WorkerService) {
    this.workerService = workerService;
  }

  //req is an express object - but we use any to make typscript not flip out
  async use(req:any, res: Response, next:Function) {
    if(req.user) {
      const params = { where : { authId: req.user.sub }, include: [Company] };
      const dbUser = await this.workerService.findOneWhere(params);//auth0|5be35d20d6269e68e95b2a00                 
      //const dbUser = await this.workerService.findAll();//auth0|5be35d20d6269e68e95b2a00                 
      if(!(dbUser && dbUser.isEnabled)) {
        throw new Error('Not Authorised');
      }
      req.dbUser = dbUser.toJSON();
    }
    next();
  };

}
