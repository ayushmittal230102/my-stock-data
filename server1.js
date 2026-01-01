const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');
const { SmartAPI } = require('smartapi-javascript');
const { authenticator } = require('otplib');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3000;

// --- 🔴 APNI DETAILS YAHAN UPDATE KAREIN 🔴 ---
const ANGEL_API_KEY = "jZfnZ7Mp";   
const CLIENT_CODE = "D62647454";     
const PIN = "0824";             
const TOTP_KEY = "7MBLXZER6XZEMSUADO4DVTWQ2E";

let smart_api = new SmartAPI({ api_key: ANGEL_API_KEY });
let GLOBAL_JWT = null;


// --- 1. AUTO LOGIN ROUTE ---
app.post('/api/login', async (req, res) => {
    try {
        // Server automatically generates TOTP
        if (!TOTP_KEY || TOTP_KEY === "YOUR_TOTP_KEY") {
            return res.status(400).json({ status: false, message: "Server.js mein TOTP_KEY set karein" });
        }

        const totp = authenticator.generate(TOTP_KEY);
        console.log("🔐 Auto-Generated TOTP:", totp);

        const data = await smart_api.generateSession(CLIENT_CODE, PIN, totp);
        
        if (data.status) {
            GLOBAL_JWT = data.data.jwtToken;
            console.log("✅ Login Success for:", data.data.name);
            return res.json({ status: true, message: "Login Successful!", user: data.data });
        } else {
            return res.status(401).json({ status: false, message: data.message });
        }
    } catch (error) {
        return res.status(500).json({ status: false, message: error.message });
    }
});

// HTML Serve
app.get('/', (req, res) => { res.sendFile(path.join(__dirname, 'index1.html')); });

app.listen(PORT, () => { console.log(`🚀 Server Ready: http://localhost:${PORT}`); });