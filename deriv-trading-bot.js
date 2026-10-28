class DerivTradingEngine {
    constructor() {
        this.wsUrl = `wss://://derivws.com`; // Free public Demo App ID
        this.socket = null;
        this.chartSeries = null;
        
        // Automated State Systems
        this.isBotRunning = false;
        this.baseStake = 10;
        this.currentStake = 10;
        this.virtualBalance = 10000.00;
        this.lastPrice = null;
        this.botDirection = 'CALL';
    }

    init() {
        this.logToConsole("Initializing live workspace components...");
        this.setupChart();
        this.connectWebSocket();
        this.bindUserInterface();
    }

    setupChart() {
        const chartContainer = document.getElementById('tv-chart-wrapper');
        const chart = LightweightCharts.createChart(chartContainer, {
            layout: { backgroundColor: '#0b0e11', textColor: '#848e9c' },
            grid: { vertLines: { color: '#151a22' }, horzLines: { color: '#151a22' } },
            crosshair: { mode: LightweightCharts.CrosshairMode.Normal },
            timeScale: { timeVisible: true, secondsVisible: true },
        });
        this.chartSeries = chart.addLineSeries({ color: '#f0b90b', lineWidth: 2 });
        window.addEventListener('resize', () => chart.resize(chartContainer.clientWidth, chartContainer.clientHeight));
        chart.resize(chartContainer.clientWidth, chartContainer.clientHeight);
    }

    connectWebSocket() {
        this.socket = new WebSocket(this.wsUrl);
        this.socket.onopen = () => this.subscribeToAsset(document.getElementById('asset-select').value);
        this.socket.onmessage = (event) => this.handleMarketPacket(JSON.parse(event.data));
        this.socket.onclose = () => setTimeout(() => this.connectWebSocket(), 5000);
    }

    subscribeToAsset(symbol) {
        if (this.socket.readyState === WebSocket.OPEN) {
            this.logToConsole(`Subscribing to real-time market data feed: ${symbol}`);
            this.socket.send(JSON.stringify({ ticks: symbol }));
        }
    }

    handleMarketPacket(data) {
        if (data.msg_type === 'tick' && data.tick) {
            const livePrice = data.tick.quote;
            document.getElementById('live-price-ticker').innerText = livePrice.toFixed(2);
            this.chartSeries.update({ time: data.tick.epoch, value: livePrice });

            if (this.isBotRunning) this.runBotLogic(livePrice);
            this.lastPrice = livePrice;
        }
    }

    runBotLogic(currentPrice) {
        if (this.lastPrice === null) return;
        this.isBotRunning = false; 

        const won = (this.botDirection === 'CALL' && currentPrice > this.lastPrice) || (this.botDirection === 'PUT' && currentPrice < this.lastPrice);

        if (won) {
            const profit = this.currentStake * 0.95;
            this.virtualBalance += profit;
            this.logToConsole(`✔ WIN! Profit: +$${profit.toFixed(2)} USD.`);
            this.currentStake = this.baseStake;
        } else {
            this.virtualBalance -= this.currentStake;
            this.logToConsole(`❌ LOSS! Deficit: -$${this.currentStake.toFixed(2)} USD.`);
            this.currentStake *= 2; // Martingale multiplier multiplier
            this.logToConsole(`⚠️ Multiplied stake setting to $${this.currentStake.toFixed(2)} USD.`);
        }

        document.getElementById('balance-display').innerText = `$${this.virtualBalance.toFixed(2)}`;
        this.botDirection = won ? this.botDirection : (this.botDirection === 'CALL' ? 'PUT' : 'CALL');

        setTimeout(() => {
            if (document.getElementById('start-bot-btn').classList.contains('active')) {
                this.isBotRunning = true;
                this.logToConsole(`🤖 Bot placing next trade: ${this.botDirection} (Stake: $${this.currentStake})`);
            }
        }, 2500);
    }

    bindUserInterface() {
        document.getElementById('asset-select').addEventListener('change', (e) => {
            document.getElementById('active-asset-title').innerText = e.target.options[e.target.selectedIndex].text;
            this.socket.send(JSON.stringify({ forget_all: "ticks" }));
            this.subscribeToAsset(e.target.value);
        });

        const startBtn = document.getElementById('start-bot-btn');
        startBtn.addEventListener('click', () => {
            this.isBotRunning = !this.isBotRunning;
            if (this.isBotRunning) {
                this.baseStake = parseFloat(document.getElementById('stake-amount').value) || 10;
                this.currentStake = this.baseStake;
                startBtn.innerText = "Halt Auto-Bot";
                startBtn.classList.add('active');
                this.logToConsole(`▶️ Martingale Bot Started. Base Stake: $${this.baseStake}`);
            } else {
                startBtn.innerText = "Launch Auto-Bot";
                startBtn.classList.remove('active');
                this.logToConsole("⏹️ Bot Stopped.");
            }
        });
    }

    logToConsole(text) {
        const consoleLog = document.getElementById('log-console');
        if (consoleLog) {
            const line = document.createElement('div');
            line.className = 'log-line system';
            line.innerText = `[Engine]: ${text}`;
            consoleLog.appendChild(line);
            consoleLog.scrollTop = consoleLog.scrollHeight;
        }
    }
}

window.addEventListener('DOMContentLoaded', () => { new DerivTradingEngine().init(); });
              
