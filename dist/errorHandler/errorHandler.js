"use strict";
const logger_service_1 = require("./logger_service");
module.exports = (err, url) => {
    logger_service_1.logger.error(err, url);
};
