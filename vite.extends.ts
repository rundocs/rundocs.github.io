import type { Plugin, ViteDevServer, PreviewServer } from "vite";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import { execSync } from "child_process";

function findFilesSync(dirPath: string, ignoreDirs: string[] = [], endsWith?: string) {
    let files: string[] = [];
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
function replaceContentSync({ file, searchValue, replaceValue }) {
    let content = fs.readFileSync(file, "utf8");
    content = content.replace(searchValue, replaceValue);
    fs.writeFileSync(file, content);
}
function appID(data: string) {
    let hash = crypto.createHash("sha256");
    hash.update(data);
    return "app-" + hash.digest("hex").slice(0, 8);
}
function gitRevision() {
    let command = "git rev-parse --short=7 HEAD";
    return execSync(command).toString().trim();
}
function afterMiddlewaresNotFound(server: ViteDevServer | PreviewServer) {
    server.middlewares.use((req, res, next) => {
        let { root, isProduction, build } = server.config;
        if (isProduction) {
            root = path.join(root, build.outDir);
        }
        let file = path.join(root, req.url || "/");
        let back = path.join(root, "/404.html");

        if (fs.existsSync(file)) {
            next();
        } else {
            if (fs.existsSync(back)) {
                if (isProduction) {
                    try {
                        let data = fs.readFileSync(back, "utf8");
                        res.statusCode = 404;
                        res.setHeader("Content-Type", "text/html");
                        res.end(data);
                    } catch (error) {
                        res.statusCode = 500;
                        res.end(error.message);
                    }
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

export function htmlEntries({ dirPath, ignoreDirs }) {
    let entries = {};
    let files = findFilesSync(dirPath, ignoreDirs, ".html");
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
                try {
                    let dist: string = context.dir || process.cwd();

                    let resources = findFilesSync(dist)
                        .map(file => "/" + path.relative(dist, file))
                        .concat("/");

                    replaceContentSync({
                        file: path.join(dist, filePath),
                        searchValue: "__MANIFEST__",
                        replaceValue: JSON.stringify({
                            revision: gitRevision(),
                            resources: resources.sort(),
                        }),
                    });
                } catch (error) {
                    console.error("set-manifest-plugin:", error.message);
                }
            }
        },
    }
}