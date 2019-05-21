const path = require("path");
const fs = require('fs');

export class Log {
    static LogError(title: string, message: string) {
        const dir = path.resolve("./") + '/log';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
        const completePath = dir + '/' + (new Date()).toDateString() + '.txt';
        const hour = (new Date()).getHours() + ':' + (new Date()).getMinutes() + ':'  + (new Date()).getSeconds();
        const separator = '------------------------ \r\n';

        if (fs.existsSync(completePath.toString())) {
            fs.appendFile(completePath, 'Hour: ' + hour + ' - ' + title + ': \r\n' + message + '\r\n' + separator, function (err: any) {
                if (err) {
                    return console.log(err);
                }
            });
        } else {
            fs.writeFile(completePath, 'Hour: ' + hour + ' - ' + title + ': \r\n' + message + '\r\n' + separator, function (err: any) {
                if (err) {
                    return console.log(err);
                }
            });
        }

    }
}