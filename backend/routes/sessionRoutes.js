import { loginUser, logoutUser, createUser, checkAuth } from '../controllers/sessionController.js';
import { validateLogin, validateRegister } from '../middleware/validationMiddleware.js';
import { usuarioAutenticado } from '../middleware/authMiddleware.js';
import express from 'express';

const router = express.Router();

router.post('/login', validateLogin, loginUser);

router.post('/logout', usuarioAutenticado, logoutUser);

router.post('/register', validateRegister, createUser);

router.get('/auth/check', usuarioAutenticado, checkAuth);
router.get('/auth/me', usuarioAutenticado, checkAuth);

export default router;