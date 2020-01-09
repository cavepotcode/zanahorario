import 'reflect-metadata';
import { createKiwiServer, IKiwiOptions } from 'kiwi-server';
import { UserController } from './controllers/user.controller';
import { RequestFilterMiddleware } from './middlewares/requestFilter.middleware.before';
import { StaticMiddleware } from './middlewares/static.middleware';
import { IncomingMessage } from 'http';
import { AuthService } from './services/auth.service';
import { TimesheetController } from './controllers/timesheet.controller';
import { ProjectController } from './controllers/project.controller';
import { ReportsController } from './controllers/reports.controller';
import { CategoryController } from './controllers/category.controller';
import { ExpensesController } from './controllers/expenses.controller';
import { SecurityController } from './controllers/security.controller';
import { BillController } from './controllers/bill.controller';

async function validateAuthentication(request: IncomingMessage, roles: string[]) {
  const token = request.headers['authorization'];
  if (token) {
    const auth = new AuthService();
    request.user = auth.decode(token);
    return await auth.validate(token.toString());
  }
  return false;
}

StaticMiddleware.setConfig({ index: '/index.html', prefix: '/v1', root: './client/build' });

const options: IKiwiOptions = {
  controllers: [
    UserController,
    TimesheetController,
    ProjectController,
    ReportsController,
    ExpensesController,
    CategoryController,
    SecurityController,
    BillController
  ],
  authorization: validateAuthentication,
  // middlewares: [StaticMiddleware, RequestFilterMiddleware],
  cors: {
    enabled: true,
    domains: ['']
  },
  documentation: {
    enabled: true,
    path: '/apidoc'
  },
  prefix: '/v1',
  log: true,
  port: Number(process.env.PORT) || 8086
};

createKiwiServer(options);
