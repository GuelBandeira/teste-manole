import { getUser, updateUser, deleteUser } from '../controllers/userController.js';
import { usuarioAutenticado } from '../middleware/authMiddleware.js';
import express from 'express';
const router = express.Router();

// Todas as rotas de usuários requerem autenticação
router.get("/users/:id", usuarioAutenticado, getUser);
router.put("/users/:id", usuarioAutenticado, updateUser);
router.delete("/users/:id", usuarioAutenticado, deleteUser);

export default router;