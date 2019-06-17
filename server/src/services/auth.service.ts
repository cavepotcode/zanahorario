import * as jwt from 'jsonwebtoken';
import { ResponseCode } from '../sdk/constants';
import { LoginDataIn } from '../sdk/data_in/login_data_in';
import { Response } from '../sdk/response';
import { User } from '../entities/User';
import { encrypt } from '../encrypt';
import { environment } from '../../environment/environment';
import { getUserRepository } from '../datastore';

export class AuthService {
  async login({ email, password: plainPassword }: LoginDataIn) {
    const password = encrypt(plainPassword);

    const userRepository = await getUserRepository();
    const user: User = await userRepository.findOne({ email, password });
    if (!user) {
      return new Response(ResponseCode.ERROR, 'Username or password is invalid. Please try again');
    }

    const token = jwt.sign({ userId: user.id }, environment.jwt.secret, {
      expiresIn: 60 * environment.jwt.timestamp
    });

    return new Response(ResponseCode.OK, '', token);
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
