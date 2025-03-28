import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Router } from 'express';

const router = Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve index.html for any route not caught by the API routes
router.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../client', 'index.html'));
});

export default router;
