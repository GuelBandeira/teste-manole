import { describe, it, expect, beforeEach, vi } from 'vitest';
import jwt from 'jsonwebtoken';
import { usuarioAutenticado } from '../middleware/authMiddleware.js';
import { createMockRequest, createMockResponse, createMockNext } from './helpers.js';

const JWT_SECRET = process.env.JWT_SECRET;

describe('Auth Middleware Tests', () => {
   let req, res, next;

   beforeEach(() => {
      req = createMockRequest({}, {});
      res = createMockResponse();
      next = vi.fn();
   });

   describe('usuarioAutenticado', () => {
      it('deve retornar erro 401 se header Authorization está ausente', () => {
         usuarioAutenticado(req, res, next);

         expect(res.statusCode).toBe(401);
         expect(res.jsonData.error).toContain('não autenticado');
         expect(next).not.toHaveBeenCalled();
      });

      it('deve retornar erro 401 se não começa com Bearer', () => {
         req.headers = { authorization: 'Basic xyz' };
         usuarioAutenticado(req, res, next);

         expect(res.statusCode).toBe(401);
         expect(next).not.toHaveBeenCalled();
      });

      it('deve retornar erro 401 se token é inválido', () => {
         req.headers = { authorization: 'Bearer invalid_token' };
         usuarioAutenticado(req, res, next);

         expect(res.statusCode).toBe(401);
         expect(res.jsonData.error).toContain('inválido ou expirado');
         expect(next).not.toHaveBeenCalled();
      });

      it('deve chamar next() com token JWT válido', () => {
         const payload = { sub: 1, email: 'user@test.com', name: 'Test User' };
         const token = jwt.sign(payload, JWT_SECRET);
         req.headers = { authorization: `Bearer ${token}` };

         usuarioAutenticado(req, res, next);

         expect(next).toHaveBeenCalled();
         expect(req.user).toEqual(expect.objectContaining(payload));
         expect(req.user.iat).toEqual(expect.any(Number));
      });

      it('deve extrair corretamente o user_id do payload JWT', () => {
         const payload = { sub: 42, email: 'user@test.com' };
         const token = jwt.sign(payload, JWT_SECRET);
         req.headers = { authorization: `Bearer ${token}` };

         usuarioAutenticado(req, res, next);

         expect(req.user.sub).toBe(42);
      });

      it('deve retornar erro 401 se token expirou', () => {
         const payload = { sub: 1, email: 'user@test.com' };
         const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '-1h' });
         req.headers = { authorization: `Bearer ${token}` };

         usuarioAutenticado(req, res, next);

         expect(res.statusCode).toBe(401);
         expect(res.jsonData.error).toContain('expirado');
      });
   });
});
