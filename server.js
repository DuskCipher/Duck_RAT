
#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting DuckRAT Panel with Admin Bot...');

// Function to start a process
function startProcess(script, name, color = '\x1b[36m') {
    const process = spawn('node', [script], {
        stdio: 'pipe',
        cwd: __dirname
    });
    
    console.log(`${color}▶ Starting ${name}...\x1b[0m`);
    
    process.stdout.on('data', (data) => {
        const output = data.toString().trim();
        if (output) {
            console.log(`${color}[${name}]\x1b[0m ${output}`);
        }
    });
    
    process.stderr.on('data', (data) => {
        const output = data.toString().trim();
        if (output) {
            console.error(`\x1b[31m[${name} ERROR]\x1b[0m ${output}`);
        }
    });
    
    process.on('close', (code) => {
        console.log(`${color}[${name}]\x1b[0m Process exited with code ${code}`);
        if (code !== 0) {
            console.error(`\x1b[31m❌ ${name} crashed! Restarting...\x1b[0m`);
            setTimeout(() => startProcess(script, name, color), 2000);
        }
    });
    
    return process;
}

// Start main server only (admin bot sudah integrated di index.js)
const mainServer = startProcess('index.js', 'Main Server', '\x1b[32m');

// Handle shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down all processes...');
    adminBot.kill();
    mainServer.kill();
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('\n🛑 Shutting down all processes...');
    adminBot.kill();
    mainServer.kill();
    process.exit(0);
});

console.log('✅ Both Admin Bot and Main Server are starting...');
console.log('🔐 Admin Bot: Managing access keys');
console.log('🌐 Main Server: http://localhost:5000');
console.log('\nPress Ctrl+C to stop all processes');
