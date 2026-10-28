const express = require('express');
const http = require('http');
const { WebSocketServer } = require('ws');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

const server = http.createServer(app);
const wss = new WebSocketServer({ noServer: true });

let assets = {
    BTC: 65000,
    ETH: 3400,
    TSLA: 180
};

setInterval(() => {
    for (let key in assets) {
        const change = (Math.random() - 0.5) * (assets[key] * 0.002);
        assets[key] = parseFloat((assets[key] + change).toFixed(2));
    }
    
    const payload = JSON.stringify({ type: 'PRICE_UPDATE', data: assets });
    wss.clients.forEach(client => {
        if (client.readyState === 1) {
            client.send(payload);
        }
    });
}, 1000);

server.on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
    });
});

wss.on('connection', (ws) => {
    console.log('🔌 New client connected');
    ws.send(JSON.stringify({ type: 'INITIAL_PRICES', data: assets }));
    ws.on('close', () => console.log('❌ Client disconnected'));
});

server.listen(PORT, () => {
    console.log(`🚀 Trading server running on port ${PORT}`);
});
