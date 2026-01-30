import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import leadsRoutes from './routes/leads.js';
import propertiesRoutes from './routes/properties.js';
import buyersRoutes from './routes/buyers.js';
import sellersRoutes from './routes/sellers.js';
import contractsRoutes from './routes/contracts.js';
import callLogsRoutes from './routes/callLogs.js';
import dashboardRoutes from './routes/dashboard.js';
import { errorHandler } from './middleware/error.js';

const app = express();
const PORT = parseInt(process.env.PORT || '3001', 10);

// --- Middleware ---
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());

// --- Health check ---
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// --- Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/leads', leadsRoutes);
app.use('/api/properties', propertiesRoutes);
app.use('/api/buyers', buyersRoutes);
app.use('/api/sellers', sellersRoutes);
app.use('/api/contracts', contractsRoutes);
app.use('/api/call-logs', callLogsRoutes);
app.use('/api/dashboard', dashboardRoutes);

// --- Error handling ---
app.use(errorHandler);

// --- Start server ---
app.listen(PORT, '0.0.0.0', () => {
  console.log(`[Propel API] Server running on http://localhost:${PORT}`);
  console.log(`[Propel API] Health check: http://localhost:${PORT}/api/health`);
});

export default app;
