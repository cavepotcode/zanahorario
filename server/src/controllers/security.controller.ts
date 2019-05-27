import { JsonController, Post, Body } from 'kiwi-server';
import { LoginDataIn } from '../sdk/data_in/login_data_in';
import { ResponseOut } from '../sdk/response';
import { Enums } from '../sdk/enums';
import { environment } from '../../environment/environment';
import { Log } from '../sdk/logs';
import { UserManager } from '../data_access/userManager';

@JsonController('/security')
export class SecurityController {
  constructor(private manager: UserManager) {}

  @Post('/login')
  public login(@Body() body: LoginDataIn) {
    try {
      return this.manager.login(body);
    } catch (err) {
      Log.logError('security/login', err);
      return new ResponseOut(Enums.responseCode.Error, environment.common.genericErrorMessage);
    }
  }
}
