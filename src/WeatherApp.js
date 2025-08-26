import { useState } from "react";

export default function WeatherApp() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");

  const getWeather = async () => {
    try {
      setError("");
      setWeather(null);

      // Step 1: Get coordinates from city
      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${city}`
      );
      const geoData = await geoRes.json();
      if (!geoData.results || geoData.results.length === 0) {
        setError("City not found!");
        return;
      }
      const { latitude, longitude } = geoData.results[0];

      // Step 2: Get weather from coordinates
      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
      );
      const weatherData = await weatherRes.json();
      setWeather(weatherData.current_weather);
    } catch (err) {
      setError("Something went wrong. Try again.");
    }
  };

  return (
    <div style={{ fontFamily: "Arial", maxWidth: "400px", margin: "auto" }}>
      <h2>🌤️ Weather Now</h2>
      <input
        type="text"
        placeholder="Enter city name"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        style={{ padding: "8px", width: "70%" }}
      />
      <button onClick={getWeather} style={{ padding: "8px", marginLeft: "10px" }}>
        Get Weather
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {weather && (
        <div style={{ marginTop: "20px" }}>
          <p>🌡️ Temperature: {weather.temperature}°C</p>
          <p>💨 Wind Speed: {weather.windspeed} km/h</p>
        </div>
      )}
    </div>
  );
}
