import React from 'react';
import { Logo } from './Logo';
import { Plus, Sparkles, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface NavbarProps {
  onOpenAIModal: () => void;
  onCreateNew: () => void;
  activeView: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAIModal, onCreateNew, activeView }) => {
  const router = useRouter();

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between bg-white/90 px-4 md:px-8 border-b border-slate-200/80 backdrop-blur-md shadow-xs">
      {/* Brand Logo & Personal Name */}
      <div className="flex items-center gap-4">
        <Logo size="md" />
      </div>

      {/* Right Quick Actions */}
      <div className="flex items-center gap-3">
        {/* Quick AI Invoice Button */}
        <button
          onClick={onOpenAIModal}
          className="flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 px-3.5 py-2 text-xs font-semibold text-white shadow-sm shadow-indigo-200 transition active:scale-95 cursor-pointer"
        >
          <Sparkles className="h-4 w-4" />
          <span className="hidden sm:inline">توليد ذكي</span>
        </button>

        {/* Create Manual Button */}
        <button
          onClick={onCreateNew}
          className="flex items-center gap-2 rounded-xl bg-slate-900 hover:bg-slate-800 px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition active:scale-95 cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">فاتورة جديدة</span>
        </button>

        {/* Personal Email badge */}
        <div className="hidden lg:flex items-center gap-2 rounded-xl bg-slate-100 px-3 py-1.5 border border-slate-200 text-xs">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-mono text-slate-700 font-medium">info@zakariaelahbabi.com</span>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          title="تسجيل الخروج"
          className="flex items-center gap-1.5 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 transition active:scale-95 cursor-pointer"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">خروج</span>
        </button>
      </div>
    </header>
  );
};
