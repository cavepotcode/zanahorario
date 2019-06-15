import 'reflect-metadata';
import { Repository, createConnection } from 'typeorm';
import { User } from '../entities/User';

// TODO: connection type??
const connection: Promise<any> = createConnection({
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

export const userRepository: Promise<Repository<User>> = connection.then(connection => connection.getRepository(User));
