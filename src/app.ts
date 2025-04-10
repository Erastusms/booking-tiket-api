import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import routes from '../src/routes';
import { errorHandler } from './middlewares/errorHandler';
import { setupSwagger } from './docs/swagger';

dotenv.config();

// Create an Express application
const app: Application = express();
const PORT = process.env.PORT || 5000;

setupSwagger(app);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet()); // Security middleware
app.use(morgan('dev')); // Logging middleware

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

// Default route
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Train Ticket Booking API is running...' });
});

app.use('/api/v1', routes);

app.use(errorHandler); // Error Handler baru akan terexcute di akhir

export default app;
