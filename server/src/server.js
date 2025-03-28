import dotenv from 'dotenv';
import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
dotenv.config();

import routes from './routes/index.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Compute __dirname using fileURLToPath, since we're in an ES module.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the client build folder.
// Since this file is at server/src/server.js, go up two levels to reach the repository root,
// then into client/dist.
app.use(express.static(path.join(__dirname, '../../client/dist')));

// Connect API and HTML routes
app.use(routes);

app.listen(PORT, () => console.log(`Listening on PORT: ${PORT}`));
