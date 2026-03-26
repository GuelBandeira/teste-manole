import DB from '../config/db.js';
import bcrypt from 'bcrypt';

export const getUser = (req, res) => {
   const query = 'SELECT * FROM users WHERE id = ?';
   const values = [req.params.id];

   DB.get(query, values, (err, result) => {
      if (err) {
         console.error('Erro ao buscar usuário:', err);
         return res.status(500).json({ error: 'Falha ao buscar usuário' });
      }

      if (!result) {
         return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      res.status(200).json(result);
   });
};


export const updateUser = (req, res) => {
   const { name, email, password } = req.body;
   const userId = req.params.id || req.body.id;

   // Validar email único se estiver sendo alterado
   if (email) {
      const checkEmailQuery = 'SELECT id FROM users WHERE email = ? AND id != ?';
      DB.get(checkEmailQuery, [email, userId], (err, result) => {
         if (err) {
            console.error('Erro ao verificar e-mail:', err);
            return res.status(500).json({ error: 'Falha ao verificar e-mail' });
         }

         if (result) {
            return res.status(409).json({ error: 'Este e-mail já está em uso' });
         }

         // Proceder com atualização
         performUpdate(userId, name, email, password, res);
      });
   } else {
      performUpdate(userId, name, email, password, res);
   }
};

const performUpdate = (userId, name, email, password, res) => {
   let query, values;

   if (password) {
      const hashedPassword = bcrypt.hashSync(password, 10);
      query = 'UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?';
      values = [name, email, hashedPassword, userId];
   } else {
      query = 'UPDATE users SET name = ?, email = ? WHERE id = ?';
      values = [name, email, userId];
   }

   DB.run(query, values, (err, result) => {
      if (err) {
         console.error('Erro atualizando informações do usuário:', err);
         return res.status(500).json({ error: 'Falha ao atualizar informações do usuário' });
      }

      res.status(200).json({ message: 'Informações atualizadas com sucesso' });
   });
};

export const deleteUser = (req, res) => {
   const query = 'DELETE FROM users WHERE id = ?';
   const values = [req.params.id];
   DB.run(query, values, (err, result) => {
      if (err) {
         console.error('Erro ao deletar usuário:', err);
         return res.status(500).json({ error: 'Falha ao deletar usuário' });
      }

      res.status(200).json({ message: 'Usuário deletado com sucesso' });
   });
};