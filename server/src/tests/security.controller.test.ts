import { suite, test } from 'mocha-typescript';
import { assert } from 'chai';
import { AuthService } from '../services/auth.service';
import { SecurityController } from '../controllers/security.controller';
import { ResponseCode } from '../sdk/constants';
import { Response } from '../sdk/response';
const sinon = require('sinon');

@suite
class SecurityControllerTest {
  static before() {}

  before() {}

  /*@test async 'It must auth service login'() {
    sinon.stub(AuthService.prototype, 'login').callsFake(() => {
      return new Response(ResponseCode.OK, '', 'token');
    });

    const controller = new SecurityController(new AuthService());
    const res = controller.login({ email: '', password: '' });
    sinon.assert.calledOnce(AuthService.prototype.login);
    // res.should.equal('mock');
  }

  static after() {}

  after() {}*/
}
