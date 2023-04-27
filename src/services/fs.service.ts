import { NightwingEnvironment } from "../environment";
import { File } from "../types/fs/file";
import { ServiceInterface } from "./service.interface";
import { join } from 'path';

export default new class implements ServiceInterface {

    async init(): Promise<void>
    {
    }

    getConfigurationFile(): File
    {
        return new File(join(NightwingEnvironment.CONFIUGRATION_FOLDER_PATH, NightwingEnvironment.CONFIUGRATION_FILENAME));
    }

}