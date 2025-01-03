import { AsyncLocalStorage } from 'async_hooks'
import { createLogger, format, transports } from 'winston'
import { EnvironmentVariables } from './EnvironmentVariables'

const NODE_ENV = EnvironmentVariables.get().node_env

interface RequestContext {
    requestId?: string
    method?: string
    path?: string
}

// Create AsyncLocalStorage instance
export const requestContext = new AsyncLocalStorage<RequestContext>()

const logger = createLogger({
    level: 'info',
    format: format.combine(
        format.colorize(),
        format.timestamp({
            format: "DD/MM/YYYY HH:mm:ss",
          }),
        format.errors({ stack: true }),
        format.printf(({ level, message, timestamp, label }) => {
            // Get context from AsyncLocalStorage
            const context = requestContext.getStore() || {}
            const { requestId, method, path } = context

            if (requestId) {
                return `${timestamp} [${level}](${label}) [request-id: ${requestId}] [${method} ${path}]: ${message}`
            }
            return `${timestamp} [${level}](${label}) [${method} ${path}]: ${message}`
        })
    ),
    transports: [NODE_ENV === 'test'? new transports.Console({ silent: true }) : new transports.Console()]
})

// Helper function to set request context
export const setRequestContext = (context: RequestContext) => {
    const currentStore = requestContext.getStore() || {}
    requestContext.enterWith({ ...currentStore, ...context })
}

export default logger