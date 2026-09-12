import React from 'react';
import { Check, Copy } from 'lucide-react';

interface ToastProps {
  message: string | null;
  phone: string | null;
}

export const Toast: React.FC<ToastProps> = ({ message, phone }) => {
  if (!message) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-slate-900 text-white rounded-xl shadow-2xl border border-slate-700 animate-in slide-in-from-bottom-5 duration-200">
      <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
        <Check className="w-4 h-4" />
      </div>
      <div>
        <div className="text-xs font-semibold flex items-center gap-1.5">
          <span>คัดลอกสำเร็จ:</span>
          <span className="font-mono text-emerald-400 font-bold">{phone}</span>
        </div>
        <p className="text-[11px] text-slate-300 truncate max-w-xs">{message}</p>
      </div>
    </div>
  );
};
