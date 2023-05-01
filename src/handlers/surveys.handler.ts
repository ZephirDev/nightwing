import { Logger } from "../logger";
import configurationService from "../services/configuration.service";
import databaseService from "../services/database.service";
import { GithubClient } from "../types/clients/github.client";
import { Configuration } from "../types/configuration";
import { Message } from "../types/reports/message";
import { GitHubSite } from "../types/sites/github.site";
import { GitHubTagsSurvey } from "../types/surveys/github-tags.survey";
import reportsHandler from "./reports.handler";

export default new class {
    private configuration: Configuration;
    
    async handle(): Promise<void>
    {
        if (!this.configuration) {
            this.configuration = configurationService.getConfiguration();
        }

        const reportsMessageByChannel: {[report: string]: Message[]} = {};

        for (const surveyName of Object.keys(this.configuration.surveys)) {
            Logger.info(`Handle ${surveyName} survey`);
            const survey = this.configuration.surveys[surveyName];
            
            let message: Message;
            if ('github:release' === survey.type) {
                message = await this.handleGitHubReleaseSurvey(survey);
            }

            if (message) {
                Logger.info(`The ${surveyName} survey has generate a message to send.`);
                for (const report of survey.reports) {
                    if (!reportsMessageByChannel[report]) {
                        reportsMessageByChannel[report] = [];
                    }
                    reportsMessageByChannel[report].push(message);
                }
            } else {
                Logger.info(`The ${surveyName} survey doesn't return a message to send.`);
            }
        }

        Logger.info(`Send messages to reports.`);
        await reportsHandler.reports(reportsMessageByChannel);
    }

    async getSite(key: string, type?: string)
    {
        const site = this.configuration.sites[key];
        if (!site) {
            throw new Error(`Undefined ${key} ${type || 'generic'} site`);
        }

        if (type && type !== site.type) {
            throw new Error(`${key} site is not an instance of ${type} site.`);
        }

        return site;
    }

    async handleGitHubReleaseSurvey(githubReleaseSurvey: GitHubTagsSurvey): Promise<Message|null>
    {
        const githubSite = await this.getSite(githubReleaseSurvey.site, 'github') as GitHubSite;
        const client = new GithubClient(githubSite);

        const lastTag = await databaseService.getLastTagVersion(githubReleaseSurvey.project);
        const tags = await client.getTags(githubReleaseSurvey.project);
        
        if (tags.length === 0) {
            return null;
        }

        const name = tags[0].name;
        if (lastTag === name) {
            Logger.info(`The ${githubReleaseSurvey.project} github has no new tags so no report will be send.`);
            return null;
        }

        await databaseService.setLastTagVersion(githubReleaseSurvey.project, name);
        Logger.info(`The ${githubReleaseSurvey.project} github has a new tag so we will report this.`);
        return {
            content: `The github has release a new tag (${name}) on ${githubReleaseSurvey.project} github project.`,
            links: {
                project: `https://github.com/${githubReleaseSurvey.project}`,
            },
        };
    }
};
