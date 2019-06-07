import { environment } from '../../environment/environment';
import { SqlManager } from './sql_manager/sqlManager';
import { CategoryDataInfo } from '../sdk/data_info/category/categoryDataInfo';
import { ResponseOut } from '../sdk/response';
import { Enums } from '../sdk/enums';
const path = require('path');

export class CategoryManager {
  async getAll() {
    const pathImage = environment.common.pathImage;
    const str = 'SELECT * FROM Categories';
    const manager = new SqlManager(environment.db);
    const res = await manager.executeQuery(str);

    const ret = <CategoryDataInfo[]>[];
    res.forEach((element: any) => {
      const aux = new CategoryDataInfo();
      aux.id = element.Id;
      aux.description = element.Description;
      aux.color = element.Color;

      if (!element.Icono) {
        aux.iconoName = path.resolve('./', pathImage);
      } else {
        aux.iconoName = element.Icono;
      }

      ret.push(aux);
    });

    return new ResponseOut(Enums.responseCode.Ok, '', ret);
  }
}
