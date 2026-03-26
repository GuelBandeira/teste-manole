import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

interface Task {
   id: number;
   title: string;
   description: string;
   status: number;
   user_id: number;
   created_at: string;
   updated_at: string;
}

interface TaskCardProps {
   task: Task;
   onEdit: (task: Task) => void;
   onDelete: (taskId: number) => void;
}



export default function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
   const isCompleted = task.status === 2;

   return (
      <div className="rounded-lg border p-4 border-white/10 bg-white/5">
         <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
               <div className="flex items-center gap-3">
                  <h3 className={`text-lg font-semibold ${isCompleted ? 'line-through text-gray-500' : 'text-white'}`}>
                     {task.title}
                  </h3>
               </div>
               {task.description && (
                  <p className={`mt-2 text-sm ${isCompleted ? 'text-gray-600' : 'text-gray-400'}`}>
                     {task.description}
                  </p>
               )}
               <p className="mt-2 text-xs text-gray-500">
                  Criada em {new Date(task.created_at).toLocaleDateString('pt-BR')}
               </p>
            </div>

            <div className="flex gap-2">
               <button
                  onClick={() => onEdit(task)}
                  className="rounded-lg bg-blue-600/20 p-2 hover:bg-blue-600/30 text-blue-400 transition"
                  title="Editar"
               >
                  <PencilIcon className="h-5 w-5" />
               </button>
               <button
                  onClick={() => onDelete(task.id)}
                  className="rounded-lg bg-red-600/20 p-2 hover:bg-red-600/30 text-red-400 transition"
                  title="Deletar"
               >
                  <TrashIcon className="h-5 w-5" />
               </button>
            </div>
         </div>
      </div>
   );
}
