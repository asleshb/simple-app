# Cybersecurity Canary Application

This application serves as a full-stack "canary" security tool to demonstrate IP-based and GPS-based geographical tracking mechanisms for educational forensics and cybersecurity placement portfolio purposes.

## The Architecture
- **Frontend** (Vite + React): A visually appealing, professional "Under Construction" portfolio. It acts as the honey-trap by requesting high-accuracy connections under the guise of "verification."
- **Backend** (Node.js + Express): Silently tracks inbound connections using IP logging, while exposing an endpoint for high-accuracy GPS verification.
- **Data Storage**: Local CSV logging (`logs.csv`).

## Learning Objectives

### IP-based Tracking vs GPS-based Tracking

1. **IP-Based Network Estimation**
   - **How it works:** When a client visits the website, an HTTP request is made to the backend. The backend retrieves the source IP address (via headers or direct socket). We use the `geoip-lite` database to correlate the IP address with a rough geographical area.
   - **Characteristics:**
     - Requires **no user permission**. It is completely silent and automatic.
     - **Low Accuracy**: Usually resolves to the ISP's data center or a general city area, rather than the street or building.
     - Easily spoofed via VPNs, Proxies, or Tor networks.

2. **GPS-Based Tracking (High Accuracy)**
   - **How it works:** The web application explicitly asks the browser for its location using the `navigator.geolocation` API. The browser then leverages the device's hardware (e.g., GPS chips on mobile, Wi-Fi access point mapping on desktop) to determine a precise location.
   - **Characteristics:**
     - **Requires explicit user consent** (a soft-prompt or browser permission prompt).
     - **High Accuracy**: Can pinpoint the user to within a few meters.
     - Harder to spoof natively without device-level tampering, though still possible.

### Implementation Setup

1. Configure `.env` files in both the `/backend` and `/frontend` directories.
2. In `/backend`, run `npm start` (or `node index.js`).
3. In `/frontend`, run `npm run dev`.
4. Open your browser and navigate to the local server URL. Upon visiting, the IP will be recorded. If the "Check Connection Security" button is clicked and location access is granted, highly accurate latitude and longitude are submitted.

## Notice
This tool is built purely for *educational purposes* to demonstrate forensic footprints. Do not deploy these techniques maliciously.
