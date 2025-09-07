import express from 'express'
import { corsMiddleware, errorHandler } from '@/middleware';
import v1Router from './routes/v1Routes';
const app = express();

app.use(express.json());
app.use(corsMiddleware);


app.use('/api/v1', v1Router)

app.use(errorHandler)
export default app

