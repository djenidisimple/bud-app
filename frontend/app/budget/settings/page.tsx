'use client'

import { Settings, Settings2Icon } from 'lucide-react';
import { useRouter } from 'next/navigation';

const UserPlusIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v2h-2a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" />
  </svg>
);

export default function ManageUsersMenu() {
  const router = useRouter();

  const handleNavigateToRegister = () => {
    router.push(window.location.pathname + '/register');
  };

  return (
    <>
      <div className="m-4">
        <h1 className="text-2xl font-bold mt-2 ml-2 mb-5">
            <Settings 
                className='inline-block animate-spin' 
                size={32}
                style={{ animationDuration: '4s' }}
            />  Gestion des comptes
        </h1>
        <p className="text-gray-500 text-sm ml-2">
          Gérez l&apos;accès et les inscriptions des utilisateurs.
        </p>
      </div>

      <div className="mt-4 mb-5 h-[4px] bg-gradient-to-r from-transparent via-blue-200 to-transparent" />

      <div className="m-2 p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
        <h2 className="text-lg font-semibold mb-2 text-gray-800">
            <Settings2Icon className='inline-block' fill='blue'/>
            Ajouter un nouvel utilisateur
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          Créez un nouveau compte pour permettre à quelqu&apos;un de se connecter.
        </p>
        <div className="flex justify-start">
          <button
            onClick={handleNavigateToRegister}
            className="flex items-center space-x-2 px-5 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            <UserPlusIcon />
            <span>Ajouter un utilisateur</span>
          </button>
        </div>
      </div>
    </>
  );
}