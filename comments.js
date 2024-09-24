// Create web server

// Import modules
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const qs = require('querystring');

// Create server
const server = http.createServer((req, res) => {
    const { pathname } = url.parse(req.url);

    // Handle GET requests
    if (req.method === 'GET') {
        if (pathname === '/') {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            fs.createReadStream(path.join(__dirname, 'index.html')).pipe(res);
        } else if (pathname === '/comments') {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            fs.createReadStream(path.join(__dirname, 'comments.json')).pipe(res);
        } else {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Not Found');
        }
    }

    // Handle POST requests
    if (req.method === 'POST') {
        if (pathname === '/comments') {
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });
            req.on('end', () => {
                const comment = qs.parse(body);
                fs.readFile(path.join(__dirname, 'comments.json'), (err, data) => {
                    if (err) throw err;
                    const comments = JSON.parse(data);
                    comments.push(comment);
                    fs.writeFile(path.join(__dirname, 'comments.json'), JSON.stringify(comments, null, 2), err => {
                        if (err) throw err;
                        res.writeHead(201, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify(comment));
                    });
                });
            });
        } else {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Not Found');
        }
    }
});

// Start server
server.listen(3000, () => {
    console.log('Server is listening on http://localhost:3000');
});