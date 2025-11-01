import mlRoutes from './routes/ml.js';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { ClerkExpressWithAuth } from '@clerk/express';
import rolesRoutes from './routes/roles.js';
import produceRoutes from './routes/produce.js';
import blockchainRoutes from './routes/blockchain.js';
import blockchainActions from './routes/blockchainActions.js';
import aiRoutes from './routes/ai.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
// Attach Clerk auth (verifies tokens and sets req.auth). Safe if CLERK_SECRET_KEY is set.
try {
  app.use(ClerkExpressWithAuth());
} catch (e) {
  console.warn('[Clerk] Middleware not initialized:', e?.message);
}
app.use('/api/roles', rolesRoutes);
app.use('/api/produce', produceRoutes);
app.use('/api/blockchain', blockchainRoutes);
app.use('/api/ai', aiRoutes);

app.use('/api/ml', mlRoutes);

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/agritrace';

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

app.get('/', (req, res) => {
  res.send('AgriTrace Backend API');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
