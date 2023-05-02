import { Command } from "commander";
import reportsHandler from "../handlers/reports.handler";
import configurationService from "../services/configuration.service";
import { Message } from "../types/reports/message";

export default function (command: Command) {
    command
        .command('reports:test')
        .description('Send a debug message over all the reorts.')
        .action(() => {
            const configuration = configurationService.getConfiguration();
            const messages: {[key: string]: Message[]} = {};
            for (const report of Object.keys(configuration.reports)) {
                messages[report] = [{
                    content: 'It\'s a test message from nightwing.',
                    links: {
                        nightwing: 'https://github.com/ZephirDev/nightwing',
                    }
                }];
            }
            reportsHandler.reports(messages);
        });
};