import * as fs from 'fs';

interface IConfig {
    PORT: number;
    MEDIA_SERVER_DIR: string;
}

class ConfigError extends Error {
    message: string;
    name: string;

    constructor(message: string) {
        super(message);
        this.name = "ConfigError";
        this.message = message;
    }
}

function validateConfig(config: IConfig) {
    if (isNaN(config.PORT)) {
        throw new ConfigError('config.PORT is NaN. Should be a valid number');
    }
    if (config.MEDIA_SERVER_DIR === "undefined") {
        throw new ConfigError('config.MEDIA_SERVER_DIR is undefined. Should be a string');
    }
}

function getConfigFromFile(configFile: string): IConfig {
    let configStr: string = fs.readFileSync(configFile).toString();
    let configJson: any = {};
    try {
        configJson = JSON.parse(configStr);
    } catch(error) {
        throw new ConfigError('Error converting to JSON media-server.json');
    }
    const config: IConfig = {
        PORT: Number(configJson.port),
        MEDIA_SERVER_DIR: String(configJson.media_dir)
    }
    try {
        validateConfig(config);
    } catch (error) {
        throw new ConfigError("Error validating config properties: " + error.message);
    }
    return config;
}

function getConfig(): IConfig {
    let configFile = 'media-server.json';
    if (!fs.existsSync(configFile)) {
        console.log(configFile + ' not found, exiting...');
        process.exit(0);
    }
    try {
        return getConfigFromFile(configFile);
    } catch(error) {
        console.log(error.message + ' exiting...');
        process.exit(0);
    }
}

export { getConfig, IConfig }
