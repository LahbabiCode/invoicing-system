import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = 'md', showText = true }) => {
  const iconSizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className={`relative flex items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-700 via-indigo-600 to-blue-500 font-extrabold text-white shadow-md shadow-indigo-600/20 ring-1 ring-indigo-500/30 ${iconSizes[size]}`}>
        <span className="tracking-tight font-black">ZL</span>
        <div className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-white">
          <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
        </div>
      </div>
      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-slate-900 tracking-tight text-lg font-sans">
              Zakariae Lahbabi
            </span>
            <span className="rounded bg-indigo-50 px-1.5 py-0.5 text-[10px] font-bold text-indigo-600 border border-indigo-100">
              PRO
            </span>
          </div>
          <span className="text-xs text-slate-500 font-medium tracking-wide">
            AI Invoicing & Billing Engine
          </span>
        </div>
      )}
    </div>
  );
};
