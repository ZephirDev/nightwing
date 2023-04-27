import { Command } from 'commander';
import defaultCommand from './commands/default.command';
import { ServiceInterface } from './services/service.interface';
import configurationService from './services/configuration.service';
import fsService from './services/fs.service';

async function main(): Promise<void> {
    const commanderInstance = new Command();
    for (let command of [
        defaultCommand,
    ]) {
        await command(commanderInstance);
    }

    const services: ServiceInterface[] = [
        fsService,
        configurationService,
    ];
    for (const service of services) {
        if (service.init) {
            await service.init();
        }
    }

    await commanderInstance.parseAsync();

    for (const service of services) {
        if (service.destroy) {
            await service.destroy();
        }
    }
}

main().catch((err: Error) => {
    console.error(err.message);
    process.exit(1);
});