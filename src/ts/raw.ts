import request from "./request.ts";
async function raw({ user, repo, ref, path }) {
    return await request(`https://raw.githubusercontent.com/${user}/${repo}/refs/heads/${ref}/${path}`);
}

export default raw;
