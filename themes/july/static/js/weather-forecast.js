const dayForecast = 1;

const getInput = document.getElementById("weather-input");
const getSubmit = document.getElementById("weather-submit");
const getResult = document.getElementById("weather-result");
const getError = document.getElementById("weather-error");

function getWeatherCode(code) {
    const weatherCodes = {
        0: "Clear sky", 1: "Mainly clear", 2: "Partly cloudy", 3: "Overcast",
        45: "Fog", 48: "Depositing rime fog", 51: "Drizzle (Light)", 53: "Drizzle (Moderate)",
        55: "Drizzle (Dense)", 56: "Freezing Drizzle (Light)", 57: "Freezing Drizzle (Dense)",
        61: "Rain (Slight)", 63: "Rain (Moderate)", 65: "Rain (Heavy)",
        66: "Freezing Rain (Light)", 67: "Freezing Rain (Heavy)", 71: "Snow fall (Slight)",
        73: "Snow fall (Moderate)", 75: "Snow fall (Heavy)", 77: "Snow grains",
        80: "Rain showers (Slight)", 81: "Rain showers (Moderate)", 82: "Rain showers (Violent)",
        85: "Snow showers (Slight)", 86: "Snow showers (Heavy)", 95: "Thunderstorm",
        96: "Thunderstorm with slight hail", 99: "Thunderstorm with heavy hail"
    };
    return weatherCodes[code] || "Unknown";
}

function getWindDirection(degree) {
    const directions = ["North", "North-East", "East", "South-East", "South", "South-West", "West", "North-West"];
    return directions[Math.round(degree / 45) % 8];
}

function getAQIDescription(aqi) {
    if (aqi <= 50) return "Good 🟢";
    if (aqi <= 100) return "Moderate 🟡";
    if (aqi <= 150) return "Unhealthy for Sensitive Groups 🟠";
    if (aqi <= 200) return "Unhealthy 🔴";
    if (aqi <= 300) return "Very Unhealthy 🟣";
    return "Hazardous 🟤";
}

getSubmit.addEventListener("click", () => {
    document.getElementById("weather-error").innerText = "";
    let locationInput = getInput.value;
    if (locationInput === "") return;

    let getCord = `https://geocoding-api.open-meteo.com/v1/search?name=${locationInput}&count=1`;
    fetch(getCord)
        .then((response) => {
            if (response.status === 200) return response.json();
            throw new Error("Error while fetching location data.");
        })
        .then((data) => {
            if (!data.results || data.results.length === 0) {
                document.getElementById("weather-error").innerText = `Can't find a location named "${locationInput}".`;
                throw new Error(`Can't find a location named "${locationInput}".`);
            }

            let locationName = [data.results[0].name, data.results[0].admin1, data.results[0].country]
                .filter(Boolean).join(", ");

            let lat = data.results[0].latitude;
            let long = data.results[0].longitude;
            
            // Fetch Weather (hourly windspeed to calculate average)
            let getWeather = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&daily=weathercode,temperature_2m_max,temperature_2m_min,rain_sum,winddirection_10m_dominant&hourly=temperature_2m,windspeed_10m&timezone=auto&forecast_days=${dayForecast}`;
            
            // Fetch Air Quality
            let getAQI = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${long}&current=us_aqi`;

            Promise.all([
                fetch(getWeather).then(res => res.json()),
                fetch(getAQI).then(res => res.json())
            ])
            .then(([weatherData, aqiData]) => {
                let weatherCode = weatherData.daily.weathercode[0];
                let currentHour = new Date().getHours();
                let currentTemperature = weatherData.hourly.temperature_2m[currentHour];
                let maxTemperature = weatherData.daily.temperature_2m_max[0];
                let minTemperature = weatherData.daily.temperature_2m_min[0];
                let rainSum = weatherData.daily.rain_sum[0];
                let windDirection = weatherData.daily.winddirection_10m_dominant[0];

                // Calculate average wind speed from hourly data
                let hourlyWind = weatherData.hourly.windspeed_10m.slice(0, 24);
                let avgWindSpeed = (hourlyWind.reduce((a, b) => a + b, 0) / hourlyWind.length).toFixed(1);

                let aqi = aqiData.current.us_aqi;
                let aqiDesc = getAQIDescription(aqi);

                let result = `
                    <div class="weather-card">
                        <div class="weather-header">
                            <h3>${locationName}</h3>
                            <span class="weather-code">${getWeatherCode(weatherCode)}</span>
                        </div>
                        <div class="weather-grid">
                            <div class="weather-item">
                                <span class="label">Current Temp</span>
                                <span class="value">${currentTemperature}°C</span>
                                <span class="sub-label">${minTemperature}°C - ${maxTemperature}°C</span>
                            </div>
                            <div class="weather-item">
                                <span class="label">Rainfall</span>
                                <span class="value">${rainSum} mm</span>
                            </div>
                            <div class="weather-item">
                                <span class="label">Average Wind</span>
                                <span class="value">${avgWindSpeed} km/h</span>
                                <span class="sub-label">${getWindDirection(windDirection)}</span>
                            </div>
                            <div class="weather-item">
                                <span class="label">Air Quality (AQI)</span>
                                <span class="value">${aqi}</span>
                                <span class="sub-label">${aqiDesc}</span>
                            </div>
                        </div>
                    </div>
                `;

                // Add to the top of results
                getResult.innerHTML = result + getResult.innerHTML;
            })
            .catch((error) => console.error(error.message));
        })
        .catch((error) => console.error(error.message));
});

getInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        getSubmit.click();
    }
});