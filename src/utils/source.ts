type ParsedPath = {
    user: string | undefined;
    repo: string | undefined;
    path: string | undefined;
};

export function parsePath(pathname: string): ParsedPath {
    const pattern = /^\/(?<user>[^/]+)?\/?(?<repo>[^/]+)?\/?(?<path>.+)?$/;
    let parsed: ParsedPath = {
        user: undefined,
        repo: undefined,
        path: undefined,
    };
    const match = pathname.match(pattern);
    if (match && match.groups) {
        parsed = {
            user: match.groups.user,
            repo: match.groups.repo,
            path: match.groups.path,
        }
    }
    return parsed;
}

function parseParams(): URLSearchParams {
    if (typeof window !== "undefined") {
        return new URLSearchParams(window.location.search);
    } else {
        return new URLSearchParams();
    }
}

export const params = parseParams();
