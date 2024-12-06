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
        name: "not-found",
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
function findHtmlFiles(dirPath) {
    let excludeDirs = [
        ".git",
        "dist",
        "node_modules",
    ];
    let htmlFiles = [];

    fs.readdirSync(dirPath)
        .filter(item => !excludeDirs.includes(item))
        .forEach(item => {
            let itemPath = path.join(dirPath, item);
            if (fs.statSync(itemPath).isDirectory()) {
                htmlFiles.push(...findHtmlFiles(itemPath));
            } else {
                if (item.endsWith(".html")) {
                    htmlFiles.push(itemPath);
                }
            }
        });
    return htmlFiles;
}
export function getHtmlEntries() {
    let htmlFiles = findHtmlFiles(process.cwd());
    let entries = {};
    htmlFiles.map(itemPath => {
        entries["app-" + sha(itemPath)] = itemPath;
    });
    return entries;
}
