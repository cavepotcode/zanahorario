import { JsonController, Post, Body } from 'kiwi-server';
import { LoginDataIn } from '../sdk/data_in/login_data_in';
import { Response } from '../sdk/response';
import { ResponseCode } from '../sdk/constants';
import { environment } from '../../environment/environment';
import { Log } from '../sdk/logs';
import { AuthService } from '../services/auth.service';

@JsonController('/security')
export class SecurityController {
  constructor(private auth: AuthService) {}

  @Post('/login')
  public login(@Body() body: LoginDataIn) {
    try {
      return this.auth.login(body);
    } catch (err) {
      Log.logError('security/login', err);
      return new Response(ResponseCode.ERROR, environment.common.genericErrorMessage);
    }
  }
}
