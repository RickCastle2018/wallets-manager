import winston from 'winston'
const { createLogger, transports, format } = winston

const logger = createLogger({
  transports: [
    new transports.Console(),
    new transports.File({ filename: '../service.log' })
  ],
  format: format.combine(
    format.timestamp({
      format: 'MMM-DD-YYYY HH:mm:ss'
    }),
    format.printf(info => `${info.level}: ${[info.timestamp]}: ${info.message}`)
  )
})
export default logger

logger.exceptions.handle(new transports.Console(),
  new transports.File({ filename: '../exceptions.log' }))
