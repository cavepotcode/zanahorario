import 'reflect-metadata';
import { Connection, Repository, createConnection, EntitySchema } from 'typeorm';
import { User } from '../entities/User';

const connection: Promise<void | Connection> = createConnection({
  type: 'postgres',
  host: process.env.DB_SERVER || 'localhost',
  port: Number(process.env.DB_PORT || '5432'),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [User],
  synchronize: true,
  logging: false
}).catch((error: any) => console.log(error));

export async function getRepository<T>(entity: new () => T): Promise<Repository<T>> {
  const conn = await connection;
  if (!conn) throw new Error('Connection to db not available');

  return conn.getRepository(entity);
}
