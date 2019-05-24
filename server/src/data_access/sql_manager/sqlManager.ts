import { forEach, isNil } from 'lodash';
import { ResponseOut } from '../../sdk/response';
const sql = require('mssql');
export { sql };

export class SqlParameter {
  constructor(name: string, type: any, value: any) {
    this.name = name;
    this.value = value;
    this.type = type;
  }
  name: string;
  value: any;
  type: any;
}

export class SqlManager {
  private pool: any;
  private config: any;

  constructor(config: any) {
    this.config = config;
  }

  public async connect() {
    if (isNil(this.pool) || !this.pool.connected) {
      this.pool = await new sql.ConnectionPool(this.config);
      if (!this.pool.connected) {
        await this.pool.connect(this.config);
      }
    }
  }

  public async close() {
    await sql.close();
  }

  public async executeQuery(query: string, params?: SqlParameter[]) {
    try {
      await this.connect();
      const ps = new sql.PreparedStatement(this.pool);
      const paramObj: any = {};
      if (params) {
        forEach(params, (param: any) => {
          ps.input(param.name, param.type);
          paramObj[param.name] = param.value;
        });
      }

      await ps.prepare(query);
      const result = await ps.execute(paramObj);
      await ps.unprepare();
      await this.close();
      return result.recordset;
    } catch (error) {
      console.log(error);
      await this.close();
      throw new ResponseOut(1, error.message);
    }
  }

  public async executeNonQuery(query: string, params?: SqlParameter[]) {
    try {
      await this.connect();
      const ps = new sql.PreparedStatement(this.pool);
      const paramObj: any = {};

      if (params) {
        forEach(params, (param: any) => {
          ps.input(param.name, param.type);
          paramObj[param.name] = param.value;
        });
      }

      await ps.prepare(query);
      await ps.execute(paramObj);
      await ps.unprepare();
      await this.close();
    } catch (error) {
      console.log(error);
      await this.close();
      throw new ResponseOut(1, error.message);
    }
  }
}
