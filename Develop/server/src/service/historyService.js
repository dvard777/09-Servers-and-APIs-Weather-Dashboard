import fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

// Adjust the path if needed based on your folder structure
const dbPath = path.resolve('server/db/db.json');

class HistoryService {
  async getHistory() {
    try {
      const data = await fs.readFile(dbPath, 'utf-8');
      return JSON.parse(data);
    } catch (err) {
      // If the file doesn't exist or is empty, return an empty array
      return [];
    }
  }

  async addCity(cityObj) {
    const history = await this.getHistory();
    // Prevent duplicate entries (ignoring case)
    if (history.find((c) => c.name.toLowerCase() === cityObj.name.toLowerCase())) {
      return;
    }
    const newCity = { ...cityObj, id: uuidv4() };
    history.push(newCity);
    await fs.writeFile(dbPath, JSON.stringify(history, null, 2));
  }

  async deleteCity(id) {
    let history = await this.getHistory();
    history = history.filter((c) => c.id !== id);
    await fs.writeFile(dbPath, JSON.stringify(history, null, 2));
  }
}

export default new HistoryService();
