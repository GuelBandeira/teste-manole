import express from 'express';
import cors from 'cors';
import db from './config/db.js';
import usersRoutes from './routes/usersRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import sessionRoutes from './routes/sessionRoutes.js';

const app = express();
const port = 3005;

// Configurar CORS
app.use(cors({
   origin: 'http://localhost:3000', // URL do frontend
   credentials: true
}));

app.use(express.json());


// Rotas
app.use(sessionRoutes);
app.use(usersRoutes);
app.use(taskRoutes);

export default app;
