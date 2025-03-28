import dotenv from 'dotenv';
dotenv.config();
import dayjs from 'dayjs';

class WeatherService {
  constructor() {
    // Use API_KEY from .env, or fallback to your provided key.
    this.apiKey = process.env.API_KEY || '9b65626d17d9c897e4b3e371e6ad98e3';
    // Use API_BASE_URL from .env, or default to OpenWeather's base URL.
    this.baseUrl = process.env.API_BASE_URL || 'https://api.openweathermap.org';
  }

  // Get geographic coordinates (lat, lon) for a given city name.
  async getCoordinates(cityName) {
    const geoUrl = `${this.baseUrl}/geo/1.0/direct?q=${encodeURIComponent(cityName)}&limit=1&appid=${this.apiKey}`;
    const response = await fetch(geoUrl);
    const data = await response.json();
    if (!data || data.length === 0) {
      throw new Error('City not found');
    }
    return { lat: data[0].lat, lon: data[0].lon };
  }

  // Fetch weather data using the 5-day forecast endpoint.
  async getWeather(cityName) {
    const coords = await this.getCoordinates(cityName);
    const forecastUrl = `${this.baseUrl}/data/2.5/forecast?lat=${coords.lat}&lon=${coords.lon}&appid=${this.apiKey}&units=imperial`;
    const response = await fetch(forecastUrl);
    const forecastData = await response.json();

    // Get current weather data from the first forecast entry.
    const currentData = forecastData.list[0];
    const currentWeather = {
      city: forecastData.city.name,
      date: dayjs.unix(currentData.dt).format('MM/DD/YYYY'),
      icon: currentData.weather[0].icon,
      iconDescription: currentData.weather[0].description,
      tempF: currentData.main.temp,
      windSpeed: currentData.wind.speed,
      humidity: currentData.main.humidity,
    };

    // Build a 5-day forecast array by picking every 8th entry.
    const forecast = [];
    for (let i = 8; i < forecastData.list.length; i += 8) {
      const item = forecastData.list[i];
      forecast.push({
        date: dayjs.unix(item.dt).format('MM/DD/YYYY'),
        icon: item.weather[0].icon,
        iconDescription: item.weather[0].description,
        tempF: item.main.temp,
        windSpeed: item.wind.speed,
        humidity: item.main.humidity,
      });
    }
    return [currentWeather, ...forecast];
  }
}

export default new WeatherService();
