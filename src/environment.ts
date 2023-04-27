
interface Environment {
    CONFIUGRATION_FOLDER_PATH: string;
    CONFIUGRATION_FILENAME: string;
    LOGGER_LEVEL: string;
};

const Fallbacks: Environment = {
    CONFIUGRATION_FOLDER_PATH: `${process.env.HOME}/.config/nightwing`,
    CONFIUGRATION_FILENAME: 'configuration.yaml',
    LOGGER_LEVEL: 'info',
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
    LOGGER_LEVEL: envOrFallback,
};

export const NightwingEnvironment: Environment = (() => {
    const result: any = {};
    for (const key of Object.keys(EnvironmentHandlers)) {
        result[key] = EnvironmentHandlers[key as keyof Environment](key, process.env[key] || '');
    }
    return result;
})();
