import { JsonController, Get, Post, Param, Body, Authorize } from 'kiwi-server';
import { Log } from '../sdk/logs';
import { UserManager } from '../data_access/userManager';
import { UserDataInfo } from '../sdk/data_info/user/userDataInfo';

@JsonController('/user')
@Authorize()
export class UserController {
    constructor(private manager: UserManager){}

    @Get('/getCurrentUser')
    public GetCurrentUser() {
        var manager = new UserManager();
        return manager.GetCurrentUser();
    }

    @Get('/getUser')
    public GetUser() {
        return this.manager.GetUser();
    }

    @Post('/updateUser')
    public UpdateUser(@Body() body: UserDataInfo) {
        return this.manager.UpdateUser(body);
    }

}