
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 4000;
const fetcher = (...args) => globalThis.fetch(...args);

app.use(cors());
app.use(express.json());

app.get('/api/weather', async (req, res) => {
  const city = req.query.city;
  if (!city) {
    return res.status(400).json({ error: 'city query param required' });
  }

  try {
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`;
    const geoResp = await fetcher(geoUrl);
    const geoData = await geoResp.json();
    const firstLocation = geoData.results?.[0];
    if (!firstLocation) {
      return res.status(404).json({ error: 'No matching location found' });
    }

    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${firstLocation.latitude}&longitude=${firstLocation.longitude}&current_weather=true&daily=weathercode,temperature_2m_min,temperature_2m_max&timezone=auto`;
    const weatherResp = await fetcher(weatherUrl);
    const weatherData = await weatherResp.json();

    res.json({
      location: {
        name: firstLocation.name,
        admin1: firstLocation.admin1,
        country: firstLocation.country
      },
      timezone: weatherData.timezone,
      current: weatherData.current_weather,
      daily: weatherData.daily
    });
  } catch (error) {
    console.error(error);
    res.status(502).json({ error: 'Unable to fetch weather data' });
  }
});

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.listen(PORT, () => {
  console.log(`Weather API listening on port ${PORT}`);
});
