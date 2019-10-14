import * as httpMocks from 'node-mocks-http';

export function mockPost(url: string, params: any, dbUser: any) {
  const req = httpMocks.createRequest({
    method: 'POST',
    url,
    body: params,
  });
  req.dbUser = dbUser;
  return req;
}

export function mockGet(url: string, dbUser: any) {
  const req = httpMocks.createRequest({
    method: 'GET',
    url,
  });
  req.dbUser = dbUser;
  return req;
}
