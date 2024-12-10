import type { Plugin, ViteDevServer, PreviewServer } from "vite";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import { execSync } from "child_process";

function findFilesSync(dirPath: string, ignoreDirs: string[] = [], endsWith?: string) {
    const files: string[] = [];
    fs.readdirSync(dirPath)
        .filter(item => !ignoreDirs.includes(item))
        .map(item => path.join(dirPath, item))
        .forEach(itemPath => {
            if (fs.statSync(itemPath).isDirectory()) {
                files.push(...findFilesSync(itemPath, ignoreDirs, endsWith));
            } else {
                if (endsWith) {
                    if (itemPath.endsWith(endsWith)) {
                        files.push(itemPath);
                    }
                } else {
                    files.push(itemPath);
                }
            }
        });
    return files;
}
type ReplaceContentOptions = {
    path: fs.PathLike;
    searchValue: string;
    replaceValue: string;
};
function replaceContentSync({ path, searchValue, replaceValue }: ReplaceContentOptions) {
    let content = fs.readFileSync(path, "utf8");
    content = content.replace(searchValue, replaceValue);
    fs.writeFileSync(path, content);
}
function appID(data: string) {
    const hash = crypto.createHash("sha256");
    hash.update(data);
    return "app-" + hash.digest("hex").slice(0, 8);
}
function gitRevision() {
    const command = "git rev-parse --short=7 HEAD";
    return execSync(command).toString().trim();
}
function afterMiddlewaresNotFound(server: ViteDevServer | PreviewServer) {
    server.middlewares.use((req, res, next) => {
        const { root, isProduction, build } = server.config;
        let serverRoot = root;
        if (isProduction) {
            serverRoot = path.join(serverRoot, build.outDir);
        }
        const file = path.join(serverRoot, req.url || "/");
        const back = path.join(serverRoot, "/404.html");

        if (fs.existsSync(file)) {
            next();
        } else {
            if (fs.existsSync(back)) {
                if (isProduction) {
                    const data = fs.readFileSync(back, "utf8");
                    res.statusCode = 404;
                    res.setHeader("Content-Type", "text/html");
                    res.end(data);
                } else {
                    req.url = "/404.html";
                    next();
                }
            } else {
                res.statusCode = 404;
                res.end("404");
            }
        }
    });
}

// start export

type htmlEntriesOptions = {
    dirPath: string;
    ignoreDirs?: string[];
}
export function htmlEntries({ dirPath, ignoreDirs }: htmlEntriesOptions) {
    const entries: { [key: string]: string } = {};
    const files = findFilesSync(dirPath, ignoreDirs, ".html");
    files.forEach(itemPath => {
        entries[appID(itemPath)] = itemPath;
    });
    return entries;
}
export function mpaNotFound(): Plugin {
    return {
        name: "mpa-not-found",
        configureServer(server: ViteDevServer) {
            return () => afterMiddlewaresNotFound(server);
        },
        configurePreviewServer(server: PreviewServer) {
            return () => afterMiddlewaresNotFound(server);
        }
    }
}
export function setManifest(filePath: string): Plugin {
    return {
        name: "set-manifest",
        writeBundle: {
            async handler(context) {
                const dist: string = context.dir || process.cwd();

                const resources = findFilesSync(dist)
                    .map(file => "/" + path.relative(dist, file))
                    .concat("/");

                replaceContentSync({
                    path: path.join(dist, filePath),
                    searchValue: "__MANIFEST__",
                    replaceValue: JSON.stringify({
                        revision: gitRevision(),
                        resources: resources.sort(),
                    })
                });
            }
        },
    }
}
