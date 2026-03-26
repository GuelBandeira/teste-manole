import { describe, it, expect, beforeEach, vi } from 'vitest';
import { updateTask } from '../controllers/taskController.js';
import { createMockRequest, createMockResponse, createMockNext } from './helpers.js';

vi.mock('../config/db.js', () => ({
   default: {
      run: vi.fn(),
   },
}));

describe('Task Validation Tests', () => {
   let req, res;

   beforeEach(() => {
      req = createMockRequest();
      res = createMockResponse();
   });

   describe('updateTask - Título', () => {
      it('deve retornar erro se título está vazio', () => {
         req.body = { title: '', description: 'test', status: 0 };
         req.params = { id: 1 };

         updateTask(req, res);

         expect(res.statusCode).toBe(400);
         expect(res.jsonData.error).toContain('Título da tarefa é obrigatório');
      });

      it('deve retornar erro se título tem apenas espaços', () => {
         req.body = { title: '   ', description: 'test', status: 0 };
         req.params = { id: 1 };

         updateTask(req, res);

         expect(res.statusCode).toBe(400);
         expect(res.jsonData.error).toContain('Título da tarefa é obrigatório');
      });

      it('deve retornar erro se título tem mais de 255 caracteres', () => {
         req.body = {
            title: 'a'.repeat(256),
            description: 'test',
            status: 0
         };
         req.params = { id: 1 };

         updateTask(req, res);

         expect(res.statusCode).toBe(400);
         expect(res.jsonData.error).toContain('255 caracteres');
      });

      it('deve aceitar título válido com 255 caracteres', () => {
         req.body = {
            title: 'a'.repeat(255),
            description: 'test',
            status: 0
         };
         req.params = { id: 1 };

         updateTask(req, res);

         expect(res.statusCode).not.toBe(400);
      });
   });

   describe('updateTask - Status', () => {
      it('deve retornar erro se status é inválido (3)', () => {
         req.body = { title: 'Tarefa', description: 'test', status: 3 };
         req.params = { id: 1 };

         updateTask(req, res);

         expect(res.statusCode).toBe(400);
         expect(res.jsonData.error).toContain('Status da tarefa inválido');
      });

      it('deve retornar erro se status é um valor negativo', () => {
         req.body = { title: 'Tarefa', description: 'test', status: -1 };
         req.params = { id: 1 };

         updateTask(req, res);

         expect(res.statusCode).toBe(400);
      });

      it('deve aceitar status 0 (pendente)', () => {
         req.body = { title: 'Tarefa', description: 'test', status: 0 };
         req.params = { id: 1 };

         updateTask(req, res);

         expect(res.statusCode).not.toBe(400);
      });

      it('deve aceitar status 1 (em andamento)', () => {
         req.body = { title: 'Tarefa', description: 'test', status: 1 };
         req.params = { id: 1 };

         updateTask(req, res);

         expect(res.statusCode).not.toBe(400);
      });

      it('deve aceitar status 2 (concluída)', () => {
         req.body = { title: 'Tarefa', description: 'test', status: 2 };
         req.params = { id: 1 };

         updateTask(req, res);

         expect(res.statusCode).not.toBe(400);
      });
   });
});
