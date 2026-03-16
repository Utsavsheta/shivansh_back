import winston, { Logform, LoggerOptions } from 'winston';
import { ErrorObject } from '../interfaces/middleware.interfaces';

const myFormat = () => {
	const currentTime = new Date();
	const currentOffset = currentTime.getTimezoneOffset();
	const ISTOffset = 330;   // IST offset UTC +5:30
	return new Date(currentTime.getTime() + (ISTOffset + currentOffset) * 60000);
};

const createLogger = (route: string) => {
	const loggerOptions: LoggerOptions = {
		transports: [
			new winston.transports.File({
				filename: `./errorHandler/${route}.log`
			})
		],
		format: winston.format.printf((info: Logform.TransformableInfo & { obj?: ErrorObject }) => {
			let message = `${myFormat()} | ${info.level.toUpperCase()} | ${route}.log | ${info.message} | `;
			message = info.obj?.stack ? `${message}Error Stack: ${JSON.stringify(info.obj.stack)} | ` : message;
			return message;
		})
	};

	const instance = winston.createLogger(loggerOptions);

	return {
		async error(obj: ErrorObject, message: string) {
			instance.log('error', message, {
				obj
			});
		}
	};
};

export const logger = createLogger('errors');