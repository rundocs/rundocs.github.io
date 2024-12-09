import { Octokit } from "octokit";


export default class Github {
    private octokit: Octokit;
    constructor(token: string) {
        this.octokit = new Octokit({
            auth: token
        });
    }
    async getFile(owner: string, repo: string, path: string, ref: string) {
        const { data } = await this.octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
            owner,
            repo,
            path,
            ref
        });
        return data;
    }
}
