import { GoogleChatReport } from "./reports/googlechat.report"
import { SmtpReport } from "./reports/smtp.report"
import { GitHubSite } from "./sites/github.site"
import { GitHubTagsSurvey } from "./surveys/github-tags.survey"

export interface Configuration {
    sites: {
        [key: string]: GitHubSite,
    },
    surveys: {
        [key: string]: GitHubTagsSurvey,
    },
    reports: {
        [key: string]: GoogleChatReport|SmtpReport,
    },
}