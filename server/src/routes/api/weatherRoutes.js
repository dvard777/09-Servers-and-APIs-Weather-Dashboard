import { Router } from 'express';
import WeatherService from '../../service/weatherService.js';
import HistoryService from '../../service/historyService.js';

const router = Router();

// POST /api/weather/ - Retrieve weather data and add city to history
router.post('/', async (req, res) => {
  try {
    const { cityName } = req.body;
    if (!cityName) return res.status(400).json({ error: 'City name is required' });
    // Get weather data from OpenWeather
    const weatherData = await WeatherService.getWeather(cityName);
    // Save the city to search history
    await HistoryService.addCity({ name: cityName });
    res.json(weatherData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || 'Server error' });
  }
});

// GET /api/weather/history - Retrieve saved search history
router.get('/history', async (req, res) => {
  try {
    const history = await HistoryService.getHistory();
    res.json(history);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/weather/history/:id - Remove a city from history
router.delete('/history/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await HistoryService.deleteCity(id);
    const history = await HistoryService.getHistory();
    res.json(history);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
