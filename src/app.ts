import express from 'express'
import { corsMiddleware } from '@/middleware';
import v1Router from './routes/v1Routes';
const app = express();

app.use(express.json());
app.use(corsMiddleware);


app.use('/api/v1', v1Router)
export default app

