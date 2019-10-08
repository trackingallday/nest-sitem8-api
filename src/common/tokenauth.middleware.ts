import { NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { AccessTokenService } from '../accessToken/accessToken.service';


export class AuthenticationMiddleware implements NestMiddleware {

  constructor(private readonly accessTokenService: AccessTokenService) {}

  //req is an express object - but we use any to 
  async use(req:any, res: Response, next: Function) {
    const parts = req.path.split('/');
    const token = parts[parts.length - 1];
    const dbUser = await this.accessTokenService.getWorkerFromAccessToken(token);
    if(!dbUser) {
      throw new Error('Not Authorised');
    }
    req.dbUser = dbUser.toJSON();
    next();
  }
}