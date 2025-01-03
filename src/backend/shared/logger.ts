import { createLogger, format, transports } from 'winston'
import { EnvironmentVariables } from './EnvironmentVariables'

const NODE_ENV = EnvironmentVariables.get().node_env

const logger = createLogger({
    level: 'info',
    format: format.combine(
        format.colorize(),
        format.timestamp({
            format: "DD/MM/YYYY HH:mm:ss",
          }),
        format.errors({ stack: true }),
        format.printf(({ level, message, timestamp, label, requestId }) => {
            return requestId
            ? `${timestamp} [${level}](${label}) [request-id: ${requestId}]: ${message}`
            : `${timestamp} [${level}](${label}): ${message}`
        })
    ),
    transports: [NODE_ENV === 'test'? new transports.Console({ silent: true }) : new transports.Console()]
})

export default logger;