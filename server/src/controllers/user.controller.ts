import { JsonController, Get, Post, Param, Body, Authorize, QueryParam } from 'kiwi-server';
import { Log } from '../sdk/logs';
import { UserManager } from '../data_access/userManager';
import { UserDataInfo } from '../sdk/data_info/user/userDataInfo';
import { UserService } from '../services/user.service';
import { IDateFilter } from '../dto/date-filter.interface';
import { Response } from '../sdk/response';
import { ResponseCode } from '../sdk/constants';
import { environment } from '../../environment/environment';

@JsonController('/user')
@Authorize()
export class UserController {
  constructor(private userSvc: UserService, private manager: UserManager) {}

  @Get('/getCurrentUser')
  public getCurrentUser() {
    const manager = new UserManager();
    return manager.getCurrentUser();
  }

  @Get('/getUser')
  public getUser() {
    return this.manager.getUser();
  }

  @Post('/updateUser')
  public updateUser(@Body() body: UserDataInfo) {
    return this.manager.updateUser(body);
  }

  @Get('/users')
  public async getUsersTimesheets(@QueryParam() params: IDateFilter) {
    try {
      const { year, month } = params;
      const result = await this.userSvc.userHours(year, month);
      return new Response(ResponseCode.OK, '', result);
    } catch (err) {
      Log.logError('UserController.getUsersTimesheets', err);
      return new Response(ResponseCode.ERROR, environment.common.genericErrorMessage);
    }
  }
}
