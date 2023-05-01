
interface Environment {
    CONFIUGRATION_FOLDER_PATH: string;
    CONFIUGRATION_FILENAME: string;
    DATABASE_FILENAME: string;
    LOGGER_LEVEL: string;
    REPORT_TEMPLATE_FOLDER: string;
    DEFAULT_REPORT_TITLE_TEMPLATE_FILE: string;
    DEFAULT_REPORT_CONTENT_TEMPLATE_FILE_PATTERN: string;
};

const Fallbacks: Environment = {
    CONFIUGRATION_FOLDER_PATH: (() => {
        if (process.env.SNAP_NAME) {
            // Detect we are seal inside a snap package
            return process.env.HOME;
        }
        return `${process.env.HOME}/.config/nightwing`;
    })(),
    CONFIUGRATION_FILENAME: 'configuration.yaml',
    DATABASE_FILENAME: 'nightwing.db',
    LOGGER_LEVEL: 'info',
    REPORT_TEMPLATE_FOLDER: 'reports.template.d',
    DEFAULT_REPORT_TITLE_TEMPLATE_FILE: 'default.title.template',
    DEFAULT_REPORT_CONTENT_TEMPLATE_FILE_PATTERN: 'default.%s.template',
};

function envOrFallback(name: string, value: string): string {
    if (value) {
        return value;
    }
    return Fallbacks[name as keyof Environment]; 
}

const EnvironmentHandlers: { [key in keyof Environment]: (name: string, value: string) => Environment[key] } = {
    CONFIUGRATION_FOLDER_PATH: envOrFallback,
    CONFIUGRATION_FILENAME: envOrFallback,
    DATABASE_FILENAME: envOrFallback,
    LOGGER_LEVEL: envOrFallback,
    REPORT_TEMPLATE_FOLDER: envOrFallback,
    DEFAULT_REPORT_TITLE_TEMPLATE_FILE: envOrFallback,
    DEFAULT_REPORT_CONTENT_TEMPLATE_FILE_PATTERN: envOrFallback,
};

export const NightwingEnvironment: Environment = (() => {
    const result: any = {};
    for (const key of Object.keys(EnvironmentHandlers)) {
        result[key] = EnvironmentHandlers[key as keyof Environment](key, process.env[key] || '');
    }
    return result;
})();
