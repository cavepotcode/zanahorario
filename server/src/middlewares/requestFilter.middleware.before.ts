import { IMiddleware, MiddlewareBefore } from 'kiwi-server';
import * as http from 'http';

@MiddlewareBefore()
export class RequestFilterMiddleware implements IMiddleware {
  execute(request: http.IncomingMessage, response: http.ServerResponse, next: any) {
    response.setHeader('Access-Control-Allow-Headers', 'Token');
    next();
  }
}
