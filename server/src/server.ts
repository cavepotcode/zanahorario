import 'reflect-metadata';
import { createKiwiServer, IKiwiOptions } from 'kiwi-server';
import { UserController } from './controllers/user.controller';
import { RequestFilterMiddleware } from './middlewares/RequestFilter.middleware.before';
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
  middlewares: [RequestFilterMiddleware],
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
  port: 8086
};
const server = createKiwiServer(options);
