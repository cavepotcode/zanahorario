const crypto = require('crypto');
const secret = '3f8a1s#de';

export class SHAEncriptor {
  encrypt(text: string): string {
    const hash = crypto
      .createHmac('sha256', secret)
      .update(text)
      .digest('hex');

    return hash.toString();
  }
}
