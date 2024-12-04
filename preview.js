import path from "path";
import fs from "fs";
import express from "express";

let app = express();
let port = 3000;

app.use(express.static("dist"));
app.use((req, res) => {
    let notFound = path.resolve("dist", "404.html");
    res.status(404);
    if (!fs.existsSync(notFound)) {
        res.send(req.url);
    } else {
        res.sendFile(notFound);
    }
});
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
