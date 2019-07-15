import 'reflect-metadata';
import { getCustomRepository, Connection, Repository, createConnection, EntitySchema } from 'typeorm';
import { TimesheetRepository } from './timesheet.repo';
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
  if (!conn) throw new Error('Connection to db not available');

  switch (entity.name) {
    case Timesheet.name:
      return getCustomRepository(TimesheetRepository);
    default:
      return conn.getRepository(entity);
  }
}
