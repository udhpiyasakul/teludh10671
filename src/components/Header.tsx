import React, { useState, useEffect } from 'react';
import { 
  Phone, 
  ShieldAlert, 
  BarChart3, 
  Clock,
  RefreshCw,
  Mic
} from 'lucide-react';
import { UDHLogo } from './UDHLogo';

interface HeaderProps {
  totalRecords: number;
  filteredCount: number;
  onOpenEmergency: () => void;
  onOpenDialpad: () => void;
  onOpenAnalytics: () => void;
  onExportCsv?: () => void;
  onPrint?: () => void;
  onOpenGoogleSheet?: () => void;
  onRefreshSheet: () => void;
  isSyncingSheet?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  totalRecords,
  filteredCount,
  onOpenEmergency,
  onOpenDialpad,
  onOpenAnalytics,
  onExportCsv,
  onPrint,
  onOpenGoogleSheet,
  onRefreshSheet,
  isSyncingSheet = false
}) => {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      setCurrentDate(now.toLocaleDateString('th-TH', { 
        weekday: 'short', 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="bg-gradient-to-r from-teal-900 via-teal-800 to-cyan-900 text-white shadow-lg sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between py-3.5 gap-4">
          
          {/* Logo & Title */}
          <div className="flex items-center gap-3.5 w-full md:w-auto">
            <div className="w-12 h-12 rounded-xl bg-white/95 border border-white/40 p-1 flex items-center justify-center shadow-md shrink-0">
              <UDHLogo size={42} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-teal-500/30 text-teal-200 border border-teal-400/30 tracking-wider uppercase">
                  UDH Tel Directory
                </span>
                <span className="text-xs text-teal-300/80">โรงพยาบาลศูนย์อุดรธานี</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                สมุดโทรศัพท์โรงพยาบาลอุดรธานี
              </h1>
              <p className="text-xs text-teal-200/90 hidden sm:block">
                ระบบค้นหาและทำเนียบหมายเลขโทรศัพท์ภายใน-ภายนอก ({totalRecords.toLocaleString()} หมายเลข 13 อาคาร)
              </p>
            </div>
          </div>

          {/* Quick Actions & Live Time */}
          <div className="flex items-center gap-2 flex-wrap justify-end w-full md:w-auto">
            
            {/* Clock Badge */}
            <div className="hidden xl:flex items-center gap-2 bg-teal-950/40 border border-teal-500/30 rounded-lg px-3 py-1.5 text-xs text-teal-200">
              <Clock className="w-3.5 h-3.5 text-teal-400" />
              <span>{currentDate}</span>
              <span className="font-mono font-medium text-white">{currentTime}</span>
            </div>

            {/* Refresh / Sync Sheet Button for All Users */}
            <button
              onClick={onRefreshSheet}
              disabled={isSyncingSheet}
              id="btn-header-refresh-sheet"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white text-xs font-semibold shadow-md transition-all border border-emerald-400/40 disabled:opacity-75 cursor-pointer"
              title="กดเพื่ออัปเดตข้อมูลล่าสุดจาก Google Sheet ทันที"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-emerald-100 ${isSyncingSheet ? 'animate-spin' : ''}`} />
              <span>{isSyncingSheet ? 'กำลังอัปเดต...' : 'รีเฟรชข้อมูล'}</span>
            </button>

            {/* Emergency Hotline Button */}
            <button
              onClick={onOpenEmergency}
              id="btn-emergency-hotline"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 active:scale-95 text-white text-xs font-semibold shadow-md transition-all border border-rose-400/40 animate-pulse"
              title="เบอร์โทรฉุกเฉินและหน่วยงานวิกฤต"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>เบอร์ฉุกเฉิน / 1669</span>
            </button>

            {/* Voice & Symptom Room Finder Button */}
            <button
              onClick={onOpenDialpad}
              id="btn-voice-symptom-lookup"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-teal-700 to-cyan-700 hover:from-teal-600 hover:to-cyan-600 active:scale-95 text-white text-xs font-semibold border border-cyan-400/40 shadow-sm transition-all cursor-pointer"
              title="ค้นด้วยเสียงพูด แปลงเป็นข้อความ และบอกอาการหาห้องตรวจอัตโนมัติ"
            >
              <Mic className="w-3.5 h-3.5 text-cyan-200" />
              <span>ค้นด้วยเสียง / หาห้องตรวจ</span>
            </button>

            {/* Analytics Modal Button */}
            <button
              onClick={onOpenAnalytics}
              id="btn-analytics-chart"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-700/70 hover:bg-teal-600 active:scale-95 text-teal-100 text-xs font-medium border border-teal-500/40 transition-all"
              title="ดูกราฟสถิติภาพรวม"
            >
              <BarChart3 className="w-3.5 h-3.5 text-teal-300" />
              <span>สถิติ</span>
            </button>

          </div>

        </div>
      </div>
    </header>
  );
};
