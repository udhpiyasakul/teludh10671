import React from 'react';
import { 
  X, 
  ShieldAlert, 
  PhoneCall, 
  Copy, 
  Check, 
  Flame, 
  Building2, 
  Layers, 
  Printer 
} from 'lucide-react';
import { EMERGENCY_NUMBERS } from '../data/constants';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCopyPhone: (phone: string, unit: string) => void;
  copiedPhone: string | null;
  onPrint: () => void;
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({
  isOpen,
  onClose,
  onCopyPhone,
  copiedPhone,
  onPrint
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-rose-300 shadow-2xl">
        
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-rose-900 via-rose-800 to-red-900 text-white px-6 py-4 flex items-center justify-between z-10 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 border border-white/30 flex items-center justify-center text-white shrink-0">
              <Flame className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500 uppercase tracking-widest">
                  Emergency Hotlines 24/7
                </span>
                <span className="text-xs text-rose-200">โรงพยาบาลอุดรธานี</span>
              </div>
              <h3 className="text-lg font-bold">สายด่วนฉุกเฉินและหน่วยงานวิกฤต</h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onPrint}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs text-white border border-white/30 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>พิมพ์</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-rose-200 hover:text-white hover:bg-rose-800/60 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content List */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {EMERGENCY_NUMBERS.map((item, index) => {
              const isCopied = copiedPhone === item.phone;

              return (
                <div
                  key={index}
                  className="bg-white p-4 rounded-xl border border-rose-200/80 hover:border-rose-400 shadow-2xs hover:shadow-xs transition-all flex items-start justify-between gap-3"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-slate-900 leading-tight">
                        {item.name}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 mb-2">
                      {item.description}
                    </p>
                    <div className="text-[10px] text-slate-500 flex items-center gap-2 flex-wrap">
                      <span className="flex items-center gap-1">
                        <Building2 className="w-3 h-3 text-slate-400" />
                        <span>{item.building}</span>
                      </span>
                      <span>•</span>
                      <span>{item.floor}</span>
                      {item.note && (
                        <span className="text-rose-700 font-semibold">({item.note})</span>
                      )}
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="font-mono text-xl font-extrabold text-rose-700 tracking-wider mb-2">
                      {item.phone}
                    </div>
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onCopyPhone(item.phone, item.name)}
                        className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                          isCopied ? 'bg-emerald-500 text-white' : 'bg-slate-50 hover:bg-rose-50 text-slate-700 border-rose-200'
                        }`}
                        title="คัดลอกเบอร์"
                      >
                        {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                      <a
                        href={`tel:${item.phone.replace(/[^0-9]/g, '')}`}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow-2xs"
                        title="โทรทันที"
                      >
                        <PhoneCall className="w-3.5 h-3.5" />
                        <span>โทร</span>
                      </a>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl cursor-pointer"
          >
            ปิดหน้าต่าง
          </button>
        </div>

      </div>
    </div>
  );
};
