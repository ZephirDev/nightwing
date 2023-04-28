import configurationService from "../services/configuration.service";
import databaseService from "../services/database.service";
import { GithubClient } from "../types/clients/github.client";
import { Configuration } from "../types/configuration";
import { GitHubSite } from "../types/sites/github.site";
import { GitHubTagsSurvey } from "../types/surveys/github-tags.survey";

export default new class {
    private configuration: Configuration;
    
    async handle(): Promise<void>
    {
        if (!this.configuration) {
            this.configuration = configurationService.getConfiguration();
        }

        const reportsMessageByChannel: {[report: string]: string[]} = {};

        for (const surveyName of Object.keys(this.configuration.surveys)) {
            const survey = this.configuration.surveys[surveyName];
            
            let message: string; 
            if ('github:release' === survey.type) {
                message = await this.handleGitHubReleaseSurvey(survey);
            }

            if (message) {
                for (const report of survey.reports) {
                    if (reportsMessageByChannel[report]) {
                        reportsMessageByChannel[report] = [];
                    }
                    reportsMessageByChannel[report].push(message);
                }
            }
        }

        // TODO handle reporting
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

    async handleGitHubReleaseSurvey(githubReleaseSurvey: GitHubTagsSurvey): Promise<string|null>
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
            return null;
        }

        await databaseService.setLastTagVersion(githubReleaseSurvey.project, name);
        return `The github has release a new tag (${name}) on ${githubReleaseSurvey.project} github project.`;
    }
};
