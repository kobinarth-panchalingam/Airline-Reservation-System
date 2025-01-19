import winston from 'winston'

const env = process.env.NODE_ENV || 'development'
const isDevelopment = env === 'development'

// Define your custom levels if needed
const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4
}

// Define which level the logger should log
const level = () => {
    return isDevelopment ? 'debug' : 'warn'
}

// Define different colors for each level
winston.addColors({
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'white'
})

const format = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
    winston.format.printf(info => {
        const stack = info.stack ? `\n${info.stack}` : ''
        return `${info.timestamp} ${info.level}: ${info.message}${stack}`
    })
)

// Define the transports (console, file, etc.)
const transports = [new winston.transports.Console()]

if (isDevelopment) {
    transports.push(
        new winston.transports.File({
            filename: 'logs/error.log',
            level: 'error'
        })
        // new winston.transports.File({ filename: 'logs/all.log' })
    )
}

// Create the logger instance
const logger = winston.createLogger({
    level: level(),
    levels,
    format,
    transports
})

export { logger }
