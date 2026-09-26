import React, { useState } from 'react';
import { 
  Phone, 
  Copy, 
  Check, 
  Star, 
  PhoneCall, 
  Building2, 
  Layers, 
  Tag, 
  Info,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { UDHPhoneRecord } from '../types';
import { BUILDING_COLORS } from '../data/constants';
import { getCallablePhoneHref, getDialTooltip } from '../utils/phoneUtils';

interface GridViewProps {
  records: UDHPhoneRecord[];
  favorites: Set<number>;
  onToggleFavorite: (id: number) => void;
  onCopyPhone: (phone: string, unit: string) => void;
  copiedPhone: string | null;
  searchQuery: string;
}

export const GridView: React.FC<GridViewProps> = ({
  records,
  favorites,
  onToggleFavorite,
  onCopyPhone,
  copiedPhone,
  searchQuery
}) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 48;

  const totalPages = Math.ceil(records.length / pageSize);
  const displayedRecords = records.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 300, behavior: 'smooth' });
    }
  };

  const highlightText = (text: string) => {
    if (!searchQuery.trim()) return text;
    const regex = new RegExp(`(${searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, i) => 
      regex.test(part) ? (
        <mark key={i} className="bg-amber-200 text-slate-900 rounded-xs px-0.5 font-semibold">
          {part}
        </mark>
      ) : part
    );
  };

  if (records.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto mb-3">
          <Phone className="w-8 h-8" />
        </div>
        <h3 className="text-base font-bold text-slate-800 mb-1">ไม่พบหมายเลขโทรศัพท์</h3>
        <p className="text-xs text-slate-500">กรุณาลองเปลี่ยนคำค้นหาหรือตัวกรอง</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
        {displayedRecords.map((item) => {
          const isFavorite = favorites.has(item.id);
          const buildingStyle = BUILDING_COLORS[item.building] || {
            bg: 'bg-slate-50',
            text: 'text-slate-900',
            border: 'border-slate-200',
            badge: 'bg-slate-100 text-slate-800 border-slate-200',
            accent: '#64748b'
          };
          const isCopied = copiedPhone === item.phone;

          return (
            <div
              key={item.id}
              className="bg-white rounded-xl border border-slate-200/90 hover:border-teal-400/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
            >
              {/* Card Header: Building & Floor Bar */}
              <div className={`px-3.5 py-2 border-b flex items-center justify-between gap-2 ${buildingStyle.bg} ${buildingStyle.border}`}>
                <div className="flex items-center gap-1.5 min-w-0">
                  <Building2 className="w-3.5 h-3.5 shrink-0 text-slate-600" />
                  <span className="text-[11px] font-semibold truncate text-slate-800">
                    {item.building}
                  </span>
                </div>
                <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-white/80 border border-slate-200 text-slate-700 shrink-0">
                  {item.floor}
                </span>
              </div>

              {/* Card Body */}
              <div className="p-3.5 space-y-2.5 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-sm font-bold text-slate-900 leading-snug line-clamp-2">
                    {highlightText(item.unit)}
                  </h4>
                  <button
                    onClick={() => onToggleFavorite(item.id)}
                    className="text-slate-300 hover:text-amber-500 transition-colors shrink-0 p-0.5 cursor-pointer"
                    title={isFavorite ? 'ลบออกจากเบอร์โปรด' : 'ติดดาวเบอร์โปรด'}
                  >
                    <Star className={`w-4 h-4 ${isFavorite ? 'text-amber-400 fill-amber-400' : ''}`} />
                  </button>
                </div>

                {item.category && item.category !== 'ทั่วไป' && (
                  <div className="flex items-center gap-1 text-[11px] text-slate-500">
                    <Tag className="w-3 h-3 text-slate-400 shrink-0" />
                    <span className="truncate">{highlightText(item.category)}</span>
                  </div>
                )}

                {item.note && (
                  <div className="text-[11px] text-amber-800 bg-amber-50/80 border border-amber-200/70 rounded-md px-2 py-0.5 inline-block">
                    หมายเหตุ: {highlightText(item.note)}
                  </div>
                )}
              </div>

              {/* Card Footer: Big Phone Number & Actions */}
              <div className="px-3.5 py-2.5 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-2">
                <div className="flex items-baseline gap-1.5">
                  <span className="font-mono text-base font-bold text-teal-800 tracking-wider">
                    {highlightText(item.phone)}
                  </span>
                  <span className="text-[9px] text-slate-400 font-medium">
                    #{item.id}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onCopyPhone(item.phone, item.unit)}
                    className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                      isCopied
                        ? 'bg-emerald-500 text-white border-emerald-600'
                        : 'bg-white hover:bg-slate-100 text-slate-600 border-slate-200'
                    }`}
                    title="คัดลอกหมายเลข"
                  >
                    {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>

                  <a
                    href={getCallablePhoneHref(item.phone)}
                    className="p-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white transition-all shadow-2xs"
                    title={getDialTooltip(item.phone, item.unit)}
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="bg-white rounded-xl border border-slate-200 p-3 flex items-center justify-between gap-3 text-xs">
          <span className="text-slate-500">
            หน้า {currentPage} จาก {totalPages} ({records.length} รายการ)
          </span>

          <div className="flex items-center gap-1">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
