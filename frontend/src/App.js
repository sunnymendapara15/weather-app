
import { useState } from 'react';
import './App.css';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:4000';

const WEATHER_CODES = {
  0: 'Clear sky',
  1: 'Mainly clear',
  2: 'Partly cloudy',
  3: 'Overcast',
  45: 'Fog',
  48: 'Deposit rime fog',
  51: 'Light drizzle',
  53: 'Moderate drizzle',
  55: 'Dense drizzle',
  56: 'Light freezing drizzle',
  57: 'Dense freezing drizzle',
  61: 'Light rain',
  63: 'Moderate rain',
  65: 'Heavy rain',
  66: 'Freezing rain',
  67: 'Heavy freezing rain',
  71: 'Light snow',
  73: 'Moderate snow',
  75: 'Heavy snow',
  77: 'Snow grains',
  80: 'Rain showers',
  81: 'Heavy rain showers',
  82: 'Violent rain showers',
  85: 'Light snow showers',
  86: 'Heavy snow showers',
  95: 'Thunderstorm',
  96: 'Thunderstorm with slight hail',
  99: 'Thunderstorm with heavy hail'
};

const describeCode = (code) => WEATHER_CODES[code] || 'Mixed conditions';

function App() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!city.trim()) {
      setError('Please enter a city name.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_BASE}/api/weather?city=${encodeURIComponent(city.trim())}`);
      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.error || 'Unable to load weather');
      }

      const payload = await response.json();
      setWeather(payload);
    } catch (requestError) {
      setError(requestError.message);
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  const dailyRows = weather?.daily?.time?.map((date, index) => ({
    date,
    max: weather.daily.temperature_2m_max?.[index],
    min: weather.daily.temperature_2m_min?.[index],
    code: weather.daily.weathercode?.[index]
  })) ?? [];

  const temperature = weather?.current?.temperature;

  return (
    <div className="app-shell">
      <div className="panel">
        <header>
          <p className="eyebrow">Weather App</p>
          <h1>Real-time forecast</h1>
          <p className="subhead">Powered by Open-Meteo (no API key required).</p>
        </header>

        <form className="search-form" onSubmit={handleSubmit}>
          <input
            aria-label="City name"
            placeholder="e.g. Seattle"
            value={city}
            onChange={(event) => setCity(event.target.value)}
            disabled={loading}
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Fetching…' : 'Get weather'}
          </button>
        </form>

        {error && <p className="error">{error}</p>}

        {weather && (
          <section className="weather-details">
            <div className="current-card">
              <div>
                <p className="eyebrow">
                  {weather.location?.name}, {weather.location?.country}
                </p>
                <h2>{temperature !== undefined ? `${temperature.toFixed(1)}°C` : '—'}</h2>
                <p className="status">{describeCode(weather.current?.weathercode)}</p>
              </div>
              <ul className="current-meta">
                <li>Wind: {weather.current?.windspeed ?? '—'} km/h</li>
                <li>Updated: {weather.current?.time ?? '—'} ({weather.timezone})</li>
              </ul>
            </div>

            <div className="daily-card">
              <div className="card-header">
                <h3>Daily forecast</h3>
                <p>Min / Max &amp; summary</p>
              </div>
              <div className="daily-grid">
                {dailyRows.map((row) => (
                  <article key={row.date}>
                    <p className="date">{row.date}</p>
                    <p className="code">{describeCode(row.code)}</p>
                    <p className="temp">
                      {row.min?.toFixed(0)}° / {row.max?.toFixed(0)}°
                    </p>
                  </article>
                ))}
                {dailyRows.length === 0 && <p className="muted">No daily data available.</p>}
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export default App;
