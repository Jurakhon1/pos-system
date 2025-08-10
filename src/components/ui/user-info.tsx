"use client";

import { useAuth } from "@/shared/hooks/use-auth";

export function UserInfo() {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <div className="p-4 border-t border-gray-200">
      <div className="flex items-center space-x-3">
        <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center">
          <span className="text-sm font-medium text-white">
            {user.name.charAt(0).toUpperCase()}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">
            {user.name}
          </p>
          <p className="text-xs text-gray-500 truncate">
            {user.email}
          </p>
        </div>
        <button
          onClick={logout}
          className="text-gray-400 hover:text-gray-600"
          title="Выйти"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </button>
      </div>
    </div>
  );
}
