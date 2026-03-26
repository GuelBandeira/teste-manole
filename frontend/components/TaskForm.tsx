import { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface Task {
   id: number;
   title: string;
   description: string;
   status: number;
   user_id: number;
   created_at: string;
   updated_at: string;
}

interface TaskFormProps {
   isOpen: boolean;
   onClose: () => void;
   onSubmit: (data: { title: string; description: string; status: number }) => void;
   editingTask?: Task | null;
   isSubmitting: boolean;
   errors?: string[];
   onClearErrors?: () => void;
}

export default function TaskForm({ isOpen, onClose, onSubmit, editingTask, isSubmitting, errors = [], onClearErrors }: TaskFormProps) {
   const [title, setTitle] = useState('');
   const [description, setDescription] = useState('');
   const [status, setStatus] = useState(0);

   useEffect(() => {
      if (isOpen && editingTask) {
         queueMicrotask(() => {
            setTitle(editingTask.title);
            setDescription(editingTask.description || '');
            setStatus(editingTask.status);
         });
      } else if (isOpen) {
         queueMicrotask(() => {
            setTitle('');
            setDescription('');
            setStatus(0);
         });
      }
   }, [isOpen, editingTask]);

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!title.trim()) {
         alert('O título da tarefa é obrigatório');
         return;
      }
      onSubmit({ title: title.trim(), description: description.trim(), status });
   };

   const handleClose = () => {
      setTitle('');
      setDescription('');
      setStatus(0);
      onClose();
   };

   if (!isOpen) return null;

   return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
         <div className="w-full max-w-md rounded-lg bg-gray-900 p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
               <h2 className="text-xl font-bold text-white">
                  {editingTask ? 'Editar Tarefa' : 'Criar Nova Tarefa'}
               </h2>
               <button
                  onClick={handleClose}
                  className="rounded p-1 hover:bg-gray-800 text-gray-400"
               >
                  <XMarkIcon className="h-6 w-6" />
               </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
               <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-100">
                     Título
                  </label>
                  <input
                     id="title"
                     type="text"
                     value={title}
                     onChange={(e) => {
                        setTitle(e.target.value);
                        if (onClearErrors) onClearErrors();
                     }}
                     placeholder="Digite o título da tarefa"
                     className="mt-1 block w-full rounded-lg bg-gray-800 px-3 py-2 text-white placeholder-gray-500 outline-1 -outline-offset-1 outline-white/10 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500"
                     disabled={isSubmitting}
                     required
                  />
               </div>

               <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-100">
                     Status
                  </label>
                  <select
                     id="status"
                     value={status}
                     onChange={(e) => {
                        setStatus(Number(e.target.value));
                        if (onClearErrors) onClearErrors();
                     }}
                     className="mt-1 block w-full rounded-lg bg-gray-800 px-3 py-2 text-white outline-1 -outline-offset-1 outline-white/10 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500"
                     disabled={isSubmitting}
                  >
                     <option value={0}>Pendente</option>
                     <option value={1}>Em andamento</option>
                     <option value={2}>Concluída</option>
                  </select>
               </div>

               <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-100">
                     Descrição
                  </label>
                  <textarea
                     id="description"
                     value={description}
                     onChange={(e) => {
                        setDescription(e.target.value);
                        if (onClearErrors) onClearErrors();
                     }}
                     placeholder="Digite a descrição da tarefa (opcional)"
                     rows={3}
                     className="mt-1 block w-full rounded-lg bg-gray-800 px-3 py-2 text-white placeholder-gray-500 outline-1 -outline-offset-1 outline-white/10 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500"
                     disabled={isSubmitting}
                  />
                  {errors.length > 0 && (
                     <div className="mt-2 space-y-1">
                        {errors.map((error, index) => (
                           <p key={index} className="text-sm text-red-400">{error}</p>
                        ))}
                     </div>
                  )}
               </div>

               <div className="flex gap-3">
                  <button
                     type="button"
                     onClick={handleClose}
                     className="flex-1 rounded-lg bg-gray-700 px-4 py-2 font-semibold text-white hover:bg-gray-600 transition disabled:opacity-50"
                     disabled={isSubmitting}
                  >
                     Cancelar
                  </button>
                  <button
                     type="submit"
                     className="flex-1 rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white hover:bg-indigo-700 transition disabled:opacity-50"
                     disabled={isSubmitting}
                  >
                     {isSubmitting ? 'Salvando...' : editingTask ? 'Atualizar' : 'Criar'}
                  </button>
               </div>
            </form>
         </div>
      </div>
   );
}
