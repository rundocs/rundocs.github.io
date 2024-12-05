import path from "path";
import fs from "fs";
import crypto from "crypto";

function notFound(server) {
    server.middlewares.use((req, res, next) => {
        let { root, isProduction, build } = server.config;
        if (isProduction) {
            root = path.join(root, build.outDir);
        }
        let file = path.join(root, req.url.slice(1));
        let back = path.join(root, "404.html");

        if (fs.existsSync(file)) {
            next();
        } else {
            res.statusCode = 404;
            fs.readFile(back, "utf8", (error, data) => {
                if (error) {
                    res.end(error.message);
                } else {
                    res.setHeader("Content-Type", "text/html");
                    res.end(data);
                }
            });
        }
    })
}
export function handleNotFound() {
    return {
        name: "not-found",
        configureServer(server) {
            return () => notFound(server);
        },
        configurePreviewServer(server) {
            return () => notFound(server);
        },
    }
}
function hash(input) {
    return crypto.createHash("sha256").update(input).digest("hex").slice(0, 8);
}
function findHtmlFiles(dirPath) {
    let excludeDirs = [
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
export function getEntries() {
    let htmlFiles = findHtmlFiles(process.cwd());
    let hashMap = {};
    htmlFiles.map(itemPath => {
        hashMap["app-" + hash(itemPath)] = itemPath;
    });
    return hashMap;
}
