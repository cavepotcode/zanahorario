import { IMiddleware, MiddlewareBefore } from 'kiwi-server';
import { createReadStream } from 'fs';
import { extname, resolve } from 'path';
import { IncomingMessage, ServerResponse } from 'http';

const staticRoot = './client/build';

@MiddlewareBefore()
export class StaticMiddleware implements IMiddleware {
  // static debug = false;
  // static root = '../client/build';
  // static index = './index.html';

  execute(request: IncomingMessage, response: ServerResponse, next: any) {
    if (request.url.includes('/v1')) {
      return next();
    }

    const url = extname(request.url) ? request.url : '/index.html';
    const stream = createReadStream(`${staticRoot}${url}`);

    stream.on('error', (err: any) => {
      if (!(err.statusCode < 500)) {
        next(err);
        return;
      }

      next();
    });

    stream.pipe(response);
  }
}
