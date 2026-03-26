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

//Parte 1 - Lógica e Fundamentos 
app.post('/logica', (req, res) => {
   const arrayNumeros = req.body;
   if (!Array.isArray(arrayNumeros) || arrayNumeros.length === 0) {
      return res.status(400).json({ error: 'O dado enviado não corresponde a um array' });
   }

   let somaPares = 0;
   let somaImpares = 0;
   let countImpares = 0;

   arrayNumeros.forEach(num => {
      if (typeof num === 'number') {
         if (num % 2 === 0) {
            somaPares += num;
         } else {
            somaImpares += num;
            countImpares++;
         }
      }
   });

   const mediaImpares = (countImpares === 0 ? 0 : (somaImpares / countImpares));

   res.status(200).json({ somaPares, mediaImpares });
});


// Rotas
app.use(sessionRoutes);
app.use(usersRoutes);
app.use(taskRoutes);

export default app;
