import { IMiddleware, MiddlewareBefore } from 'kiwi-server';
import { createReadStream } from 'fs';
import { extname, resolve } from 'path';
import { IncomingMessage, ServerResponse } from 'http';

const defaultConfig: IStaticContentConfig = {
  debug: false,
  index: '/index.html',
  prefix: '/v1',
  root: './client/build'
};

@MiddlewareBefore()
export class StaticMiddleware implements IMiddleware {
  private static config: IStaticContentConfig;
  public static setConfig(config: IStaticContentConfig) {
    StaticMiddleware.config = { ...defaultConfig, ...config };
  }

  execute(request: IncomingMessage, response: ServerResponse, next: any) {
    console.log('middleware');
    if (request.method !== 'GET' || request.url.includes(StaticMiddleware.config.prefix)) {
      return next();
    }

    const url = extname(request.url) ? request.url : StaticMiddleware.config.index;
    const stream = createReadStream(`${StaticMiddleware.config.root}${url}`);

    stream.on('error', (err: any) => {
      if (!(err.statusCode < 500)) {
        console.log('middleware', err);
        next(err);
        return;
      }

      next();
    });

    stream.pipe(response);
  }
}

export interface IStaticContentConfig {
  debug?: boolean;
  index?: string;
  prefix?: string;
  root?: string;
}
