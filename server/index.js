require('dotenv').config();
const express = require('express');
const cors = require('cors');
const errorHandler = require('./src/middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));

app.use(express.json());

app.get('/health', (_req, res) => res.json({ status: 'ok', ts: new Date() }));
app.use('/api/auth',         require('./src/routes/auth'));
app.use('/api/transactions', require('./src/routes/transactions'));

app.use(errorHandler);

app.listen(PORT, () => console.log(`API ready → http://localhost:${PORT}`));
