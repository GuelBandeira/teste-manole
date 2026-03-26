import { addTask, getTasks, updateTask, deleteTask } from '../controllers/taskController.js';
import { usuarioAutenticado } from '../middleware/authMiddleware.js';
import { validateAddTask, validateUpdateTask, validateTaskId } from '../middleware/taskValidationMiddleware.js';
import express from 'express';

const router = express.Router();

router.post('/tasks', usuarioAutenticado, validateAddTask, addTask);
router.get('/tasks', usuarioAutenticado, getTasks);
router.put('/tasks/:id', usuarioAutenticado, validateUpdateTask, updateTask);
router.delete('/tasks/:id', usuarioAutenticado, validateTaskId, deleteTask);

export default router;