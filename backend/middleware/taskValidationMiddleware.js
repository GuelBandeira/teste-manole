import { param, body, validationResult } from 'express-validator';

export const validateTaskId = [
   param('id')
      .isInt({ min: 1 })
      .withMessage('ID da tarefa deve ser um número válido'),

   (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
         return res.status(400).json({
            error: 'ID inválido',
            details: errors.array().map(err => err.msg)
         });
      }
      next();
   }
];

export const validateAddTask = [
   body('title')
      .trim()
      .notEmpty()
      .withMessage('Título da tarefa é obrigatório')
      .isLength({ min: 1, max: 255 })
      .withMessage('Título deve ter entre 1 e 255 caracteres'),

   body('description')
      .optional({ checkFalsy: true })
      .trim()
      .isLength({ max: 1000 })
      .withMessage('Descrição não pode ter mais de 1000 caracteres'),

   body('status')
      .optional({ checkFalsy: true })
      .isInt({ min: 0, max: 2 })
      .withMessage('Status deve ser pendente, em andamento ou concluída'),

   (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
         return res.status(400).json({
            error: 'Dados inválidos',
            details: errors.array().map(err => err.msg)
         });
      }
      next();
   }
];

export const validateUpdateTask = [
   body('title')
      .trim()
      .notEmpty()
      .withMessage('Título da tarefa é obrigatório')
      .isLength({ min: 3, max: 255 })
      .withMessage('Título deve ter entre 3 e 255 caracteres'),

   body('description')
      .optional({ checkFalsy: true })
      .trim()
      .isLength({ max: 1000 })
      .withMessage('Descrição não pode ter mais de 1000 caracteres'),

   body('status')
      .optional({ checkFalsy: true })
      .isInt({ min: 0, max: 2 })
      .withMessage('Status deve ser pendente, em andamento ou concluída'),

   param('id')
      .isInt({ min: 1 })
      .withMessage('ID da tarefa deve ser um número válido'),

   (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
         return res.status(400).json({
            error: 'Dados inválidos',
            details: errors.array().map(err => err.msg)
         });
      }
      next();
   }
];

export const validateUserId = [
   param('id')
      .isInt({ min: 1 })
      .withMessage('ID do usuário deve ser um número válido'),

   (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
         return res.status(400).json({
            error: 'ID inválido',
            details: errors.array().map(err => err.msg)
         });
      }
      next();
   }
];
