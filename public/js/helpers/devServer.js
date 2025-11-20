import { readFile, watch } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, resolve } from 'node:path';
import { logInfo, logSuccess, logError } from './logger.js';

const PORT = 3000;
const ROOT = resolve(process.cwd(), 'plateforme');


function getMimeType(ext) {
    const types = {
        '.html': 'text/html',
        '.css': 'text/css',
        '.js': 'application/javascript',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.svg': 'image/svg+xml'
    };
    return types[ext] || 'text/plain';
}

function serveFile(filePath, res) {
    readFile(filePath, (err, data) => {
        if (err) {
            logError(`Fichier introuvable : ${filePath}`);
            res.writeHead(404);
            res.end('404 Not Found');
            return;
        }

        const type = getMimeType(extname(filePath));
        res.writeHead(200, { 'Content-Type': type });
        res.end(data);
    });
}

const server = createServer((req, res) => {
    const urlPath = req.url === '/' ? '/accueil.html' : req.url;
    const filePath = join(ROOT, urlPath);
    serveFile(filePath, res);
});

server.listen(PORT, () => {
    logSuccess(`🚀 Serveur lancé sur http://localhost:${PORT}`);
});

watch(ROOT, { recursive: true }, (_, filename) => {
    if (filename) {
        logInfo(`🔄 Fichier modifié : ${filename}`);
    }
});
