import { useEffect } from 'react';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

export interface ToastMessage {
   id: string;
   type: 'success' | 'error';
   message: string;
}

interface ToastProps {
   toasts: ToastMessage[];
   onRemove: (id: string) => void;
}

export default function Toast({ toasts, onRemove }: ToastProps) {
   return (
      <div className="fixed bottom-0 right-0 z-50 p-4 space-y-3 max-w-md">
         {toasts.map((toast) => (
            <ToastItem
               key={toast.id}
               toast={toast}
               onRemove={onRemove}
            />
         ))}
      </div>
   );
}

interface ToastItemProps {
   toast: ToastMessage;
   onRemove: (id: string) => void;
}

function ToastItem({ toast, onRemove }: ToastItemProps) {
   useEffect(() => {
      const timer = setTimeout(() => {
         onRemove(toast.id);
      }, 3000);

      return () => clearTimeout(timer);
   }, [toast.id, onRemove]);

   const isDanger = toast.type === 'error';
   const bgColor = isDanger ? 'bg-red-900/90' : 'bg-green-900/90';
   const borderColor = isDanger ? 'border-red-700' : 'border-green-700';
   const textColor = isDanger ? 'text-red-200' : 'text-green-200';
   const IconComponent = isDanger ? XCircleIcon : CheckCircleIcon;
   const iconColor = isDanger ? 'text-red-400' : 'text-green-400';

   return (
      <div
         className={`flex items-center gap-3 rounded-lg border ${borderColor} ${bgColor} px-4 py-3 animate-in fade-in slide-in-from-bottom-4 duration-300`}
      >
         <IconComponent className={`h-5 w-5 flex-shrink-0 ${iconColor}`} />
         <p className={`text-sm font-medium ${textColor}`}>
            {toast.message}
         </p>
         <button
            onClick={() => onRemove(toast.id)}
            className={`cursor-pointer ml-auto text-sm font-medium ${isDanger ? 'hover:text-red-100' : 'hover:text-green-100'} transition`}
         >
            X
         </button>
      </div>
   );
}
