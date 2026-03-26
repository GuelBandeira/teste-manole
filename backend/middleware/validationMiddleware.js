import { body, validationResult } from 'express-validator';

export const validateRegister = [
   body('name')
      .trim()
      .notEmpty()
      .withMessage('Nome é obrigatório')
      .isLength({ min: 3 })
      .withMessage('Nome deve ter pelo menos 3 caracteres')
      .matches(/^[a-zA-Z\s]+$/)
      .withMessage('Nome deve conter apenas letras'),

   body('email')
      .trim()
      .notEmpty()
      .withMessage('Email é obrigatório')
      .isEmail()
      .withMessage('Email inválido')
      .normalizeEmail(),

   body('password')
      .notEmpty()
      .withMessage('Senha é obrigatória')
      .isLength({ min: 8 })
      .withMessage('Senha deve ter pelo menos 8 caracteres')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage('Senha deve conter pelo menos uma letra maiúscula, uma minúscula e um número'),

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

export const validateLogin = [
   body('email')
      .trim()
      .notEmpty()
      .withMessage('Email é obrigatório')
      .isEmail()
      .withMessage('Email inválido')
      .normalizeEmail(),

   body('password')
      .notEmpty()
      .withMessage('Senha é obrigatória'),

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
