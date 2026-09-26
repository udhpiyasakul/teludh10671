import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { KPIStats } from './components/KPIStats';
import { FilterBar } from './components/FilterBar';
import { TableView } from './components/TableView';
import { GridView } from './components/GridView';
import { GroupedView } from './components/GroupedView';
import { SpeedDialView } from './components/SpeedDialView';
import { EmergencyModal } from './components/EmergencyModal';
import { VoiceSymptomModal } from './components/VoiceSymptomModal';
import { AnalyticsModal } from './components/AnalyticsModal';
import { PrintModal } from './components/PrintModal';
import { Toast } from './components/Toast';
import { UDHLogo } from './components/UDHLogo';
import { GoogleSheetModal } from './components/GoogleSheetModal';

import { FilterState, ViewMode, UDHPhoneRecord } from './types';
import { exportToCSV } from './utils/exportCsv';
import { 
  Building2, 
  HeartPulse, 
  Phone, 
  ExternalLink, 
  FileSpreadsheet, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle
} from 'lucide-react';
import {
  getDefaultRecords,
  fetchGoogleSheetCsv,
  parseSheetCsv,
  getSavedSheetUrl,
  saveSheetUrl,
  getSavedLastSync,
  saveLastSync,
  getCachedRecords,
  saveCachedRecords,
  normalizeGoogleSheetUrl,
  DEFAULT_GOOGLE_SHEET_URL
} from './services/googleSheetService';

const INITIAL_FILTERS: FilterState = {
  searchQuery: '',
  building: 'ALL',
  floor: 'ALL',
  category: 'ALL',
  phoneType: 'ALL',
  quickTag: 'ALL',
  onlyFavorites: false,
  sortBy: 'id',
  sortOrder: 'asc'
};

