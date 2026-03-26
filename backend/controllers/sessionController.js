import DB from '../config/db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/jwtSecret.js';

export const loginUser = (req, res) => {
   const { email, password } = req.body;

   const query = 'SELECT * FROM users WHERE email = ?';
   DB.get(query, [email], async (err, user) => {
      if (err) {
         console.error('Erro ao realizar login:', err);
         return res.status(500).json({ error: 'Falha ao realizar login' });
      }

      if (!user) {
         return res.status(401).json({ error: 'Email ou senha incorretos' });
      }

      try {
         const passwordMatch = await bcrypt.compare(password, user.password);

         if (!passwordMatch) {
            return res.status(401).json({ error: 'Email ou senha incorretos' });
         }

         const token = jwt.sign(
            { sub: user.id, name: user.name, email: user.email },
            JWT_SECRET,
            { expiresIn: '1h' }
         );

         res.status(200).json({
            message: 'Login realizado com sucesso',
            token,
            user: {
               id: user.id,
               name: user.name,
               email: user.email
            }
         });
      } catch (error) {
         console.error('Erro ao processar login:', error);
         return res.status(500).json({ error: 'Falha ao realizar login' });
      }
   });
};

export const logoutUser = (req, res) => {
   // JWT e stateless: o cliente remove o token localmente.
   res.status(200).json({ message: 'Logout realizado com sucesso' });
};

export const createUser = async (req, res) => {
   const { name, email, password } = req.body;

   const checkQuery = 'SELECT * FROM users WHERE email = ?';
   DB.get(checkQuery, [email], async (err, existingUser) => {
      if (err) {
         console.error('Erro ao verificar email:', err);
         return res.status(500).json({ error: 'Falha ao cadastrar usuário' });
      }

      if (existingUser) {
         return res.status(400).json({ error: 'Email já cadastrado' });
      }

      try {
         const senhaEncriptada = await bcrypt.hash(password, 10);

         const insertQuery = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
         const values = [name, email, senhaEncriptada];

         DB.run(insertQuery, values, function (err) {
            if (err) {
               console.error('Erro ao cadastrar usuário:', err);
               return res.status(500).json({ error: 'Falha ao cadastrar usuário' });
            }

            res.status(201).json({
               message: 'Usuário cadastrado com sucesso',
               user: {
                  id: this.lastID,
                  name,
                  email
               }
            });
         });
      } catch (error) {
         console.error('Erro ao processar senha:', error);
         return res.status(500).json({ error: 'Falha ao cadastrar usuário' });
      }
   });
};

export const checkAuth = (req, res) => {
   if (req.user?.sub) {
      return res.status(200).json({
         authenticated: true,
         user: {
            id: req.user.sub,
            name: req.user.name,
            email: req.user.email
         }
      });
   }
   return res.status(401).json({ authenticated: false });
};
