import path from "path";
import fs from "fs";
import crypto from "crypto";

function afterMiddlewares(server) {
    server.middlewares.use((req, res, next) => {
        let { root, isProduction, build } = server.config;
        if (isProduction) {
            root = path.join(root, build.outDir);
        }
        let file = path.join(root, req.url);
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
export function handleNotFound() {
    return {
        name: "handle-not-found",
        configureServer(server) {
            return () => afterMiddlewares(server);
        },
        configurePreviewServer(server) {
            return () => afterMiddlewares(server);
        }
    }
}
function sha(string) {
    let hash = crypto.createHash("sha256");
    hash.update(string);
    return hash.digest("hex").slice(0, 8);
}
function findFilesSync(dirPath, ignoreDirs = [], endsWith) {
    let files = [];
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
export function getHtmlEntries() {
    let ignoreDirs = [
        ".git",
        "dist",
        "node_modules"
    ];
    let htmlFiles = findFilesSync(process.cwd(), ignoreDirs, ".html");
    let entries = {};
    htmlFiles.map(itemPath => {
        entries["app-" + sha(itemPath)] = itemPath;
    });
    return entries;
}

export function setManifest() {
    return {
        name: "set-manifest",
        writeBundle: {
            async handler({ dir }) {
                try {
                    let distList = findFilesSync(dir).map(itemPath => {
                        return "/" + path.relative(dir, itemPath);
                    });
                    let sw = path.join(dir, "site.sw.js");
                    let swContent = fs.readFileSync(sw, "utf8");

                    swContent = swContent.replace("MANIFEST", JSON.stringify({
                        version: Date.now(),
                        content: distList,
                    }));
                    fs.writeFileSync(sw, swContent);
                } catch (error) {
                    console.error("set-manifest:", error.message);
                }
            }
        },
    }
}