export default function App() {
  // Data Records State (cached or default)
  const [records, setRecords] = useState<UDHPhoneRecord[]>(() => {
    const cached = getCachedRecords();
    if (cached && cached.length > 0) {
      return cached;
    }
    return getDefaultRecords();
  });

  const [sheetUrl, setSheetUrl] = useState<string>(() => getSavedSheetUrl());
  const [lastSyncTime, setLastSyncTime] = useState<string>(() => getSavedLastSync());
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [isSheetModalOpen, setIsSheetModalOpen] = useState<boolean>(false);

  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [favorites, setFavorites] = useState<Set<number>>(() => {
    try {
      const saved = localStorage.getItem('udh_tel_favorites');
      if (saved) {
        return new Set<number>(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Error loading favorites from localStorage', e);
    }
    // Default favorites: ER 1669 (id: 36), Refer (id: 33), ศูนย์เปล (id: 38), ธนาคารเลือด (id: 371)
    return new Set<number>([36, 33, 38, 371]);
  });

  const [copiedPhone, setCopiedPhone] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals state
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);
  const [isDialpadOpen, setIsDialpadOpen] = useState(false);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  // Format current Thai datetime
  const formatThaiDateTime = () => {
    const now = new Date();
    const datePart = now.toLocaleDateString('th-TH', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
    const timePart = now.toLocaleTimeString('th-TH', {
      hour: '2-digit',
      minute: '2-digit'
    });
    return `${datePart} เวลา ${timePart} น.`;
  };

  // Google Sheet sync function
  const handleSyncSheet = useCallback(async (targetUrl: string, notifyUser = true): Promise<boolean> => {
    const trimmed = (targetUrl || DEFAULT_GOOGLE_SHEET_URL).trim();
    if (!trimmed) {
      if (notifyUser) setToastMessage('กรุณาระบุลิงก์ Google Sheet');
      return false;
    }

    setIsSyncing(true);
    try {
      const csvText = await fetchGoogleSheetCsv(trimmed);
      const parsed = parseSheetCsv(csvText);

      if (!parsed || parsed.length === 0) {
        throw new Error('ไม่พบข้อมูลรายการเบอร์โทรในเอกสาร Google Sheet');
      }

      setRecords(parsed);
      setSheetUrl(trimmed);
      saveSheetUrl(trimmed);
      saveCachedRecords(parsed);

      const timestamp = formatThaiDateTime();
      setLastSyncTime(timestamp);
      saveLastSync(timestamp);

      if (notifyUser) {
        setToastMessage(`อัปเดตข้อมูลจาก Google Sheet สำเร็จ (${parsed.length.toLocaleString()} หมายเลข)`);
        setTimeout(() => setToastMessage(null), 3500);
      }
      return true;
    } catch (err: any) {
      console.error('Failed to sync Google Sheet:', err);
      if (notifyUser) {
        setToastMessage(err?.message || 'เกิดข้อผิดพลาดในการดึงข้อมูล Google Sheet');
        setTimeout(() => setToastMessage(null), 5000);
      }
      return false;
    } finally {
      setIsSyncing(false);
    }
  }, []);

  // 1. Auto-fetch and update from Google Sheet immediately upon entering the web page
  useEffect(() => {
    const activeUrl = sheetUrl || DEFAULT_GOOGLE_SHEET_URL;
    // Silent automatic load on startup
    handleSyncSheet(activeUrl, false);
  }, [handleSyncSheet]);

  // Reset to default dataset
  const handleResetToDefault = useCallback(() => {
    const def = getDefaultRecords();
    setRecords(def);
    setSheetUrl(DEFAULT_GOOGLE_SHEET_URL);
    saveSheetUrl(DEFAULT_GOOGLE_SHEET_URL);
    saveCachedRecords(def);
    const timeStr = formatThaiDateTime();
    setLastSyncTime(timeStr);
    saveLastSync(timeStr);
    setToastMessage('คืนค่าข้อมูลลิงก์ทางการโรงพยาบาลอุดรธานีเรียบร้อยแล้ว');
    setTimeout(() => setToastMessage(null), 3000);
  }, []);

  // Save favorites to localStorage
  const handleToggleFavorite = (id: number) => {
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      try {
        localStorage.setItem('udh_tel_favorites', JSON.stringify(Array.from(next)));
      } catch (e) {
        console.error('Error saving favorites', e);
      }
      return next;
    });
  };

  // Copy phone number to clipboard
  const handleCopyPhone = (phone: string, unitName?: string) => {
    navigator.clipboard.writeText(phone);
    setCopiedPhone(phone);
    const msg = unitName 
      ? `คัดลอกเบอร์ ${phone} (${unitName}) แล้ว` 
      : `คัดลอกเบอร์ ${phone} แล้ว`;
    setToastMessage(msg);
    setTimeout(() => {
      setCopiedPhone(null);
      setToastMessage(null);
    }, 2500);
  };

  // Extract filter options dynamically from records with item counts
  const buildingOptions = useMemo(() => {
    const counts = new Map<string, number>();
    records.forEach(r => {
      if (r.building && r.building.trim()) {
        const b = r.building.trim();
        counts.set(b, (counts.get(b) || 0) + 1);
      }
    });
    return Array.from(counts.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => a.name.localeCompare(b.name, 'th'));
  }, [records]);

  const floorOptions = useMemo(() => {
    const counts = new Map<string, number>();
    records.forEach(r => {
      // Filter floors based on selected building if any
      if (filters.building !== 'ALL' && r.building !== filters.building) return;
      if (r.floor && r.floor.trim()) {
        const f = r.floor.trim();
        counts.set(f, (counts.get(f) || 0) + 1);
      }
    });
    return Array.from(counts.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => a.name.localeCompare(b.name, 'th', { numeric: true }));
  }, [records, filters.building]);

  const categoryOptions = useMemo(() => {
    const counts = new Map<string, number>();
    records.forEach(r => {
      if (r.category && r.category.trim()) {
        const c = r.category.trim();
        counts.set(c, (counts.get(c) || 0) + 1);
      }
    });
    return Array.from(counts.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => a.name.localeCompare(b.name, 'th'));
  }, [records]);

  const phoneTypeOptions = useMemo(() => {
    const counts = new Map<string, number>();
    records.forEach(r => {
      if (r.phoneType && r.phoneType.trim()) {
        const p = r.phoneType.trim();
        counts.set(p, (counts.get(p) || 0) + 1);
      }
    });
    return Array.from(counts.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => a.name.localeCompare(b.name, 'th'));
  }, [records]);

  // Filtering and Sorting logic
  const filteredRecords = useMemo(() => {
    return records.filter(item => {
      // Search query (unit name, phone, note, category, building)
      if (filters.searchQuery.trim()) {
        const query = filters.searchQuery.trim().toLowerCase();
        const matchUnit = item.unit.toLowerCase().includes(query);
        const matchPhone = item.phone.toLowerCase().includes(query);
        const matchNote = item.note ? item.note.toLowerCase().includes(query) : false;
        const matchCategory = item.category ? item.category.toLowerCase().includes(query) : false;
        const matchBuilding = item.building ? item.building.toLowerCase().includes(query) : false;
        const matchFloor = item.floor ? item.floor.toLowerCase().includes(query) : false;
        
        if (!matchUnit && !matchPhone && !matchNote && !matchCategory && !matchBuilding && !matchFloor) {
          return false;
        }
      }

      // Building filter
      if (filters.building !== 'ALL' && item.building !== filters.building) {
        return false;
      }

      // Floor filter
      if (filters.floor !== 'ALL' && item.floor !== filters.floor) {
        return false;
      }

      // Category filter
      if (filters.category !== 'ALL' && item.category !== filters.category) {
        return false;
      }

      // Phone type filter
      if (filters.phoneType !== 'ALL' && item.phoneType !== filters.phoneType) {
        return false;
      }

      // Quick Tag filter
      if (filters.quickTag !== 'ALL') {
        if (!item.tags || !item.tags.includes(filters.quickTag)) {
          return false;
        }
      }

      // Favorites only filter
      if (filters.onlyFavorites && !favorites.has(item.id)) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      let comparison = 0;

      // Always prioritize favorites at top when no explicit search
      if (!filters.searchQuery) {
        const aFav = favorites.has(a.id) ? 1 : 0;
        const bFav = favorites.has(b.id) ? 1 : 0;
        if (aFav !== bFav) return bFav - aFav;
      }

      if (filters.sortBy === 'id') {
        comparison = a.id - b.id;
      } else if (filters.sortBy === 'unit') {
        comparison = a.unit.localeCompare(b.unit, 'th');
      } else if (filters.sortBy === 'phone') {
        comparison = a.phone.localeCompare(b.phone, 'th', { numeric: true });
      } else if (filters.sortBy === 'building') {
        comparison = a.building.localeCompare(b.building, 'th');
      } else if (filters.sortBy === 'floor') {
        comparison = a.floor.localeCompare(b.floor, 'th', { numeric: true });
      }

      return filters.sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [records, filters, favorites]);

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleResetFilters = () => {
    setFilters(INITIAL_FILTERS);
  };

  const handleExportCsv = () => {
    exportToCSV(filteredRecords, `udh_tel_directory_${new Date().toISOString().slice(0, 10)}.csv`);
    setToastMessage(`ส่งออกไฟล์ CSV จำนวน ${filteredRecords.length} รายการเรียบร้อยแล้ว`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Quick stats
  const totalCount = records.length;
  const filteredCount = filteredRecords.length;
  const internalCount = records.filter(r => r.phoneType === 'เบอร์ภายใน').length;
  const externalCount = records.filter(r => r.phoneType === 'เบอร์สายนอก' || r.phoneType === 'เบอร์ตรง').length;

  const { editUrl } = normalizeGoogleSheetUrl(sheetUrl || DEFAULT_GOOGLE_SHEET_URL);

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-800 flex flex-col font-['IBM_Plex_Sans_Thai',sans-serif]">
      
      {/* Header with Refresh button */}
      <Header
        totalRecords={totalCount}
        filteredCount={filteredCount}
        onOpenEmergency={() => setIsEmergencyOpen(true)}
        onOpenDialpad={() => setIsDialpadOpen(true)}
        onOpenAnalytics={() => setIsAnalyticsOpen(true)}
        onExportCsv={handleExportCsv}
        onPrint={() => setIsPrintModalOpen(true)}
        onOpenGoogleSheet={() => setIsSheetModalOpen(true)}
        onRefreshSheet={() => handleSyncSheet(sheetUrl || DEFAULT_GOOGLE_SHEET_URL, true)}
        isSyncingSheet={isSyncing}
      />

      {/* Print-Only Title Banner for physical printouts */}
      <div className="print-only p-4 border-b-2 border-slate-900 mb-4 text-center">
        <img src="/logo.png" alt="โรงพยาบาลอุดรธานี" className="h-14 mx-auto mb-2 object-contain" />
        <h1 className="text-xl font-bold">สมุดโทรศัพท์ โรงพยาบาลอุดรธานี (UDH)</h1>
        <p className="text-xs text-slate-600">
          เบอร์หลัก 042-215100, 042-245555 (Operator กด 0, 1000, 1001, 1002) • ข้อมูล ณ วันที่ {new Date().toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })} | พัฒนาโดย ไอทีกลุ่มงานประกันสุขภาพ
        </p>
      </div>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-4">

        {/* Dynamic Google Sheet Status Strip */}
        <div className="no-print flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 px-4 py-2.5 bg-white/95 backdrop-blur-xs rounded-xl border border-emerald-200 shadow-xs text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold text-slate-700 flex items-center gap-1.5">
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              แหล่งข้อมูล: Google Sheet โรงพยาบาลอุดรธานี (อัปเดตอัตโนมัติ)
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-slate-600 font-medium">
              {totalCount.toLocaleString()} หมายเลข ({buildingOptions.length} อาคาร)
            </span>
            {lastSyncTime && (
              <>
                <span className="text-slate-400">•</span>
                <span className="text-slate-500">อัปเดตล่าสุด: {lastSyncTime}</span>
              </>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {editUrl && (
              <a
                href={editUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-600 hover:text-emerald-700 hover:underline flex items-center gap-1 text-[11px] font-medium"
                title="เปิดดูตาราง Google Sheet บนเว็บ"
              >
                <span>เปิดดู Sheet บนเว็บ</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
            <button
              onClick={() => handleSyncSheet(sheetUrl || DEFAULT_GOOGLE_SHEET_URL, true)}
              disabled={isSyncing}
              id="btn-status-strip-refresh"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition-all shadow-xs disabled:opacity-50 cursor-pointer"
              title="กดเพื่อรีเฟรชข้อมูลจาก Google Sheet เดี๋ยวนี้"
            >
              <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'กำลังซิงค์...' : 'รีเฟรชข้อมูล'}</span>
            </button>
          </div>
        </div>
        
        {/* KPI & Quick Alerts Strip (Hidden on Print) */}
        <div className="no-print">
          <KPIStats
            totalRecords={totalCount}
            filteredCount={filteredCount}
            totalBuildings={buildingOptions.length}
            internalCount={internalCount}
            externalCount={externalCount}
            favoriteCount={favorites.size}
            onlyFavorites={filters.onlyFavorites}
            onToggleFavorites={() => handleFilterChange({ onlyFavorites: !filters.onlyFavorites })}
            onSelectQuickTag={(tag) => handleFilterChange({ quickTag: tag })}
            onCallNumber={handleCopyPhone}
          />
        </div>

        {/* Master Filter Bar (Hidden on Print) */}
        <div className="no-print">
          <FilterBar
            filters={filters}
            onFilterChange={handleFilterChange}
            onResetFilters={handleResetFilters}
            buildingOptions={buildingOptions}
            floorOptions={floorOptions}
            categoryOptions={categoryOptions}
            phoneTypeOptions={phoneTypeOptions}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            totalFiltered={filteredCount}
            totalCount={totalCount}
            onOpenVoiceSearch={() => setIsDialpadOpen(true)}
          />
        </div>

        {/* View Modes */}
        <div>
          {viewMode === 'table' && (
            <TableView
              records={filteredRecords}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
              onCopyPhone={handleCopyPhone}
              copiedPhone={copiedPhone}
              searchQuery={filters.searchQuery}
            />
          )}

          {viewMode === 'grid' && (
            <GridView
              records={filteredRecords}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
              onCopyPhone={handleCopyPhone}
              copiedPhone={copiedPhone}
              searchQuery={filters.searchQuery}
            />
          )}

          {viewMode === 'grouped' && (
            <GroupedView
              records={filteredRecords}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
              onCopyPhone={handleCopyPhone}
              copiedPhone={copiedPhone}
              searchQuery={filters.searchQuery}
            />
          )}

          {viewMode === 'speedDial' && (
            <SpeedDialView
              onCopyPhone={handleCopyPhone}
              copiedPhone={copiedPhone}
              onPrint={() => setIsPrintModalOpen(true)}
            />
          )}
        </div>

      </main>

      {/* Clean Footer without admin */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-6 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2.5">
            <UDHLogo size={22} />
            <span className="font-semibold text-slate-700">โรงพยาบาลอุดรธานี (Udon Thani Hospital)</span>
            <span>•</span>
            <span>เบอร์หลัก 042-215100, 042-245555 (Operator กด 0, 1000, 1001, 1002)</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] flex-wrap justify-end">
            <span>{totalCount.toLocaleString()} หมายเลข • {buildingOptions.length} อาคาร</span>
            <span className="font-medium text-slate-600">พัฒนาโดย ไอทีกลุ่มงานประกันสุขภาพ</span>
            <button
              onClick={() => setIsSheetModalOpen(true)}
              className="inline-flex items-center gap-1 text-slate-400 hover:text-emerald-700 hover:underline"
              title="ดูข้อมูล Google Sheet"
            >
              <FileSpreadsheet className="w-3 h-3" />
              <span>ลิงก์ Google Sheet</span>
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <GoogleSheetModal
        isOpen={isSheetModalOpen}
        onClose={() => setIsSheetModalOpen(false)}
        currentSheetUrl={sheetUrl}
        lastSyncTime={lastSyncTime}
        totalRecords={totalCount}
        isSyncing={isSyncing}
        onSync={handleSyncSheet}
        onResetToDefault={handleResetToDefault}
      />

      <EmergencyModal
        isOpen={isEmergencyOpen}
        onClose={() => setIsEmergencyOpen(false)}
        onCopyPhone={handleCopyPhone}
        copiedPhone={copiedPhone}
        onPrint={() => {
          setIsEmergencyOpen(false);
          setIsPrintModalOpen(true);
        }}
      />

      <VoiceSymptomModal
        isOpen={isDialpadOpen}
        onClose={() => setIsDialpadOpen(false)}
        records={records}
        onCopyPhone={handleCopyPhone}
        copiedPhone={copiedPhone}
        onApplySearchToMainTable={(query) => {
          handleFilterChange({ searchQuery: query });
        }}
      />

      <AnalyticsModal
        isOpen={isAnalyticsOpen}
        onClose={() => setIsAnalyticsOpen(false)}
        records={records}
      />

      <PrintModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        records={filteredRecords}
      />

      {/* Toast Notification */}
      <Toast message={toastMessage} phone={copiedPhone} />

    </div>
  );
}
