import { NestMiddleware } from '@nestjs/common';
import * as jwt from 'express-jwt';
import { expressJwtSecret } from 'jwks-rsa';
import constants from '../constants';

export class AuthenticationMiddleware implements NestMiddleware {
  use(req, res, next) {
    jwt({
      secret: expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 50,
        jwksUri: `https://${constants.auth0_clientside.domain}/.well-known/jwks.json`,
      }),

      audience: 'https://sitem8.au.auth0.com/api/v2/',
      issuer: `https://${constants.auth0_clientside.domain}/`,
      algorithm: 'RS256',
      clientID: constants.auth0_clientside.client_id,
      responseType: 'token id_token',
      scope: 'openid email profile',
    })(req, res, err => {
      if (err) {
        const status = err.status || 500;
        const message =
          err.message || 'Sorry, we were unable to process your request.';
        return res.status(status).send({
          message,
        });
      }
      next();
    });
  };
}
