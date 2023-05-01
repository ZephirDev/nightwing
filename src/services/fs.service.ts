import { NightwingEnvironment } from "../environment";
import { File } from "../types/fs/file";
import { ServiceInterface } from "./service.interface";
import { join } from 'path';
import { format } from 'util';

export default new class implements ServiceInterface {

    async init(): Promise<void>
    {
    }

    getConfigurationFile(): File
    {
        return new File(join(NightwingEnvironment.CONFIUGRATION_FOLDER_PATH, NightwingEnvironment.CONFIUGRATION_FILENAME));
    }

    getDatabaseFile(): File
    {
        return new File(join(NightwingEnvironment.CONFIUGRATION_FOLDER_PATH, NightwingEnvironment.DATABASE_FILENAME));
    }

    getReportTemplateFile(path: string): File
    {
        return new File(join(NightwingEnvironment.CONFIUGRATION_FOLDER_PATH, NightwingEnvironment.REPORT_TEMPLATE_FOLDER, path));
    }

    getDefaultReportTitleTemplate(): File
    {
        return this.getReportTemplateFile(NightwingEnvironment.DEFAULT_REPORT_TITLE_TEMPLATE_FILE)
    }

    getDefaultReportContentTemplate(type: string): File
    {
        return this.getReportTemplateFile(format(NightwingEnvironment.DEFAULT_REPORT_CONTENT_TEMPLATE_FILE_PATTERN, type));
    }
}