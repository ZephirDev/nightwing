import * as winston from "winston";
import { NightwingEnvironment } from "./environment";

export const Logger = (() => {
    return winston.createLogger({
        level: NightwingEnvironment.LOGGER_LEVEL,
        transports: [
            new winston.transports.Console({
                format: winston.format.combine(
                    winston.format.colorize(),
                    winston.format.simple()
                ),
            }),
        ]
    });
})();