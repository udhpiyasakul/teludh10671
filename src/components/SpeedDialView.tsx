import React from 'react';
import { 
  ShieldAlert, 
  PhoneCall, 
  Copy, 
  Check, 
  Flame, 
  Building2, 
  Layers, 
  HeartHandshake, 
  Accessibility, 
  Droplet, 
  HeartPulse, 
  Video, 
  Monitor, 
  Printer 
} from 'lucide-react';
import { EMERGENCY_NUMBERS } from '../data/constants';

interface SpeedDialViewProps {
  onCopyPhone: (phone: string, unit: string) => void;
  copiedPhone: string | null;
  onPrint: () => void;
}

export const SpeedDialView: React.FC<SpeedDialViewProps> = ({
  onCopyPhone,
  copiedPhone,
  onPrint
}) => {
  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-rose-900 via-rose-800 to-red-900 text-white rounded-2xl p-4 sm:p-6 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-white/20 border border-white/30 flex items-center justify-center shrink-0">
            <Flame className="w-6 h-6 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/50 uppercase tracking-widest border border-rose-400/40">
                Hospital Emergency Speed Dial
              </span>
              <span className="text-xs text-rose-200">สายด่วนฉุกเฉิน 24 ชั่วโมง</span>
            </div>
            <h2 className="text-xl font-bold mt-0.5">ทำเนียบสายด่วนเร่งด่วน รพ.อุดรธานี</h2>
            <p className="text-xs text-rose-100/90 mt-0.5">
              รวมเบอร์โทรศัพท์แผนกฉุกเฉิน กู้ชีพ ส่งต่อ เลือด ศูนย์เปล และหน่วยงานวิกฤต
            </p>
          </div>
        </div>

        <button
          onClick={onPrint}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/30 text-xs font-semibold text-white transition-all shadow-xs cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          <span>พิมพ์แผ่นสรุปเบอร์ฉุกเฉิน</span>
        </button>
      </div>

      {/* Emergency Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
        {EMERGENCY_NUMBERS.map((item, index) => {
          const isCopied = copiedPhone === item.phone;

          return (
            <div
              key={index}
              className="bg-white rounded-xl border border-rose-200/90 hover:border-rose-400 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden"
            >
              {/* Card Top Pill */}
              <div className="p-3.5 pb-2">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
                      <ShieldAlert className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 leading-tight">
                        {item.name}
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-1 text-[11px] text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100 mt-2">
                  <div className="flex items-center gap-1.5 truncate">
                    <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{item.building}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{item.floor}</span>
                    {item.note && (
                      <span className="text-amber-700 font-medium ml-auto">
                        {item.note}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Strip */}
              <div className="p-3.5 pt-2 bg-rose-50/50 border-t border-rose-100 flex items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">เบอร์ภายใน</span>
                  <span className="font-mono text-xl font-extrabold text-rose-700 tracking-wider">
                    {item.phone}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onCopyPhone(item.phone, item.name)}
                    className={`p-2 rounded-lg border transition-all cursor-pointer ${
                      isCopied
                        ? 'bg-emerald-500 text-white border-emerald-600'
                        : 'bg-white hover:bg-rose-100 text-slate-700 border-rose-200'
                    }`}
                    title="คัดลอกเบอร์"
                  >
                    {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>

                  <a
                    href={`tel:${item.phone.replace(/[^0-9]/g, '')}`}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow-xs"
                    title={`โทรหา ${item.name}`}
                  >
                    <PhoneCall className="w-4 h-4" />
                    <span>โทรทันที</span>
                  </a>
                </div>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
};
