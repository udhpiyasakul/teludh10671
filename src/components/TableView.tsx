import React, { useState } from 'react';
import { 
  Phone, 
  Copy, 
  Check, 
  Star, 
  PhoneCall, 
  Building2, 
  Layers, 
  ExternalLink,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { UDHPhoneRecord } from '../types';
import { BUILDING_COLORS } from '../data/constants';

interface TableViewProps {
  records: UDHPhoneRecord[];
  favorites: Set<number>;
  onToggleFavorite: (id: number) => void;
  onCopyPhone: (phone: string, unit: string) => void;
  copiedPhone: string | null;
  searchQuery: string;
}

export const TableView: React.FC<TableViewProps> = ({
  records,
  favorites,
  onToggleFavorite,
  onCopyPhone,
  copiedPhone,
  searchQuery
}) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(50);

  // Pagination calculations
  const totalPages = pageSize === -1 ? 1 : Math.ceil(records.length / pageSize);
  const displayedRecords = pageSize === -1 
    ? records 
    : records.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 300, behavior: 'smooth' });
    }
  };

  // Helper to highlight matching search query
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
        <h3 className="text-base font-bold text-slate-800 mb-1">ไม่พบหมายเลขโทรศัพท์ที่ตรงกับเงื่อนไข</h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          กรุณาลองเปลี่ยนคำค้นหา ปรับตัวกรองอาคาร/ชั้น หรือกด &ldquo;ล้างตัวกรองทั้งหมด&rdquo; เพื่อแสดงข้อมูลทั้งหมด
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
      
      {/* Table Header Controls */}
      <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="text-slate-600 font-medium">
          แสดงรายการที่ <span className="font-semibold text-slate-900">{records.length > 0 ? (currentPage - 1) * (pageSize === -1 ? records.length : pageSize) + 1 : 0}</span> ถึง <span className="font-semibold text-slate-900">{pageSize === -1 ? records.length : Math.min(currentPage * pageSize, records.length)}</span> จากทั้งหมด <span className="font-semibold text-teal-800">{records.length}</span> รายการ
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-500">แสดงหน้าละ:</span>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="px-2 py-1 bg-white border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-teal-500"
          >
            <option value={25}>25 รายการ</option>
            <option value={50}>50 รายการ</option>
            <option value={100}>100 รายการ</option>
            <option value={-1}>ทั้งหมด ({records.length})</option>
          </select>
        </div>
      </div>

      {/* Main Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-100/70 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
              <th className="py-3 px-3 text-center w-12">#</th>
              <th className="py-3 px-2 text-center w-10">ดาว</th>
              <th className="py-3 px-4 min-w-[200px]">หน่วยงาน / ชื่อห้อง</th>
              <th className="py-3 px-4 min-w-[140px]">หมายเลขโทรศัพท์</th>
              <th className="py-3 px-4 min-w-[170px]">อาคาร</th>
              <th className="py-3 px-3 min-w-[100px]">ชั้น</th>
              <th className="py-3 px-3 min-w-[140px]">กลุ่มงาน / หมวดหมู่</th>
              <th className="py-3 px-3 min-w-[120px]">หมายเหตุ</th>
              <th className="py-3 px-3 text-center w-24">การดำเนินการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {displayedRecords.map((item, idx) => {
              const isFavorite = favorites.has(item.id);
              const buildingStyle = BUILDING_COLORS[item.building] || {
                badge: 'bg-slate-100 text-slate-800 border-slate-200'
              };
              const isCopied = copiedPhone === item.phone;

              return (
                <tr 
                  key={item.id} 
                  className="hover:bg-teal-50/40 transition-colors group"
                >
                  {/* # Index */}
                  <td className="py-2.5 px-3 text-center font-mono text-slate-400 text-[11px]">
                    {item.id}
                  </td>

                  {/* Favorite Toggle */}
                  <td className="py-2.5 px-2 text-center">
                    <button
                      onClick={() => onToggleFavorite(item.id)}
                      className="p-1 text-slate-300 hover:text-amber-500 transition-colors cursor-pointer"
                      title={isFavorite ? 'ลบออกจากรายการโปรด' : 'บันทึกเป็นเบอร์โปรด'}
                    >
                      <Star className={`w-4 h-4 ${isFavorite ? 'text-amber-400 fill-amber-400' : ''}`} />
                    </button>
                  </td>

                  {/* Unit Name */}
                  <td className="py-2.5 px-4">
                    <div className="font-semibold text-slate-800 text-[13px]">
                      {highlightText(item.unit)}
                    </div>
                    {item.tags.length > 0 && (
                      <div className="flex gap-1 mt-0.5 flex-wrap">
                        {item.tags.map((t, ti) => (
                          <span key={ti} className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-medium">
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </td>

                  {/* Phone Number */}
                  <td className="py-2.5 px-4">
                    <div className="inline-flex items-center gap-2">
                      <span className="font-mono text-sm font-bold text-teal-800 tracking-wide bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200/80">
                        {highlightText(item.phone)}
                      </span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                        item.phoneType === 'เบอร์สายนอก' 
                          ? 'bg-purple-100 text-purple-800 border border-purple-200' 
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}>
                        {item.phoneType}
                      </span>
                    </div>
                  </td>

                  {/* Building */}
                  <td className="py-2.5 px-4">
                    <span className={`inline-block px-2 py-0.5 rounded-md text-[11px] font-medium border ${buildingStyle.badge}`}>
                      {highlightText(item.building)}
                    </span>
                  </td>

                  {/* Floor */}
                  <td className="py-2.5 px-3">
                    <span className="inline-flex items-center gap-1 text-slate-700 font-medium">
                      <Layers className="w-3 h-3 text-slate-400" />
                      <span>{highlightText(item.floor)}</span>
                    </span>
                  </td>

                  {/* Category */}
                  <td className="py-2.5 px-3 text-slate-600 text-[11px]">
                    {item.category === 'ทั่วไป' ? (
                      <span className="text-slate-400">-</span>
                    ) : (
                      highlightText(item.category)
                    )}
                  </td>

                  {/* Note */}
                  <td className="py-2.5 px-3 text-slate-600 text-[11px]">
                    {item.note ? (
                      <span className="inline-block px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200/60 font-medium">
                        {highlightText(item.note)}
                      </span>
                    ) : (
                      <span className="text-slate-300">-</span>
                    )}
                  </td>

                  {/* Action Buttons */}
                  <td className="py-2.5 px-3 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      {/* Copy Button */}
                      <button
                        onClick={() => onCopyPhone(item.phone, item.unit)}
                        className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                          isCopied
                            ? 'bg-emerald-500 text-white border-emerald-600'
                            : 'bg-white hover:bg-slate-100 text-slate-600 border-slate-200'
                        }`}
                        title="คัดลอกหมายเลขโทรศัพท์"
                      >
                        {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>

                      {/* Call Button */}
                      <a
                        href={`tel:${item.phone.replace(/[^0-9]/g, '')}`}
                        className="p-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white transition-all shadow-2xs"
                        title={`โทรออกหมายเลข ${item.phone}`}
                      >
                        <PhoneCall className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </td>

                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Bar */}
      {pageSize !== -1 && totalPages > 1 && (
        <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3 text-xs">
          <span className="text-slate-500">
            หน้า <span className="font-semibold text-slate-800">{currentPage}</span> จาก <span className="font-semibold text-slate-800">{totalPages}</span>
          </span>

          <div className="flex items-center gap-1">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Quick Page Jump */}
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum = currentPage - 2 + i;
              if (currentPage < 3) pageNum = i + 1;
              if (currentPage > totalPages - 2) pageNum = totalPages - 4 + i;
              if (pageNum < 1 || pageNum > totalPages) return null;

              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`w-7 h-7 rounded-lg text-xs font-semibold cursor-pointer ${
                    currentPage === pageNum
                      ? 'bg-teal-700 text-white'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

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
