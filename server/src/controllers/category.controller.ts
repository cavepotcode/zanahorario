import { CategoryManager } from '../data_access/categoryManager';
import { JsonController, Authorize, Get } from 'kiwi-server';
import { Response } from '../sdk/response';
import { ResponseCode } from '../sdk/constants';
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
      return new Response(ResponseCode.ERROR, environment.common.genericErrorMessage);
    }
  }
}
