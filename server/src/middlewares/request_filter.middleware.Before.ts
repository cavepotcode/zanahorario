import { IMiddleware } from 'kiwi-server';
import { MiddlewareBefore } from 'kiwi-server';

import * as http from 'http';

@MiddlewareBefore()
export class request_filterMiddleware implements IMiddleware {

    execute(request: http.IncomingMessage, response: http.ServerResponse, next: any) {
        response.setHeader('Access-Control-Allow-Headers', 'Token');
        next();
    }
}