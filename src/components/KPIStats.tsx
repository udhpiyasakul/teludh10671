import React from 'react';
import { 
  Phone, 
  Building2, 
  CheckCircle2, 
  Star, 
  PhoneCall, 
  Layers, 
  AlertTriangle,
  ArrowRight,
  Flame,
  PhoneForwarded,
  Accessibility,
  Droplet
} from 'lucide-react';
import { getCallablePhoneHref, getDialTooltip } from '../utils/phoneUtils';

interface KPIStatsProps {
  totalRecords: number;
  filteredCount: number;
  totalBuildings: number;
  internalCount: number;
  externalCount: number;
  favoriteCount: number;
  onlyFavorites: boolean;
  onToggleFavorites: () => void;
  onSelectQuickTag: (tag: string) => void;
  onCallNumber: (phone: string, unit: string) => void;
}

export const KPIStats: React.FC<KPIStatsProps> = ({
  totalRecords,
  filteredCount,
  totalBuildings,
  internalCount,
  externalCount,
  favoriteCount,
  onlyFavorites,
  onToggleFavorites,
  onSelectQuickTag,
  onCallNumber
}) => {
  return (
    <div className="space-y-3">
      {/* Main Hospital Numbers & Operator Banner */}
      <div className="bg-gradient-to-r from-teal-900 via-teal-800 to-cyan-900 text-white rounded-xl p-3 shadow-xs flex flex-wrap items-center justify-between gap-3 border border-teal-700/60">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-teal-500/30 border border-teal-400/40 flex items-center justify-center text-teal-300 shrink-0">
            <Phone className="w-4 h-4 text-amber-300" />
          </div>
          <div>
            <div className="text-xs font-bold text-white flex items-center gap-2">
              <span>เบอร์หลัก รพ.อุดรธานี</span>
              <span className="text-[10px] px-2 py-0.2 rounded bg-amber-400/30 text-amber-200 border border-amber-300/30 font-semibold">
                สายหลักโรงพยาบาล
              </span>
            </div>
            <p className="text-[11px] text-teal-200/90 hidden sm:block">
              ติดต่อสอบถามข้อมูลทั่วไป หรือแจ้งต่อสายแผนกต่าง ๆ
            </p>
          </div>
        </div>

        {/* Action Buttons for Main Lines and Operator */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Main Line 1 */}
          <div className="flex items-center gap-1 bg-teal-950/70 border border-teal-500/40 px-2.5 py-1 rounded-lg">
            <span className="text-[11px] text-teal-300 font-medium">สาย 1:</span>
            <button
              onClick={() => onCallNumber('042-215100', 'เบอร์หลัก รพ.อุดรธานี')}
              className="font-mono text-xs sm:text-sm font-bold text-amber-300 hover:text-white transition-colors cursor-pointer"
              title="คลิกเพื่อคัดลอก/โทร 042-215100"
            >
              042-215100
            </button>
            <a
              href="tel:042215100"
              className="p-1 text-teal-300 hover:text-white"
              title="โทรออก"
            >
              <PhoneCall className="w-3 h-3" />
            </a>
          </div>

          {/* Main Line 2 */}
          <div className="flex items-center gap-1 bg-teal-950/70 border border-teal-500/40 px-2.5 py-1 rounded-lg">
            <span className="text-[11px] text-teal-300 font-medium">สาย 2:</span>
            <button
              onClick={() => onCallNumber('042-245555', 'เบอร์หลัก รพ.อุดรธานี')}
              className="font-mono text-xs sm:text-sm font-bold text-amber-300 hover:text-white transition-colors cursor-pointer"
              title="คลิกเพื่อคัดลอก/โทร 042-245555"
            >
              042-245555
            </button>
            <a
              href="tel:042245555"
              className="p-1 text-teal-300 hover:text-white"
              title="โทรออก"
            >
              <PhoneCall className="w-3 h-3" />
            </a>
          </div>

          {/* Operator Pills */}
          <div className="flex items-center gap-1.5 bg-cyan-950/70 border border-cyan-500/40 px-2.5 py-1 rounded-lg text-xs">
            <span className="text-[11px] text-cyan-200 font-semibold">Operator:</span>
            {['0', '1000', '1001', '1002'].map((ext) => (
              <div key={ext} className="flex items-center bg-cyan-800/80 rounded overflow-hidden">
                <button
                  onClick={() => onCallNumber(ext, `โอเปอเรเตอร์ ประชาสัมพันธ์ (${ext})`)}
                  className="px-1.5 py-0.5 hover:bg-cyan-700 text-cyan-100 font-mono font-bold text-xs transition-colors cursor-pointer"
                  title={`โอเปอเรเตอร์ กด ${ext} (คลิกเพื่อคัดลอก)`}
                >
                  {ext}
                </button>
                <a
                  href={getCallablePhoneHref(ext)}
                  className="p-1 hover:bg-cyan-600 text-cyan-200 hover:text-white border-l border-cyan-700/60"
                  title={getDialTooltip(ext, `โอเปอเรเตอร์ (${ext})`)}
                >
                  <PhoneCall className="w-2.5 h-2.5" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Emergency Strip */}
      <div className="bg-rose-50 border border-rose-200/80 rounded-xl p-3 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-rose-600 flex items-center justify-center text-white shrink-0 shadow-xs">
            <Flame className="w-4 h-4 animate-bounce" />
          </div>
          <div>
            <div className="text-xs font-bold text-rose-900 flex items-center gap-1.5">
              <span>สายด่วนฉุกเฉินประจำโรงพยาบาล</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-rose-200 text-rose-800 font-semibold">24 ชั่วโมง</span>
            </div>
            <p className="text-[11px] text-rose-700 hidden sm:block">
              กดปุ่มโทรตรงเพื่อโทรออก หรือคลิกเพื่อคัดลอกหมายเลขเร่งด่วน
            </p>
          </div>
        </div>

        {/* Rapid Dial Pills */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* 3124 */}
          <div className="flex items-center bg-white border border-rose-300 rounded-lg overflow-hidden shadow-2xs">
            <button
              onClick={() => onCallNumber('3124', 'ศูนย์สั่งการ กู้ชีพ 1669')}
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-rose-700 hover:bg-rose-50 font-medium transition-colors cursor-pointer"
              title="คัดลอกเบอร์ กู้ชีพ 1669 (3124)"
            >
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              <span className="font-semibold">กู้ชีพ 1669:</span>
              <span className="font-mono font-bold text-rose-800">3124</span>
            </button>
            <a
              href={getCallablePhoneHref('3124')}
              className="p-1.5 bg-rose-100 hover:bg-rose-200 text-rose-700 border-l border-rose-200"
              title={getDialTooltip('3124', 'ศูนย์สั่งการ กู้ชีพ 1669')}
            >
              <PhoneCall className="w-3 h-3" />
            </a>
          </div>

          {/* 3115 */}
          <div className="flex items-center bg-white border border-rose-300 rounded-lg overflow-hidden shadow-2xs">
            <button
              onClick={() => onCallNumber('3115', 'ศูนย์ส่งต่อ REFER')}
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-rose-700 hover:bg-rose-50 font-medium transition-colors cursor-pointer"
              title="คัดลอกเบอร์ REFER (3115)"
            >
              <PhoneForwarded className="w-3 h-3 text-rose-600" />
              <span className="font-semibold">REFER:</span>
              <span className="font-mono font-bold text-rose-800">3115</span>
            </button>
            <a
              href={getCallablePhoneHref('3115')}
              className="p-1.5 bg-rose-100 hover:bg-rose-200 text-rose-700 border-l border-rose-200"
              title={getDialTooltip('3115', 'ศูนย์ส่งต่อ REFER')}
            >
              <PhoneCall className="w-3 h-3" />
            </a>
          </div>

          {/* 1135 */}
          <div className="flex items-center bg-white border border-amber-300 rounded-lg overflow-hidden shadow-2xs">
            <button
              onClick={() => onCallNumber('1135', 'ศูนย์เปล')}
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-amber-800 hover:bg-amber-50 font-medium transition-colors cursor-pointer"
              title="คัดลอกเบอร์ ศูนย์เปล (1135)"
            >
              <Accessibility className="w-3 h-3 text-amber-600" />
              <span className="font-semibold">ศูนย์เปล:</span>
              <span className="font-mono font-bold text-amber-900">1135</span>
            </button>
            <a
              href={getCallablePhoneHref('1135')}
              className="p-1.5 bg-amber-100 hover:bg-amber-200 text-amber-800 border-l border-amber-200"
              title={getDialTooltip('1135', 'ศูนย์เปล')}
            >
              <PhoneCall className="w-3 h-3" />
            </a>
          </div>

          {/* 1251 */}
          <div className="flex items-center bg-white border border-red-300 rounded-lg overflow-hidden shadow-2xs">
            <button
              onClick={() => onCallNumber('1251', 'ธนาคารเลือด')}
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-red-700 hover:bg-red-50 font-medium transition-colors cursor-pointer"
              title="คัดลอกเบอร์ คลังเลือด (1251)"
            >
              <Droplet className="w-3 h-3 text-red-600" />
              <span className="font-semibold">คลังเลือด:</span>
              <span className="font-mono font-bold text-red-800">1251</span>
            </button>
            <a
              href={getCallablePhoneHref('1251')}
              className="p-1.5 bg-red-100 hover:bg-red-200 text-red-700 border-l border-red-200"
              title={getDialTooltip('1251', 'ธนาคารเลือด')}
            >
              <PhoneCall className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      {/* Main KPI Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Card 1: Total Phone Numbers */}
        <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs hover:border-teal-300 transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">หมายเลขทั้งหมด</span>
            <div className="p-1.5 rounded-lg bg-teal-50 text-teal-600">
              <Phone className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-slate-900 font-mono tracking-tight">{totalRecords}</span>
            <span className="text-xs text-slate-500">สาย</span>
          </div>
          <p className="text-[11px] text-teal-600 font-medium mt-0.5">ในระบบ UDH</p>
        </div>

        {/* Card 2: Filtered Results */}
        <div className={`p-3.5 rounded-xl border shadow-xs transition-all ${
          filteredCount < totalRecords 
            ? 'bg-amber-50/70 border-amber-200' 
            : 'bg-white border-slate-200/80'
        }`}>
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">ผลการกรอง</span>
            <div className={`p-1.5 rounded-lg ${filteredCount < totalRecords ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'}`}>
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-slate-900 font-mono tracking-tight">{filteredCount}</span>
            <span className="text-xs text-slate-500">/{totalRecords}</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">
            {filteredCount === totalRecords ? 'แสดงทั้งหมด 100%' : `ตรงตามเงื่อนไข (${Math.round((filteredCount/totalRecords)*100)}%)`}
          </p>
        </div>

        {/* Card 3: Buildings */}
        <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs hover:border-teal-300 transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">อาคารทั้งหมด</span>
            <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-slate-900 font-mono tracking-tight">{totalBuildings}</span>
            <span className="text-xs text-slate-500">ตึก/อาคาร</span>
          </div>
          <p className="text-[11px] text-blue-600 font-medium mt-0.5">ครอบคลุมทั้ง รพ.</p>
        </div>

        {/* Card 4: Internal Lines */}
        <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs hover:border-teal-300 transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">เบอร์ภายใน</span>
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
              <PhoneCall className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-emerald-700 font-mono tracking-tight">{internalCount}</span>
            <span className="text-xs text-slate-500">เบอร์</span>
          </div>
          <p className="text-[11px] text-emerald-600 font-medium mt-0.5">โทรหากันฟรีใน รพ.</p>
        </div>

        {/* Card 5: External Lines */}
        <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs hover:border-teal-300 transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">เบอร์สายนอก/FAX</span>
            <div className="p-1.5 rounded-lg bg-purple-50 text-purple-600">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-slate-900 font-mono tracking-tight">{externalCount}</span>
            <span className="text-xs text-slate-500">เบอร์ตรง</span>
          </div>
          <p className="text-[11px] text-purple-600 font-medium mt-0.5">042-211880 ศูนย์แพทย์</p>
        </div>

        {/* Card 6: Bookmarked / Favorites */}
        <button
          onClick={onToggleFavorites}
          id="btn-kpi-favorites"
          className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer shadow-xs ${
            onlyFavorites
              ? 'bg-amber-100/80 border-amber-400 ring-2 ring-amber-300'
              : 'bg-white border-slate-200/80 hover:border-amber-300'
          }`}
        >
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium">เบอร์ที่ติดดาว</span>
            <div className={`p-1.5 rounded-lg ${onlyFavorites ? 'bg-amber-500 text-white' : 'bg-amber-50 text-amber-600'}`}>
              <Star className={`w-4 h-4 ${onlyFavorites ? 'fill-white' : 'fill-amber-400'}`} />
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-amber-800 font-mono tracking-tight">{favoriteCount}</span>
            <span className="text-xs text-slate-500">เบอร์</span>
          </div>
          <p className="text-[11px] text-amber-700 font-medium mt-0.5">
            {onlyFavorites ? 'กำลังกรองเฉพาะเบอร์โปรด' : 'คลิกเพื่อดูเบอร์โปรด'}
          </p>
        </button>
      </div>
    </div>
  );
};
