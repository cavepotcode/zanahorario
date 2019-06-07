import { JsonController, Get, Post, Param, Body, Authorize } from 'kiwi-server';
import { Log } from '../sdk/logs';
import { UserManager } from '../data_access/userManager';
import { UserDataInfo } from '../sdk/data_info/user/userDataInfo';

@JsonController('/user')
@Authorize()
export class UserController {
  constructor(private manager: UserManager) {}

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
}
