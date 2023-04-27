import { NightwingEnvironment } from "../environment";
import { File } from "../types/fs/file";
import { ServiceInterface } from "./service.interface";
import { stringify, parse } from 'yaml';
import defaultConfiguration from '../assets/default.configuration.json';
import fsService from "./fs.service";
import { Logger } from "../logger";

export default new class implements ServiceInterface {
    private config: any;

    async init(): Promise<void>
    {
        const configurationFile = fsService.getConfigurationFile();
        if (!configurationFile.exists()) {
            Logger.info(`The '${configurationFile.toString()}' configuration file doesn't exists. Nightwing create a fake one to give you an exemple.`)
            configurationFile.write(stringify(defaultConfiguration));
            process.exit(1);
        }
        this.config = parse(configurationFile.read());
    }
    
};
