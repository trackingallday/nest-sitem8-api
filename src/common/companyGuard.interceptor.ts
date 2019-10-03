import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  data: T;
}

/*
designed to catch data from other companies from getting out

removes many lines of code that was in the MVC that did the same thing all over the place

intercept function scans the returned data in string form
looks for any company ids that don't match the users company id
if there is any match it errors out

shouldn't ever happen - but want to keep it as a security layer just in case - is fast so meh
*/

export class CompanyGuardInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    //get the original request with the dbUser attached
    const req = context.switchToHttp().getRequest();
    return next.handle().pipe(map(data => {

      //scan for company ids
      const companyIdMatches = JSON.stringify(data).match(/"companyId":([^,|}]*)/g);
      if(companyIdMatches) {
        //if theres a 'foriegn company id then throw an error
        if(companyIdMatches.map(m => m.replace(/\D/g,'')).find(
          m => m != req.dbUser.companyId)) {
            throw new Error("Not Allowed To See");
          }
      };

      return data;
    }));
  }
}
