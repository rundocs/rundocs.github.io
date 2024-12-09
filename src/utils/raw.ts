import request from "./request.ts";

type RawOptions = {
    user: string;
    repo: string;
    ref: string;
    path: string;
};
async function raw({ user, repo, ref, path }: RawOptions) {
    return await request(`https://raw.githubusercontent.com/${user}/${repo}/refs/heads/${ref}/${path}`);
}

export default raw;
