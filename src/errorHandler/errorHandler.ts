import { logger } from './logger_service';

export = (err: Error, url: string) => {
    logger.error(err, url);
};