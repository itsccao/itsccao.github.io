if (window.__weatherForecastLoaded) {
    // Prevent duplicate script execution
} else {
    window.__weatherForecastLoaded = true;

    const dayForecast = 1;

    const getInput = document.getElementById("weather-input");
    const getSubmit = document.getElementById("weather-submit");
    const getResult = document.getElementById("weather-result");
    const getError = document.getElementById("weather-error");

    let isWeatherFetching = false;

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

    async function handleWeatherSearch(e) {
        if (e) e.preventDefault();
        if (isWeatherFetching) return;

        const locationInput = getInput ? getInput.value.trim() : "";
        if (!locationInput) return;

        isWeatherFetching = true;
        if (getSubmit) getSubmit.disabled = true;
        if (getError) getError.innerText = "";

        try {
            const getCord = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(locationInput)}&count=1`;
            const geoRes = await fetch(getCord);
            if (!geoRes.ok) throw new Error("Error while fetching location data.");
            const data = await geoRes.json();

            if (!data.results || data.results.length === 0) {
                if (getError) getError.innerText = `Can't find a location named "${locationInput}".`;
                return;
            }

            const locationName = [data.results[0].name, data.results[0].admin1, data.results[0].country]
                .filter(Boolean).join(", ");

            const lat = data.results[0].latitude;
            const long = data.results[0].longitude;

            const getWeather = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&daily=weathercode,temperature_2m_max,temperature_2m_min,rain_sum,winddirection_10m_dominant&hourly=temperature_2m,windspeed_10m&timezone=auto&forecast_days=${dayForecast}`;
            const getAQI = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${long}&current=us_aqi`;

            const [weatherData, aqiData] = await Promise.all([
                fetch(getWeather).then(res => res.json()),
                fetch(getAQI).then(res => res.json())
            ]);

            const weatherCode = weatherData.daily.weathercode[0];
            const currentHour = new Date().getHours();
            const currentTemperature = weatherData.hourly.temperature_2m[currentHour];
            const maxTemperature = weatherData.daily.temperature_2m_max[0];
            const minTemperature = weatherData.daily.temperature_2m_min[0];
            const rainSum = weatherData.daily.rain_sum[0];
            const windDirection = weatherData.daily.winddirection_10m_dominant[0];

            const hourlyWind = weatherData.hourly.windspeed_10m.slice(0, 24);
            const avgWindSpeed = (hourlyWind.reduce((a, b) => a + b, 0) / hourlyWind.length).toFixed(1);

            const aqi = aqiData.current.us_aqi;
            const aqiDesc = getAQIDescription(aqi);

            const result = `
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

            if (getResult) {
                getResult.innerHTML = result + getResult.innerHTML;
            }
        } catch (error) {
            console.error("Weather error:", error);
            if (getError) getError.innerText = error.message || "Failed to fetch weather data.";
        } finally {
            isWeatherFetching = false;
            if (getSubmit) getSubmit.disabled = false;
        }
    }

    if (getSubmit) {
        getSubmit.addEventListener("click", handleWeatherSearch);
    }

    if (getInput) {
        getInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                handleWeatherSearch();
            }
        });
    }
}