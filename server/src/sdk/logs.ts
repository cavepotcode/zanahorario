const path = require('path');
const fs = require('fs');

export class Log {
  static logError(title: string, message: string) {
    const dir = path.resolve('./log');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    const date = new Date();
    const completePath = `${dir}/${date.toDateString()}.txt`;
    const hour = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    const separator = '------------------------ \r\n';

    const text = `Hour: ${hour} - ${title}:\r\n${message}\r\n${separator}`;
    if (fs.existsSync(completePath.toString())) {
      fs.appendFile(completePath, text, (err: any) => {
        if (err) {
          return console.log(err);
        }
      });
    } else {
      fs.writeFile(completePath, text, (err: any) => {
        if (err) {
          return console.log(err);
        }
      });
    }
  }
}
