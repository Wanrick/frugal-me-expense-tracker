import * as winston from 'winston';

/**
 * Create a logger instance to write log messages in JSON format to the Console (printed in Cloud Watch logs).
 * A default level is not used. Instead, the level is set by the caller.
 * @param loggerName - a name of a logger that will be added to all messages
 */
export function createLogger(loggerName: string) {
	return winston.createLogger({
		format: winston.format.json(),
		defaultMeta: { name: loggerName },
		transports: [new winston.transports.Console()],
	});
}
