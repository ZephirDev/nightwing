import { HttpSite } from "./http.site";

export interface GitHubSite extends HttpSite {
    type: 'github',
}
