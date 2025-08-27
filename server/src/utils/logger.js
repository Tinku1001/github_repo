const fs = require('fs');
const path = require('path');

class Logger {
  constructor() {
    this.logsDir = path.join(__dirname, '../../logs');
    if (!fs.existsSync(this.logsDir)) {
      fs.mkdirSync(this.logsDir, { recursive: true });
    }
  }

  log(level, message, ...args) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${level.toUpperCase()}: ${message} ${args.length ? JSON.stringify(args) : ''}`;
    
    console.log(logMessage);
    
    if (process.env.NODE_ENV === 'production') {
      const logFile = path.join(this.logsDir, `${level}.log`);
      fs.appendFileSync(logFile, logMessage + '\n');
    }
  }

  info(message, ...args) {
    this.log('info', message, ...args);
  }

  error(message, ...args) {
    this.log('error', message, ...args);
  }

  warn(message, ...args) {
    this.log('warn', message, ...args);
  }

  debug(message, ...args) {
    if (process.env.NODE_ENV === 'development') {
      this.log('debug', message, ...args);
    }
  }
}

module.exports = new Logger();