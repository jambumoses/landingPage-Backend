const { format } = require('date-fns');
const { v4: uuid } = require('uuid');

const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');

const logEvents = async (id, message, logName) => {
    const dateTime = `${format(new Date(), 'yyyyMMdd\tHH:mm:ss')}`;
    //const logItem = `${dateTime}\t${uuid()}\t${message}\n`;
    const logItem = `${dateTime}\t${id}\t${message}\n`;

    try {
        if (!fs.existsSync(path.join(__dirname, '..', 'logs'))) {
            await fsPromises.mkdir(path.join(__dirname, '..', 'logs'));
        }

        await fsPromises.appendFile(path.join(__dirname, '..', 'logs', logName), logItem);
    } catch (err) {
        console.log(err);
    }
}
//uuid()
const logger = (req, res, next) => {
    const dateTime_ = `${format(new Date(), 'yyyyMMdd\tHH:mm:ss')}`;
    const id = uuid();

    logEvents(id,`${req.method}\t${req.headers.origin}\t${req.url}`, 'reqLog.txt');

    // id - site - method - path - time/day
    console.log(`${dateTime_}\t${id}\t${req.headers.origin}\t${req.method}\t${req.path}\n`);
    next();
}

module.exports = { logger, logEvents };
