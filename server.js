const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const WebSocket = require('ws');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

let mockUserDatabase = {
    userId: "user_01",
    accountType: "Live Real-Money Account", 
    currency: "USD",
    availableBalance: 25000.00,
    openPositions: {}
};

let currentMarketPrice = 0.0;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

const binanceWs = new WebSocket('wss://://binance.com');

binanceWs.on('message', (data) => {
    const marketData = JSON.parse(data);
    currentMarketPrice = parseFloat(marketData.c);
    
    let dynamicPnL = 0;
    if (mockUserDatabase.openPositions['BTCUSD']) {
        const pos = mockUserDatabase.openPositions['BTCUSD'];
        dynamicPnL = (currentMarketPrice - pos.entryPrice) * pos.quantity;
    }

    io.emit('marketUpdate', {
        ticker: "BTC/USD",
        price: currentMarketPrice,
        balance: mockUserDatabase.availableBalance,
        openPositions: mockUserDatabase.openPositions,
        pnl: dynamicPnL
    });
});

app.post('/api/trade', (req, requireResponse) => {
    const { orderType, quantity } = req.body;
    const asset = 'BTCUSD';
    const totalCost = currentMarketPrice * quantity;

    if (orderType === 'BUY') {
        if (mockUserDatabase.availableBalance < totalCost) {
            return requireResponse.status(400).json({ success: false, message: "Insufficient Funds in Live Wallet Account" });
        }
        
        mockUserDatabase.availableBalance -= totalCost;
        
        if (mockUserDatabase.openPositions[asset]) {
            const existing = mockUserDatabase.openPositions[asset];
            const totalQty = existing.quantity + quantity;
            existing.entryPrice = ((existing.entryPrice * existing.quantity) + totalCost) / totalQty;
            existing.quantity = totalQty;
        } else {
            mockUserDatabase.openPositions[asset] = {
                entryPrice: currentMarketPrice,
                quantity: quantity
            };
        }
    } 
    else if (orderType === 'SELL') {
        const position = mockUserDatabase.openPositions[asset];
        if (!position || position.quantity < quantity) {
            return requireResponse.status(400).json({ success: false, message: "No active inventory positions to clear" });
        }

        mockUserDatabase.availableBalance += totalCost;
        position.quantity -= quantity;

        if (position.quantity === 0) {
            delete mockUserDatabase.openPositions[asset];
        }
    }

    return requireResponse.json({ success: true, userProfile: mockUserDatabase });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Dollarprinter Core running`);
});
              
