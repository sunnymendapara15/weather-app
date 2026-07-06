
# Weather App

Full-stack weather dashboard with a React + Create React App frontend and an Express backend that proxies Open-Meteo data.

## Architecture

- **Frontend**: Create React App (React 18, React Scripts) for the weather UI.
- **Backend**: Express API that geocodes city names via Open-Meteo's geocoding endpoint and merges that with the Open-Meteo forecast.

## Getting started

### Backend

```bash
cd backend
npm install
npm run dev # requires nodemon or use npm start for production
```

The backend listens on port `4000` by default and exposes `/api/weather?city=<name>`. It fetches the location from the Open-Meteo geocoding API and returns the current and daily forecast data.

### Frontend

```bash
cd frontend
npm install
REACT_APP_API_BASE=http://localhost:4000 npm start
```

The React app talks to the backend through `REACT_APP_API_BASE` (defaults to `http://localhost:4000`).

## Deployment notes

- Deploy the backend to any Node-compatible host and point `REACT_APP_API_BASE` to that URL.
- Run `npm run build` from `frontend` to produce static assets for hosting.
