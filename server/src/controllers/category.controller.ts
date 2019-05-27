import { CategoryManager } from '../data_access/categoryManager';
import { JsonController, Authorize, Get } from 'kiwi-server';
import { ResponseOut } from '../sdk/response';
import { Enums } from '../sdk/enums';
import { environment } from '../../environment/environment';
import { Log } from '../sdk/logs';

@Authorize()
@JsonController('/category')
export class CategoryController {
  constructor(private manager: CategoryManager) {}

  @Get('/getAll')
  public getAll() {
    try {
      return this.manager.getAll();
    } catch (err) {
      Log.logError('category/getAll', err);
      return new ResponseOut(Enums.responseCode.Error, environment.common.genericErrorMessage);
    }
  }
}
