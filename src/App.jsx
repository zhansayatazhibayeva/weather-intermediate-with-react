import "./App.css";
import { Header } from "./components/Header";
import { useState } from "react";

function App() {
  const [city, setCity] = useState("");
  const [locationData, setLocationData] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  function getWeatherIcon(code) {
    if (code === 0) return "/icon-sunny.webp";
    if ([1, 2, 3].includes(code)) return "/icon-partly-cloudy.webp";
    if ([45, 48].includes(code)) return "/icon-fog.webp";
    if ([51, 53, 55].includes(code)) return "/icon-drizzle.webp";
    if ([61, 63, 65, 80, 81, 82].includes(code)) return "/icon-rain.webp";
    if ([71, 73, 75, 77].includes(code)) return "/icon-snow.webp";
    if ([95, 96, 99].includes(code)) return "/icon-storm.webp";

    return "/icon-loading.svg";
  }
  async function getWeather() {
    setLoading(true);
    setError(false);
    setLocationData(null);
    setForecast(null);

    if (!city) return;
    const geoRes = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${city}`
    );
    const geoData = await geoRes.json();

    if (!geoData.results || geoRes.status !== 200) {
      setError(true);
      setLoading(false);
      return;
    }

    const place = geoData.results[0];
    setLocationData(place);

    const { latitude, longitude } = place;

    const forecastRes = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=temperature_2m,weathercode&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=auto`
    );

    const forecastData = await forecastRes.json();
    setForecast(forecastData);
    console.log(forecastData);
    setLoading(false);
  }
  return (
    <>
      <Header />
      <h1>How the Sky is looking today?</h1>
      <div
        style={{
          display: "flex",
          gap: "20px",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: "500px",
            padding: "10px",
            borderRadius: "10px",
            backgroundColor: "#F5F8F5",
            opacity: "1",
            display: "flex",
            gap: "10px",
          }}
        >
          <img src="/icon-search.svg"></img>
          <input
            placeholder="Search for a place"
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "10px",
              backgroundColor: "transparent",
              border: "none",
            }}
            onChange={(e) => setCity(e.target.value)}
          />
        </div>
        <button
          style={{
            padding: "15px 20px",
            borderRadius: "10px",
            backgroundColor: "blue",
            color: "white",
          }}
          onClick={getWeather}
        >
          {loading ? "Searching" : "Search"}
        </button>
      </div>
      {error && (
        <>
          <div>
            <h2>City not found</h2>
          </div>
        </>
      )}
      {locationData && forecast && (
        <>
          <div
            className="container"
            style={{
              display: "flex",
              flexDirection: "row",
              gap: "20px",
            }}
          >
            <div className="left-side-container">
              <div
                className="left"
                style={{
                  width: "700px",
                  height: "240px",
                  backgroundImage: 'url("/bg-today-large.svg")',
                  borderRadius: "20px",
                  margin: "10px 0",
                  padding: "20px",
                }}
              >
                <div className="main-weather" style={{}}>
                  <div
                    style={{
                      height: "100px",
                      display: "flex",
                      justifyContent: "space-between",
                      width: "100%",
                    }}
                  >
                    <div>
                      <h2>{locationData.name}</h2>
                      <p>{new Date().toDateString()}</p>
                    </div>
                    <div style={{ display: "flex" }}>
                      <img
                        src={getWeatherIcon(
                          forecast.current_weather.weathercode
                        )}
                      ></img>
                      <h1>{forecast.current_weather.temperature}°C</h1>
                    </div>
                  </div>
                </div>
              </div>

              <div
                className="container-left-four"
                style={{
                  width: "700px",
                  height: "150px",
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "20px",
                }}
              >
                <div
                  className="box"
                  style={{
                    backgroundColor: "hsl(243, 23%, 24%)",
                    borderRadius: "10px",
                    width: "150px",
                  }}
                >
                  <p>Feels Like</p>
                  <h2>{forecast.current_weather.temperature}°C</h2>
                </div>
                <div
                  className="box"
                  style={{
                    backgroundColor: "hsl(243, 23%, 24%)",
                    borderRadius: "10px",
                    width: "150px",
                  }}
                >
                  <p>Low</p>
                  <h2>{forecast.daily.temperature_2m_min[0]}°C</h2>
                </div>
                <div
                  className="box"
                  style={{
                    backgroundColor: "hsl(243, 23%, 24%)",
                    borderRadius: "10px",
                    width: "150px",
                  }}
                >
                  <p>Wind</p>
                  <h2>{forecast.current_weather.windspeed} km/h </h2>
                </div>
                <div
                  className="box"
                  style={{
                    backgroundColor: "hsl(243, 23%, 24%)",
                    borderRadius: "10px",
                    width: "150px",
                  }}
                >
                  <p>High</p>
                  <h2>{forecast.daily.temperature_2m_max[0]}°C</h2>
                </div>
              </div>

              {forecast?.daily && (
                <>
                  <h2 style={{ textAlign: "left" }}>Daily Forecast</h2>
                  <div style={{ width: "700px", display: "flex", gap: "10px" }}>
                    {forecast.daily.time.slice(0, 7).map((date, index) => (
                      <div
                        key={index}
                        style={{
                          width: "100px",
                          backgroundColor: "hsl(243, 23%, 24%)",
                          borderRadius: "10px",
                          padding: "10px",
                          textAlign: "center",
                        }}
                      >
                        <h3>
                          {new Date(date).toLocaleDateString("en-US", {
                            weekday: "short",
                          })}
                        </h3>

                        <img
                          src={getWeatherIcon(
                            forecast.daily.weathercode[index]
                          )}
                          style={{ width: "40px" }}
                        />

                        <p>
                          {forecast.daily.temperature_2m_max[index]}° /{" "}
                          {forecast.daily.temperature_2m_min[index]}°
                        </p>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
            <div
              className="right-side-container"
              style={{
                width: "500px",
                borderRadius: "10px",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              <h3>Hourly Forecast</h3>
              {forecast.hourly.time
                .filter((_, idx) => idx % 4 === 0)
                .slice(0, 6)
                .map((time, index) => (
                  <div
                    key={index}
                    style={{
                      minWidth: "80px",
                      backgroundColor: "hsl(243, 23%, 24%)",
                      padding: "10px",
                      borderRadius: "10px",
                      textAlign: "center",
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <p>
                      {new Date(time).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                    <img
                      src={getWeatherIcon(forecast.hourly.weathercode[index])}
                      style={{ width: "40px" }}
                    ></img>
                    <h4>{forecast.hourly.temperature_2m[index]}°C</h4>
                  </div>
                ))}
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default App;
