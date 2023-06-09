#!/usr/bin/env node

import { Command } from 'commander';
import defaultCommand from './commands/default.command';
import { ServiceInterface } from './services/service.interface';
import configurationService from './services/configuration.service';
import fsService from './services/fs.service';
import databaseService from './services/database.service';
import reportsTestCommand from './commands/reports-test.command';

async function main(): Promise<void> {
    const commanderInstance = new Command();
    for (let command of [
        defaultCommand,
        reportsTestCommand,
    ]) {
        await command(commanderInstance);
    }

    const services: ServiceInterface[] = [
        fsService,
        configurationService,
        databaseService,
    ];
    for (const service of services) {
        if (service.init) {
            await service.init();
        }
    }

    await commanderInstance.parseAsync();

    for (const service of services.reverse()) {
        if (service.destroy) {
            await service.destroy();
        }
    }
}

main().catch((err: Error) => {
    console.error(err);
    process.exit(1);
});