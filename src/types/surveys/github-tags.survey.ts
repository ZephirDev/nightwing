import { BasicSurvey } from "./basic.survey";

export interface GitHubTagsSurvey extends BasicSurvey {
    type: 'github:release',
    project: string,
};
