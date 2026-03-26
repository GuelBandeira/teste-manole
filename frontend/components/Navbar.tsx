import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { PlusIcon } from '@heroicons/react/24/outline'
import { API_URL } from '../.config';

interface User {
   id: number;
   name: string;
   email: string;
}

interface NavbarProps {
   user: User | null;
   onNewTaskClick?: () => void;
   showNewTaskButton?: boolean;
   onLogout?: () => void;
}


const userNavigation = [
   { name: 'Sair', href: '#' },
]


export default function Navbar({ user, onNewTaskClick, showNewTaskButton = true, onLogout }: NavbarProps) {
   const handleUserNavigation = async (item: string) => {
      if (item === 'Sair') {
         const token = localStorage.getItem('token');

         try {
            if (token) {
               await fetch(`${API_URL}/logout`, {
                  method: 'POST',
                  headers: {
                     Authorization: `Bearer ${token}`,
                  },
               });
            }
         } catch {
            console.error('Erro ao fazer logout');
         } finally {
            if (onLogout) {
               onLogout();
            } else {
               localStorage.removeItem('token');
               window.location.href = '/';
            }
         }
      }
   };

   return (
      <Disclosure as="nav" className="bg-gray-800/50">
         <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
               <div className="flex items-center">
                  <div className="shrink-0">
                     <img
                        alt="Your Company"
                        src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
                        className="size-8"
                     />
                  </div>
                  <div className=" md:block">
                  </div>
               </div>
               <div className=" md:block">
                  <div className="ml-4 flex items-center md:ml-6">
                     <Menu as="div" className="relative ml-3">
                        <MenuButton className="relative flex max-w-xs items-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">
                           <span className="absolute -inset-1.5" />
                           <span className="sr-only">Open user menu</span>
                           <div className="size-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-semibold">
                              {user?.name?.[0].toUpperCase()}
                           </div>
                        </MenuButton>

                        <MenuItems
                           transition
                           className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-gray-800 py-1 outline-1 -outline-offset-1 outline-white/10 transition data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
                        >
                           {userNavigation.map((item) => (
                              <MenuItem key={item.name}>
                                 <a
                                    href={item.href}
                                    onClick={(e) => {
                                       e.preventDefault();
                                       handleUserNavigation(item.name);
                                    }}
                                    className="block px-4 py-2 text-sm text-gray-300 data-focus:bg-white/5 data-focus:outline-hidden"
                                 >
                                    {item.name}
                                 </a>
                              </MenuItem>
                           ))}
                        </MenuItems>
                     </Menu>
                  </div>
               </div>
            </div>
         </div>

         <DisclosurePanel>

            <div className="border-t border-white/10 pt-4 pb-3">
               <div className="flex items-center px-5">
                  <div className="shrink-0">
                     <div className="size-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-semibold">
                        {user?.name?.[0].toUpperCase()}
                     </div>
                  </div>
                  <div className="ml-3">
                     <div className="text-base/5 font-medium text-white">{user?.name}</div>
                     <div className="text-sm font-medium text-gray-400">{user?.email}</div>
                  </div>
               </div>
               <div className="mt-3 space-y-1 px-2">
                  {userNavigation.map((item) => (
                     <DisclosureButton
                        key={item.name}
                        as="a"
                        href={item.href}
                        onClick={(e) => {
                           e.preventDefault();
                           handleUserNavigation(item.name);
                        }}
                        className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-white/5 hover:text-white"
                     >
                        {item.name}
                     </DisclosureButton>
                  ))}
               </div>
               {showNewTaskButton && (
                  <div className="mt-4 border-t border-white/10 pt-4">
                     <button
                        onClick={onNewTaskClick}
                        className="w-full flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white hover:bg-indigo-700 transition"
                     >
                        <PlusIcon className="h-5 w-5" />
                        Nova Tarefa
                     </button>
                  </div>
               )}
            </div>
         </DisclosurePanel>
      </Disclosure>
   );
}
