import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/jwtSecret.js';

export const usuarioAutenticado = (req, res, next) => {
   const authHeader = req.headers.authorization;

   if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Usuário não autenticado' });
   }

   const token = authHeader.split(' ')[1];

   try {
      const payload = jwt.verify(token, JWT_SECRET);
      req.user = payload;
      return next();
   } catch (error) {
      return res.status(401).json({ error: 'Token inválido ou expirado' });
   }
};

