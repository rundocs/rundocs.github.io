type ParsedPath = {
    user: string | undefined;
    repo: string | undefined;
    path: string | undefined;
};

export function parsePath(pathname: string): ParsedPath {
    let pattern = /^\/(?<user>[^\/]+)?\/?(?<repo>[^\/]+)?\/?(?<path>.+)?$/;
    let parsed: ParsedPath = {
        user: undefined,
        repo: undefined,
        path: undefined,
    };
    let match = pathname.match(pattern);
    if (match && match.groups) {
        parsed = {
            user: match.groups.user,
            repo: match.groups.repo,
            path: match.groups.path,
        }
    }
    return parsed;
}

let params = new URLSearchParams(location.search);
let { user, repo, path } = parsePath(location.pathname);
