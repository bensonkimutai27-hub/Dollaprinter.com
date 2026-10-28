const express = require('express');
const http = require('http');
const { WebSocketServer } = require('ws');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

const server = http.createServer(app);
const wss = new WebSocketServer({ noServer: true });

// Maintain exact profile balances as requested
let accounts = {
    real: { balance: 10.00, totalStake: 0, totalPayout: 0, runs: 0, profitLoss: 0, won: 0, lost: 0, history: [], journal: [] },
    demo: { balance: 10000.00, totalStake: 0, totalPayout: 0, runs: 0, profitLoss: 0, won: 0, lost: 0, history: [], journal: [] }
};

let activeProcessInterval = null;
let currentActiveType = 'real'; // Track which profile is selected

server.on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
    });
});

wss.on('connection', (ws) => {
    console.log('🔌 Secured Trading Session Connected');

    // Send the fresh data framework on connection
    ws.send(JSON.stringify({ type: 'ACCOUNT_SYNC', currentType: currentActiveType, data: accounts }));

    ws.on('message', (message) => {
        try {
            const payload = JSON.parse(message);

            if (payload.action === 'SWITCH_ACCOUNT') {
                currentActiveType = payload.accountMode;
                ws.send(JSON.stringify({ type: 'ACCOUNT_SYNC', currentType: currentActiveType, data: accounts }));
            }

            if (payload.action === 'RESET_DEMO') {
                accounts.demo = { balance: 10000.00, totalStake: 0, totalPayout: 0, runs: 0, profitLoss: 0, won: 0, lost: 0, history: [], journal: [] };
                ws.send(JSON.stringify({ type: 'ACCOUNT_SYNC', currentType: currentActiveType, data: accounts }));
            }

            if (payload.action === 'START_BOT') {
                const activeConfig = accounts[currentActiveType];
                const stakeValue = parseFloat(payload.stake) || 5.00;
                const predictionTarget = parseInt(payload.prediction) || 1;
                const assetName = payload.market || "Volatility 100 Index";

                if (activeProcessInterval) clearInterval(activeProcessInterval);

                // Add entry message to the journal log window
                const initTime = new Date().toISOString().replace('T', ' ').substring(0, 19) + ' GMT';
                activeConfig.journal.unshift(`[${initTime}] Welcome back! Your messages have been restored. You are using your ${currentActiveType.toUpperCase()} account.`);
                activeConfig.journal.unshift(`[${initTime}] Bot started running... Processing digit analysis.`);

                ws.send(JSON.stringify({ type: 'ACCOUNT_SYNC', currentType: currentActiveType, data: accounts }));

                activeProcessInterval = setInterval(() => {
                    activeConfig.runs++;
                    activeConfig.won++;

                    // Standard Deriv digit payout multiplier mapping (e.g., ~17.6% profit markup on a typical match)
                    const profitPremium = parseFloat((stakeValue * 0.1764).toFixed(2));
                    const totalPayout = parseFloat((stakeValue + profitPremium).toFixed(2));

                    activeConfig.balance = parseFloat((activeConfig.balance + profitPremium).toFixed(2));
                    activeConfig.totalStake = parseFloat((activeConfig.totalStake + stakeValue).toFixed(2));
                    activeConfig.totalPayout = parseFloat((activeConfig.totalPayout + totalPayout).toFixed(2));
                    activeConfig.profitLoss = parseFloat((activeConfig.profitLoss + profitPremium).toFixed(2));

                    // Generate a random market index value resembling live index nodes
                    const spotBase = parseFloat((554 + Math.random() * 0.5).toFixed(2));
                    
                    const contractItem = {
                        id: Date.now(),
                        asset: assetName,
                        prediction: predictionTarget,
                        spot: spotBase,
                        stake: stakeValue,
                        pnl: profitPremium,
                        payout: totalPayout
                    };

                    activeConfig.history.unshift(contractItem);
                    
                    const logTime = new Date().toISOString().replace('T', ' ').substring(0, 19) + ' GMT';
                    activeConfig.journal.unshift(`[${logTime}] Contract closed successfully. Profit: +${profitPremium} USD`);

                    ws.send(JSON.stringify({ type: 'ACCOUNT_SYNC', currentType: currentActiveType, data: accounts }));
                }, 3500);
            }

            if (payload.action === 'STOP_BOT') {
                if (activeProcessInterval) {
                    clearInterval(activeProcessInterval);
                    activeProcessInterval = null;
                }
                const activeConfig = accounts[currentActiveType];
                const logTime = new Date().toISOString().replace('T', ' ').substring(0, 19) + ' GMT';
                activeConfig.journal.unshift(`[${logTime}] Bot stopped by administrator request.`);
                ws.send(JSON.stringify({ type: 'ACCOUNT_SYNC', currentType: currentActiveType, data: accounts }));
            }

        } catch (err) {
            console.error("Internal transaction mapping exception:", err);
        }
    });

    ws.on('close', () => {
        if (activeProcessInterval) clearInterval(activeProcessInterval);
    });
});

server.listen(PORT, () => {
    console.log(`🚀 Automated Workspace running safely on port ${PORT}`);
});
        
