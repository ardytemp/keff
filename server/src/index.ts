import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import pool from './config/database';
import { authenticate } from './middleware/auth';

import authRoutes from './routes/auth';
import contactRoutes from './routes/contacts';
import categoryRoutes from './routes/categories';
import expenseRoutes from './routes/expenses';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(helmet());
app.use(express.json());

// Public
app.use('/api/auth', authRoutes);

// Protected
app.use('/api/contacts', authenticate, contactRoutes);
app.use('/api/categories', authenticate, categoryRoutes);
app.use('/api/expenses', authenticate, expenseRoutes);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Keff API running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
