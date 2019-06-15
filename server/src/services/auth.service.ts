import * as jwt from 'jsonwebtoken';
import { Enums } from '../sdk/enums';
import { LoginDataIn } from '../sdk/data_in/login_data_in';
import { LoginDataOut } from '../sdk/data_out/loginDataOut';
import { Response } from '../sdk/response';
import { User } from '../entities/User';
import { encrypt } from '../encrypt';
import { environment } from '../../environment/environment';
import { userRepository } from '../datastore';

export class AuthService {
  async login({ email, password: plainPassword }: LoginDataIn) {
    const password = encrypt(plainPassword);

    const user: User = await (await userRepository).findOne({ email, password });
    if (!user) {
      return new Response(1, 'Username or password is invalid. Please try again');
    }

    const token = jwt.sign({ userId: user.id }, environment.jwt.secret, {
      expiresIn: 60 * environment.jwt.timestamp
    });

    return new Response(Enums.responseCode.Ok, '', token);
  }

  async validate(authHeader: string) {
    const token = authHeader.replace('Bearer ', '');
    try {
      const jwtResult = await jwt.verify(token, environment.jwt.secret);
      return !!jwtResult;
    } catch (ex) {
      return false;
    }
  }
}
