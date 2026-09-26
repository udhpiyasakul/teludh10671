import React, { useState } from 'react';
import { 
  X, 
  Phone, 
  Building2, 
  Layers, 
  Delete, 
  Copy, 
  Check, 
  PhoneCall,
  Search
} from 'lucide-react';
import { UDHPhoneRecord } from '../types';
import { BUILDING_COLORS } from '../data/constants';
import { getCallablePhoneHref, getDialTooltip } from '../utils/phoneUtils';

interface QuickLookupModalProps {
  isOpen: boolean;
  onClose: () => void;
  records: UDHPhoneRecord[];
  onCopyPhone: (phone: string, unit: string) => void;
  copiedPhone: string | null;
}

export const QuickLookupModal: React.FC<QuickLookupModalProps> = ({
  isOpen,
  onClose,
  records,
  onCopyPhone,
  copiedPhone
}) => {
  const [dialedDigits, setDialedDigits] = useState<string>('');

  if (!isOpen) return null;

  const handleDigitClick = (digit: string) => {
    if (dialedDigits.length < 10) {
      setDialedDigits(prev => prev + digit);
    }
  };

  const handleBackspace = () => {
    setDialedDigits(prev => prev.slice(0, -1));
  };

  const handleClear = () => {
    setDialedDigits('');
  };

  // Find matched records
  const matchedRecords = dialedDigits.trim() 
    ? records.filter(r => r.phone.replace(/[^0-9]/g, '').includes(dialedDigits.replace(/[^0-9]/g, '')) || r.unit.toLowerCase().includes(dialedDigits.toLowerCase()))
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden border border-slate-200 shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-5 py-3.5 bg-gradient-to-r from-teal-900 to-cyan-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-teal-500/20 text-teal-300">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold">ค้นหาด่วนด้วยหมายเลข (Reverse Dialpad)</h3>
              <p className="text-[11px] text-teal-200">กดเลข 4 หลักเพื่อดูว่าเป็นเบอร์ของห้องใด</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-teal-200 hover:text-white hover:bg-teal-800/60 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dialed Display */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex-1 text-center">
            <div className="text-xs text-slate-400 font-medium mb-1">พิมพ์หรือกดหมายเลขโทรศัพท์ 4 หลัก</div>
            <input
              type="text"
              autoFocus
              value={dialedDigits}
              onChange={(e) => setDialedDigits(e.target.value.replace(/[^0-9]/g, '').slice(0, 10))}
              placeholder="กดตัวเลข เช่น 3124..."
              className="w-full text-center font-mono text-3xl font-extrabold text-teal-900 tracking-widest bg-transparent focus:outline-none placeholder:text-slate-300 placeholder:text-xl placeholder:font-normal"
            />
          </div>
          {dialedDigits && (
            <button
              onClick={handleBackspace}
              className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 cursor-pointer shrink-0"
              title="ลบตัวเลข"
            >
              <Delete className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Keypad Grid */}
        <div className="p-4 grid grid-cols-3 gap-2 bg-white border-b border-slate-100">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', '⌫'].map((btn) => {
            if (btn === 'C') {
              return (
                <button
                  key={btn}
                  onClick={handleClear}
                  className="py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-sm transition-all cursor-pointer"
                >
                  ล้าง (C)
                </button>
              );
            }
            if (btn === '⌫') {
              return (
                <button
                  key={btn}
                  onClick={handleBackspace}
                  className="py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-sm transition-all flex items-center justify-center cursor-pointer"
                >
                  <Delete className="w-4 h-4" />
                </button>
              );
            }
            return (
              <button
                key={btn}
                onClick={() => handleDigitClick(btn)}
                className="py-2.5 rounded-xl bg-slate-50 hover:bg-teal-50 hover:border-teal-300 active:scale-95 border border-slate-200 text-slate-800 font-mono font-bold text-lg shadow-2xs transition-all cursor-pointer"
              >
                {btn}
              </button>
            );
          })}
        </div>

        {/* Quick Main & Operator Shortcuts */}
        <div className="px-4 py-2 bg-slate-50 border-b border-slate-200 flex items-center gap-1.5 flex-wrap text-xs">
          <span className="text-[11px] font-semibold text-slate-500">ทางลัด:</span>
          <button
            onClick={() => setDialedDigits('042215100')}
            className="px-2 py-0.5 rounded bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 font-mono text-[11px] cursor-pointer"
          >
            042-215100
          </button>
          <button
            onClick={() => setDialedDigits('042245555')}
            className="px-2 py-0.5 rounded bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 font-mono text-[11px] cursor-pointer"
          >
            042-245555
          </button>
          <button
            onClick={() => setDialedDigits('0')}
            className="px-2 py-0.5 rounded bg-cyan-50 hover:bg-cyan-100 text-cyan-800 border border-cyan-200 font-mono text-[11px] cursor-pointer"
          >
            Operator (0)
          </button>
          <button
            onClick={() => setDialedDigits('1000')}
            className="px-2 py-0.5 rounded bg-cyan-50 hover:bg-cyan-100 text-cyan-800 border border-cyan-200 font-mono text-[11px] cursor-pointer"
          >
            1000
          </button>
          <button
            onClick={() => setDialedDigits('1001')}
            className="px-2 py-0.5 rounded bg-cyan-50 hover:bg-cyan-100 text-cyan-800 border border-cyan-200 font-mono text-[11px] cursor-pointer"
          >
            1001
          </button>
          <button
            onClick={() => setDialedDigits('1002')}
            className="px-2 py-0.5 rounded bg-cyan-50 hover:bg-cyan-100 text-cyan-800 border border-cyan-200 font-mono text-[11px] cursor-pointer"
          >
            1002
          </button>
        </div>

        {/* Matched Results List */}
        <div className="p-4 flex-1 overflow-y-auto max-h-60 space-y-2 bg-slate-50/50">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
            <span>ผลการค้นหา {dialedDigits ? `(${matchedRecords.length} รายการ)` : ''}</span>
            {dialedDigits && (
              <span className="text-teal-700 font-medium">มีเลข &ldquo;{dialedDigits}&rdquo;</span>
            )}
          </div>

          {dialedDigits ? (
            matchedRecords.length > 0 ? (
              matchedRecords.map(item => {
                const isCopied = copiedPhone === item.phone;
                const buildingStyle = BUILDING_COLORS[item.building] || {
                  badge: 'bg-slate-100 text-slate-800'
                };

                return (
                  <div
                    key={item.id}
                    className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-slate-900 text-xs truncate">
                        {item.unit}
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5 truncate">
                        <Building2 className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="truncate">{item.building}</span>
                        <span className="text-slate-300">•</span>
                        <span>{item.floor}</span>
                      </div>
                      {item.note && (
                        <span className="text-[10px] text-amber-700 font-medium mt-0.5 inline-block">
                          หมายเหตุ: {item.note}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="font-mono text-sm font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                        {item.phone}
                      </span>
                      <button
                        onClick={() => onCopyPhone(item.phone, item.unit)}
                        className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                          isCopied ? 'bg-emerald-500 text-white' : 'bg-slate-50 hover:bg-slate-100 text-slate-600'
                        }`}
                        title="คัดลอก"
                      >
                        {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                      <a
                        href={getCallablePhoneHref(item.phone)}
                        className="p-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white"
                        title={getDialTooltip(item.phone, item.unit)}
                      >
                        <PhoneCall className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-6 text-slate-400 text-xs">
                ไม่พบหน่วยงานที่ตรงกับหมายเลขนี้
              </div>
            )
          ) : (
            <div className="text-center py-6 text-slate-400 text-xs">
              กรุณากดหมายเลข 4 หลักเพื่อค้นหาห้องและหน่วยงาน
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-2.5 bg-slate-100 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg cursor-pointer"
          >
            ปิด
          </button>
        </div>

      </div>
    </div>
  );
};
