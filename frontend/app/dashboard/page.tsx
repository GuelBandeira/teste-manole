"use client";
import { useState, useEffect, useMemo, useCallback } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/navigation';
import TaskCard from '@/components/TaskCard';
import TaskForm from '@/components/TaskForm';
import Toast, { type ToastMessage } from '@/components/Toast';
import Navbar from '@/components/Navbar';
import { API_URL } from '../../.config';

interface Task {
   id: number;
   title: string;
   description: string;
   status: number;
   user_id: number;
   created_at: string;
   updated_at: string;
}

interface User {
   id: number;
   name: string;
   email: string;
}

interface ApiErrorPayload {
   error?: string;
   details?: string[];
}

export default function Dashboard() {
   const router = useRouter();

   const [user, setUser] = useState<User | null>(null);
   const [toasts, setToasts] = useState<ToastMessage[]>([]);
   const [isFormOpen, setIsFormOpen] = useState(false);
   const [editingTask, setEditingTask] = useState<Task | null>(null);
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [taskFormErrors, setTaskFormErrors] = useState<string[]>([]);
   const [isLoading, setIsLoading] = useState(true);
   const [error, setError] = useState("");
   const [filter, setFilter] = useState<"all" | "pending" | "in_progress" | "completed">("all");
   const [currentPage, setCurrentPage] = useState(1);
   const [tasks, setTasks] = useState<Task[]>([]);
   const ITEMS_PAGE = 3;

   const parseErrorPayload = async (response: Response): Promise<ApiErrorPayload> => {
      try {
         return (await response.json()) as ApiErrorPayload;
      } catch {
         return {};
      }
   };

   const getAuthHeaders = useCallback((): HeadersInit => {
      const token = localStorage.getItem('token');
      const headers: Record<string, string> = {};

      if (token) {
         headers.Authorization = `Bearer ${token}`;
      }

      return headers;
   }, []);

   const fetchTasks = useCallback(async () => {
      try {
         const response = await fetch(`${API_URL}/tasks`, {
            headers: getAuthHeaders(),
         });

         if (!response.ok) {
            throw new Error('Erro ao carregar tarefas');
         }

         const data = (await response.json()) as Task[];
         setTasks(Array.isArray(data) ? data : []);
         setError('');
      } catch {
         setError('Erro ao carregar tarefas');
      }
   }, [API_URL, getAuthHeaders]);

   useEffect(() => {
      const validateToken = async () => {
         const token = localStorage.getItem("token");

         if (!token) {
            router.replace("/");
            return;
         }

         try {
            const response = await fetch(`${API_URL}/auth/me`, {
               headers: {
                  Authorization: `Bearer ${token}`,
               },
            });

            const data = await response.json();

            if (!response.ok) {
               localStorage.removeItem("token");
               router.replace("/");
               return;
            }

            setUser(data.user);
            await fetchTasks();
         } catch {
            setError("Nao foi possivel validar sua sessao.");
         } finally {
            setIsLoading(false);
         }
      };

      validateToken();
   }, [API_URL, fetchTasks, router]);

   const handleLogout = () => {
      localStorage.removeItem("token");
      router.replace("/");
   };

   const addToast = (message: string, type: 'success' | 'error' = 'success') => {
      const id = Date.now().toString();
      setToasts((prev) => [...prev, { id, message, type }]);
   };

   const removeToast = (id: string) => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
   };

   const handleCreateTask = async (data: { title: string; description: string; status: number }) => {
      if (!user) return;

      try {
         setIsSubmitting(true);
         setTaskFormErrors([]);

         const response = await fetch(`${API_URL}/tasks`, {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
               ...getAuthHeaders(),
            },
            body: JSON.stringify(data),
         });

         if (!response.ok) {
            const payload = await parseErrorPayload(response);
            if (Array.isArray(payload.details)) {
               setTaskFormErrors(payload.details);
            } else {
               addToast(payload.error ?? 'Erro ao criar tarefa', 'error');
            }
            return;
         }

         setIsFormOpen(false);
         setEditingTask(null);
         await fetchTasks();
         addToast('Tarefa criada com sucesso!', 'success');
      } catch {
         addToast('Erro ao criar tarefa', 'error');
      } finally {
         setIsSubmitting(false);
      }
   };

   const handleEditTask = async (data: { title: string; description: string; status: number }) => {
      if (!user || !editingTask) return;

      try {
         setIsSubmitting(true);
         setTaskFormErrors([]);

         const response = await fetch(`${API_URL}/tasks/${editingTask.id}`, {
            method: 'PUT',
            headers: {
               'Content-Type': 'application/json',
               ...getAuthHeaders(),
            },
            body: JSON.stringify(data),
         });

         if (!response.ok) {
            const payload = await parseErrorPayload(response);
            if (Array.isArray(payload.details)) {
               setTaskFormErrors(payload.details);
            } else {
               addToast(payload.error ?? 'Erro ao atualizar tarefa', 'error');
            }
            return;
         }

         setIsFormOpen(false);
         setEditingTask(null);
         await fetchTasks();
         addToast('Tarefa atualizada com sucesso!', 'success');
      } catch {
         addToast('Erro ao atualizar tarefa', 'error');
      } finally {
         setIsSubmitting(false);
      }
   };

   const handleDeleteTask = async (taskId: number) => {
      if (!user || !confirm('Tem certeza que deseja deletar esta tarefa?')) return;

      try {
         const response = await fetch(`${API_URL}/tasks/${taskId}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
         });

         if (!response.ok) {
            throw new Error('Erro ao deletar tarefa');
         }

         await fetchTasks();
         addToast('Tarefa deletada com sucesso!', 'success');
      } catch {
         addToast('Erro ao deletar tarefa', 'error');
      }
   };

   const handleOpenFormForEdit = (task: Task) => {
      setEditingTask(task);
      setIsFormOpen(true);
   };

   const handleCloseForm = () => {
      setIsFormOpen(false);
      setEditingTask(null);
      setTaskFormErrors([]);
   };

   const handleFormSubmit = (data: { title: string; description: string; status: number }) => {
      if (editingTask) {
         void handleEditTask(data);
      } else {
         void handleCreateTask(data);
      }
   };

   const filteredTasks = useMemo(() => {
      if (filter === "pending") {
         return tasks.filter((task) => task.status === 0);
      }

      if (filter === "in_progress") {
         return tasks.filter((task) => task.status === 1);
      }

      if (filter === "completed") {
         return tasks.filter((task) => task.status === 2);
      }

      return tasks;
   }, [filter, tasks]);

   const totalPages = Math.ceil(filteredTasks.length / ITEMS_PAGE);
   const paginatedTasks = useMemo(() => {
      const start = (currentPage - 1) * ITEMS_PAGE;
      return filteredTasks.slice(start, start + ITEMS_PAGE);
   }, [filteredTasks, currentPage]);

   const pendingCount = tasks.filter((task) => task.status === 0).length;
   const inProgressCount = tasks.filter((task) => task.status === 1).length;
   const completedCount = tasks.filter((task) => task.status === 2).length;

   return (
      <>
         <Toast toasts={toasts} onRemove={removeToast} />
         <div className="min-h-full">
            <Navbar user={user} onLogout={handleLogout} onNewTaskClick={() => {
               setEditingTask(null);
               setIsFormOpen(true);
            }} />

            <header className="relative after:pointer-events-none after:absolute after:inset-x-0 after:inset-y-0">
               <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                  <div className="flex items-center justify-between">
                     <h1 className="text-3xl font-bold tracking-tight text-white">Lista de tarefas</h1>
                     <button
                        onClick={() => {
                           setEditingTask(null);
                           setIsFormOpen(true);
                        }}
                        className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white hover:bg-indigo-700 transition"
                     >
                        <PlusIcon className="h-5 w-5" />
                        Nova Tarefa
                     </button>
                  </div>
               </div>
            </header>

            <main>
               <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                  {error && (
                     <div className="mb-4 rounded-lg bg-red-900/30 border border-red-800 p-4 text-red-400">
                        {error}
                     </div>
                  )}

                  {/* Filtros */}
                  <div className="mb-6 flex flex-wrap gap-2">
                     <button
                        onClick={() => {
                           setFilter('pending');
                           setCurrentPage(1);
                        }}
                        className={`rounded-lg px-4 py-2 font-medium transition ${filter === 'pending'
                           ? 'bg-blue-600 text-white'
                           : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                           }`}
                     >
                        Pendente ({pendingCount})
                     </button>
                     <button
                        onClick={() => {
                           setFilter('in_progress');
                           setCurrentPage(1);
                        }}
                        className={`rounded-lg px-4 py-2 font-medium transition ${filter === 'in_progress'
                           ? 'bg-blue-600 text-white'
                           : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                           }`}
                     >
                        Em andamento ({inProgressCount})
                     </button>
                     <button
                        onClick={() => {
                           setFilter('completed');
                           setCurrentPage(1);
                        }}
                        className={`rounded-lg px-4 py-2 font-medium transition ${filter === 'completed'
                           ? 'bg-blue-600 text-white'
                           : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                           }`}
                     >
                        Completas ({completedCount})
                     </button>
                  </div>

                  {isLoading ? (
                     <div className="text-center text-gray-400">Carregando tarefas...</div>
                  ) : filteredTasks.length === 0 ? (
                     <div className="text-center py-12">
                        <p className="text-gray-400 text-lg">
                           {tasks.length === 0 ? 'Nenhuma tarefa criada ainda' : 'Nenhuma tarefa neste filtro'}
                        </p>
                     </div>
                  ) : (
                     <>
                        <div className="grid gap-4">
                           {paginatedTasks.map(task => (
                              <TaskCard
                                 key={task.id}
                                 task={task}
                                 onEdit={handleOpenFormForEdit}
                                 onDelete={handleDeleteTask}
                              />
                           ))}
                        </div>

                        {/* {totalPages > 1 && ( */}
                        <div className="mt-6 flex items-center justify-center gap-3">
                           <button
                              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                              disabled={currentPage === 1}
                              className="rounded-lg bg-gray-700 px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
                           >
                              Anterior
                           </button>
                           <span className="text-sm text-gray-400">
                              Página {currentPage} de {totalPages}
                           </span>
                           <button
                              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                              disabled={currentPage === totalPages}
                              className="rounded-lg bg-gray-700 px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
                           >
                              Próximo
                           </button>
                        </div>
                        {/* )} */}
                     </>
                  )}
               </div>
            </main>

            <TaskForm
               isOpen={isFormOpen}
               onClose={handleCloseForm}
               onSubmit={handleFormSubmit}
               editingTask={editingTask}
               isSubmitting={isSubmitting}
               errors={taskFormErrors}
            />
         </div>
      </>
   )
}

export function TodoForm() {
   const [task, setTask] = useState("");
   const [error, setError] = useState("");

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();

      if (!task.trim()) {
         setError("Informe uma tarefa antes de salvar.");
         return;
      }

      setError(""); // limpa erro quando válido
      setTask("");
   };

   return (
      <form onSubmit={handleSubmit}>
         <input
            value={task}
            onChange={(e) => {
               setTask(e.target.value);
               if (error) setError("");
            }}
            placeholder="Digite uma tarefa"
         />

         {error && <p className="text-red-500 mt-2">{error}</p>}

         <button type="submit">Adicionar</button>
      </form>
   );
}
