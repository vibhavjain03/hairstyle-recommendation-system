import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Fingerprint, History, LogIn, LogOut, User as UserIcon } from 'lucide-react';

export const Header = ({ onOpenAuth, onToggleHistory, showHistory }) => {
  const { user, logout } = useAuth();

  return (
    <header className="w-full p-4 sm:p-6 border-b border-gray-800/50 backdrop-blur-md bg-[#0f1115]/80 sticky top-0 z-40 flex justify-between items-center">
      {/* Brand */}
      <div 
        onClick={() => showHistory && onToggleHistory(false)}
        className="flex items-center gap-3 cursor-pointer group"
      >
        <div className="bg-primary/20 p-2 rounded-xl border border-primary/30 text-primary group-hover:border-primary/60 transition-colors">
          <Fingerprint className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white">
            Aesthetic<span className="text-primary">AI</span>
          </h1>
          <div className="text-[10px] text-gray-500 font-mono tracking-wider">
            FULL-STACK // DB-POWERED
          </div>
        </div>
      </div>

      {/* Auth & History Actions */}
      <div className="flex items-center gap-3">
        {user ? (
          <>
            <button
              onClick={() => onToggleHistory(!showHistory)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                showHistory
                  ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20'
                  : 'bg-gray-800/80 hover:bg-gray-700 text-gray-300 border-gray-700'
              }`}
            >
              <History className="w-4 h-4" />
              <span className="hidden sm:inline">{showHistory ? 'Scanner' : 'Scan History'}</span>
            </button>

            <div className="flex items-center gap-3 pl-3 border-l border-gray-800">
              <div className="flex items-center gap-2 text-xs font-medium text-gray-300">
                <div className="w-7 h-7 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-primary font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:inline font-semibold">{user.name}</span>
              </div>
              <button
                onClick={logout}
                title="Log out"
                className="p-2 text-gray-400 hover:text-red-400 hover:bg-gray-800 rounded-xl transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </>
        ) : (
          <button
            onClick={onOpenAuth}
            className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white text-xs font-semibold rounded-xl transition-all shadow-lg shadow-primary/20"
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In / Register</span>
          </button>
        )}
      </div>
    </header>
  );
};
