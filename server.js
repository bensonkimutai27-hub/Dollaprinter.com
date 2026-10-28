/* Dollarprinter Core Dark-Theme Styling Context */
:root {
    --bg-main: #0b0e11;
    --bg-panel: #151a22;
    --bg-input: #1e2633;
    --text-primary: #eaecef;
    --text-muted: #848e9c;
    --color-accent: #f0b90b;
    --color-success: #0ecb81;
    --color-danger: #f6465d;
    --border-color: #2b3648;
}

* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
}

body {
    background-color: var(--bg-main);
    color: var(--text-primary);
    overflow-x: hidden;
}

/* Navbar */
.navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 30px;
    background-color: var(--bg-panel);
    border-bottom: 1px solid var(--border-color);
}

.logo {
    font-weight: 800;
    font-size: 20px;
    letter-spacing: 1px;
}

.logo span {
    color: var(--color-accent);
}

.user-profile {
    display: flex;
    align-items: center;
    gap: 15px;
}

.badge {
    background: #2b3648;
    padding: 4px 10px;
    border-radius: 4px;
    font-size: 12px;
    color: var(--text-muted);
}

.balance {
    font-weight: 700;
    color: var(--color-success);
}

/* Dashboard Grid Layout */
.dashboard-grid {
    display: grid;
    grid-template-columns: 300px 1fr 320px;
    gap: 20px;
    padding: 20px;
    height: calc(100vh - 60px);
}

.panel {
    background-color: var(--bg-panel);
    border: 1px solid var(--border-color);
    border-radius: 8px;
    padding: 20px;
    display: flex;
    flex-direction: column;
}

.panel h2 {
    font-size: 16px;
    margin-bottom: 20px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

/* Control Forms */
.control-group {
    margin-bottom: 20px;
}

.control-group label {
    display: block;
    font-size: 12px;
    color: var(--text-muted);
    margin-bottom: 8px;
}

select, input {
    width: 100%;
    padding: 12px;
    background-color: var(--bg-input);
    border: 1px solid var(--border-color);
    border-radius: 4px;
    color: var(--text-primary);
    font-size: 14px;
}

select:focus, input:focus {
    outline: none;
    border-color: var(--color-accent);
}

/* Buttons */
.btn {
    width: 100%;
    padding: 14px;
    border: none;
    border-radius: 4px;
    font-weight: 600;
    font-size: 15px;
    cursor: pointer;
    transition: background 0.2s;
}

.btn-primary { background-color: var(--color-accent); color: #000; }
.btn-primary:hover { background-color: #dfaa08; }

.btn-success { background-color: var(--color-success); color: #fff; }
.btn-success:hover { background-color: #0baf6f; }

.btn-danger { background-color: var(--color-danger); color: #fff; }
.btn-danger:hover { background-color: #d63c50; }

/* Chart Area */
.chart-container {
    flex-grow: 1;
}

.chart-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
}

.ticker-box {
    background-color: var(--bg-input);
    padding: 6px 12px;
    border-radius: 4px;
    font-size: 14px;
}

#live-price-ticker {
    font-weight: 700;
    color: var(--color-success);
}

#tv-chart-wrapper {
    flex-grow: 1;
    width: 100%;
    background-color: #0b0e11;
    border-radius: 4px;
    min-height: 350px;
}

/* Logs and Activity Console */
.panel-desc {
    font-size: 13px;
    color: var(--text-muted);
    margin-bottom: 25px;
}

.execution-buttons {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 30px;
}

.activity-log {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
}

.activity-log h3 {
    font-size: 13px;
    color: var(--text-muted);
    margin-bottom: 10px;
}

.console {
    background-color: #0b0e11;
    border: 1px solid var(--border-color);
    border-radius: 4px;
    flex-grow: 1;
    padding: 10px;
    font-family: monospace;
    font-size: 12px;
    overflow-y: auto;
    max-height: 200px;
}

.log-line {
    margin-bottom: 6px;
    line-height: 1.4;
}

.log-line.system { color: var(--color-accent); }
