import 'reflect-metadata';
import { getCustomRepository, Connection, Repository, createConnection, EntitySchema } from 'typeorm';
import { TimesheetRepository } from './timesheet.repo';
import { ExpenseRepository } from './expense.repo';
import { Expense } from '../entities/Expense';
import { Project } from '../entities/Project';
import { Timesheet } from '../entities/Timesheet';
import { User } from '../entities/User';

const connection: Promise<void | Connection> = createConnection({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [Project, Timesheet, User],
  synchronize: false,
  logging: false
}).catch((error: any) => console.log(error));

export async function getRepository<T>(entity: new () => T): Promise<any> {
  const conn = await connection;
  console.log('conn', conn);
  console.log('entity', entity, entity.name);
  if (!conn) throw new Error('Connection to db not available');

  switch (entity.name) {
    case Timesheet.name:
      return getCustomRepository(TimesheetRepository);
    case Expense.name:
      return getCustomRepository(ExpenseRepository);
    default:
      return conn.getRepository(entity);
  }
}
