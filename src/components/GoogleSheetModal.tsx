import React, { useState } from 'react';
import { 
  X, 
  FileSpreadsheet, 
  RefreshCw, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle, 
  Download, 
  Copy, 
  Check, 
  Database,
  ArrowRight,
  Sparkles,
  RotateCcw
} from 'lucide-react';
import { normalizeGoogleSheetUrl, DEFAULT_GOOGLE_SHEET_URL } from '../services/googleSheetService';

interface GoogleSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSheetUrl: string;
  lastSyncTime: string;
  totalRecords: number;
  isSyncing: boolean;
  onSync: (url: string) => Promise<boolean>;
  onResetToDefault: () => void;
}

export const GoogleSheetModal: React.FC<GoogleSheetModalProps> = ({
  isOpen,
  onClose,
  currentSheetUrl,
  lastSyncTime,
  totalRecords,
  isSyncing,
  onSync,
  onResetToDefault,
}) => {
  const [inputUrl, setInputUrl] = useState(currentSheetUrl || DEFAULT_GOOGLE_SHEET_URL);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [copiedHeader, setCopiedHeader] = useState(false);
  const [activeTab, setActiveTab] = useState<'settings' | 'guide' | 'template'>('settings');

  if (!isOpen) return null;

  const handleStartSync = async () => {
    setSyncStatus('idle');
    setErrorMessage('');
    try {
      const target = inputUrl.trim() || DEFAULT_GOOGLE_SHEET_URL;
      const success = await onSync(target);
      if (success) {
        setSyncStatus('success');
        setTimeout(() => setSyncStatus('idle'), 4000);
      } else {
        setSyncStatus('error');
      }
    } catch (err: any) {
      setSyncStatus('error');
      setErrorMessage(err?.message || 'เกิดข้อผิดพลาดในการดึงข้อมูล');
    }
  };

  const handleCopyHeaders = () => {
    const headerStr = 'ลำดับ,อาคาร,ชั้น,กลุ่มงาน_หมวดหมู่,หน่วยงาน_ชื่อห้อง,หมายเลขโทรศัพท์,ประเภทหมายเลข,หมายเหตุ';
    navigator.clipboard.writeText(headerStr);
    setCopiedHeader(true);
    setTimeout(() => setCopiedHeader(false), 2000);
  };

  const { editUrl, isPublishToWeb } = normalizeGoogleSheetUrl(inputUrl || currentSheetUrl || DEFAULT_GOOGLE_SHEET_URL);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
              <FileSpreadsheet className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/30 text-emerald-200 border border-emerald-400/30">
                  Google Sheet Database
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold">ข้อมูลสมุดโทรศัพท์ Google Sheet</h2>
              <p className="text-xs text-emerald-200/80">
                ซิงค์และอัปเดตข้อมูลอัตโนมัติจาก Google Sheet โรงพยาบาลอุดรธานี
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50/80 px-4 pt-2 gap-2 text-xs font-medium shrink-0 overflow-x-auto">
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-3.5 py-2.5 rounded-t-lg transition-colors border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'settings'
                ? 'bg-white border-emerald-600 text-emerald-900 font-semibold shadow-xs'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>สถานะและลิงก์ชีต</span>
          </button>
          <button
            onClick={() => setActiveTab('guide')}
            className={`px-3.5 py-2.5 rounded-t-lg transition-colors border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'guide'
                ? 'bg-white border-emerald-600 text-emerald-900 font-semibold shadow-xs'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>วิธีเอาลิงก์จากชีต</span>
          </button>
          <button
            onClick={() => setActiveTab('template')}
            className={`px-3.5 py-2.5 rounded-t-lg transition-colors border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'template'
                ? 'bg-white border-emerald-600 text-emerald-900 font-semibold shadow-xs'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>โครงสร้างคอลัมน์ (8 คอลัมน์)</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-5 text-slate-700 text-sm">

          {/* TAB 1: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="space-y-4">
              {/* Status Overview Card */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="text-xs text-slate-500 font-medium">สถานะข้อมูลปัจจุบัน</div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      พร้อมใช้งาน ({totalRecords.toLocaleString()} หมายเลข)
                    </span>
                    <span className="text-xs text-slate-500">
                      {isPublishToWeb ? 'โหมด Publish to Web' : 'โหมด Direct Sheet'}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500">
                    ซิงค์ล่าสุด: <span className="font-medium text-slate-700">{lastSyncTime || 'ซิงค์อัตโนมัติเมื่อเปิดเว็บ'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {editUrl && (
                    <a
                      href={editUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-medium transition-colors"
                      title="เปิดเอกสารในแท็บใหม่"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                      <span>เปิด Sheet บนเว็บ</span>
                    </a>
                  )}
                  <button
                    onClick={() => {
                      setInputUrl(DEFAULT_GOOGLE_SHEET_URL);
                      onResetToDefault();
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-600 hover:bg-slate-100 text-xs font-medium transition-colors"
                    title="คืนค่าลิงก์ Google Sheet ทางการของโรงพยาบาล"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>ใช้ลิงก์ทางการ</span>
                  </button>
                </div>
              </div>

              {/* URL Input Box */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-slate-800">
                    ลิงก์ Google Sheet ที่เชื่อมต่อ:
                  </label>
                  <button
                    type="button"
                    onClick={() => setInputUrl(DEFAULT_GOOGLE_SHEET_URL)}
                    className="text-[11px] text-teal-700 hover:underline"
                  >
                    วางลิงก์ชีตทางการ UDH
                  </button>
                </div>
                <div className="relative">
                  <input
                    type="url"
                    value={inputUrl}
                    onChange={(e) => setInputUrl(e.target.value)}
                    placeholder="https://docs.google.com/spreadsheets/d/e/.../pub?output=csv"
                    className="w-full pl-3.5 pr-20 py-2.5 text-xs font-mono bg-white border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 text-slate-800 transition-all placeholder:text-slate-400 placeholder:font-sans"
                  />
                  {inputUrl && (
                    <button
                      onClick={() => setInputUrl('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-medium px-1.5 py-0.5"
                    >
                      ล้าง
                    </button>
                  )}
                </div>
                <div className="p-3 bg-emerald-50/60 border border-emerald-200/80 rounded-xl text-[11px] text-emerald-900 leading-relaxed">
                  ✓ ลิงก์นี้ได้รับการฝังไว้ในระบบเรียบร้อยแล้ว ทุกครั้งที่เปิดหน้าเว็บ ระบบจะดึงข้อมูลล่าสุดจาก Google Sheet นี้โดยอัตโนมัติ
                </div>
              </div>

              {/* Feedback messages */}
              {syncStatus === 'success' && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>ดึงข้อมูลและอัปเดตสมุดโทรศัพท์สำเร็จ ({totalRecords.toLocaleString()} รายการ)</span>
                </div>
              )}

              {syncStatus === 'error' && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs space-y-1 animate-in fade-in">
                  <div className="flex items-center gap-2 font-medium">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>ไม่สามารถซิงค์ข้อมูลได้</span>
                  </div>
                  <p className="text-rose-700 pl-6 text-[11px]">{errorMessage}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  ปิดหน้าต่าง
                </button>
                <button
                  type="button"
                  onClick={handleStartSync}
                  disabled={isSyncing}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 disabled:opacity-50 text-white text-xs font-bold shadow-md shadow-emerald-700/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                  <span>{isSyncing ? 'กำลังดึงข้อมูล...' : 'รีเฟรชข้อมูลเดี๋ยวนี้ (Sync Now)'}</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: GUIDE */}
          {activeTab === 'guide' && (
            <div className="space-y-4">
              <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3.5 text-xs text-emerald-900 space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-emerald-950">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  วิธีตั้งค่าให้ Google Sheet อัปเดตข้อมูลอัตโนมัติ
                </div>
                <p className="text-emerald-800 text-[11px] leading-relaxed">
                  หากต้องการสร้างชีตใหม่หรือเปลี่ยนไฟล์ ให้ใช้เมนู "เผยแพร่ไปยังเว็บ" (Publish to web) เป็นไฟล์ CSV
                </p>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex gap-3 items-start p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center shrink-0 text-xs">1</span>
                  <div className="space-y-1">
                    <div className="font-semibold text-slate-800">เปิดเอกสาร Google Sheet ของคุณ</div>
                    <p className="text-slate-600 text-[11px]">
                      ไปที่เมนู <span className="font-semibold text-slate-800">ไฟล์ (File)</span> &gt; <span className="font-semibold text-slate-800">แชร์ (Share)</span> &gt; <span className="font-semibold text-emerald-700">เผยแพร่ไปยังเว็บ (Publish to web)</span>
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 items-start p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center shrink-0 text-xs">2</span>
                  <div className="space-y-1">
                    <div className="font-semibold text-slate-800">เลือกประเภทไฟล์เป็น "CSV"</div>
                    <p className="text-slate-600 text-[11px]">
                      ในช่องประเภทเอกสาร (เดิมจะเป็นหน้าเว็บ) ให้เปลี่ยนเป็น <span className="font-semibold text-emerald-700">ค่าที่คั่นด้วยเครื่องหมายจุลภาค (.csv)</span>
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 items-start p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center shrink-0 text-xs">3</span>
                  <div className="space-y-1">
                    <div className="font-semibold text-slate-800">กด "เผยแพร่" (Publish) แล้วคัดลอกลิงก์</div>
                    <p className="text-slate-600 text-[11px]">
                      คัดลอกลิงก์ที่ขึ้นต้นด้วย <code className="bg-slate-200 px-1 py-0.5 rounded text-[10px] text-slate-800 font-mono">https://docs.google.com/spreadsheets/d/e/.../pub?output=csv</code> มาวางในช่องด้านบน
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: TEMPLATE */}
          {activeTab === 'template' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">แถวหัวตาราง (Header) ทั้ง 8 คอลัมน์:</span>
                  <button
                    onClick={handleCopyHeaders}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs transition-colors"
                  >
                    {copiedHeader ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedHeader ? 'คัดลอกแล้ว' : 'คัดลอกหัวตาราง'}</span>
                  </button>
                </div>

                <div className="overflow-x-auto border border-slate-200 rounded-xl">
                  <table className="min-w-full divide-y divide-slate-200 text-[11px]">
                    <thead className="bg-slate-100 font-bold text-slate-700">
                      <tr>
                        <th className="px-2.5 py-2 text-left">A: ลำดับ</th>
                        <th className="px-2.5 py-2 text-left">B: อาคาร</th>
                        <th className="px-2.5 py-2 text-left">C: ชั้น</th>
                        <th className="px-2.5 py-2 text-left">D: กลุ่มงาน_หมวดหมู่</th>
                        <th className="px-2.5 py-2 text-left">E: หน่วยงาน_ชื่อห้อง</th>
                        <th className="px-2.5 py-2 text-left">F: หมายเลขโทรศัพท์</th>
                        <th className="px-2.5 py-2 text-left">G: ประเภทหมายเลข</th>
                        <th className="px-2.5 py-2 text-left">H: หมายเหตุ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      <tr>
                        <td className="px-2.5 py-1.5 text-slate-500">1</td>
                        <td className="px-2.5 py-1.5 font-medium">อาคารผู้ป่วยนอกและอำนวยการ</td>
                        <td className="px-2.5 py-1.5">ชั้น 1</td>
                        <td className="px-2.5 py-1.5">ทั่วไป</td>
                        <td className="px-2.5 py-1.5 font-medium text-emerald-800">เคาท์เตอร์บัตร ลงทะบียนห้องตรวจ</td>
                        <td className="px-2.5 py-1.5 font-mono font-bold text-teal-700">3110</td>
                        <td className="px-2.5 py-1.5 text-slate-500">เบอร์ภายใน</td>
                        <td className="px-2.5 py-1.5 text-slate-400">-</td>
                      </tr>
                      <tr className="bg-slate-50/50">
                        <td className="px-2.5 py-1.5 text-slate-500">2</td>
                        <td className="px-2.5 py-1.5 font-medium">อาคารผู้ป่วยนอกและอำนวยการ</td>
                        <td className="px-2.5 py-1.5">ชั้น 1</td>
                        <td className="px-2.5 py-1.5">ทั่วไป</td>
                        <td className="px-2.5 py-1.5 font-medium text-emerald-800">จุดคัดกรองคนไข้ (Screen ER)</td>
                        <td className="px-2.5 py-1.5 font-mono font-bold text-teal-700">3150</td>
                        <td className="px-2.5 py-1.5 text-slate-500">เบอร์ภายใน</td>
                        <td className="px-2.5 py-1.5 text-slate-400">Screen ER</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
