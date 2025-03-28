import dotenv from 'dotenv';
import express from 'express';
import path from 'node:path';
dotenv.config();

import routes from './routes/index.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the client build folder
// (Assuming your built client files are in "client/dist")
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, 'client/dist')));



// Connect API and HTML routes
app.use(routes);

app.listen(PORT, () => console.log(`Listening on PORT: ${PORT}`));
