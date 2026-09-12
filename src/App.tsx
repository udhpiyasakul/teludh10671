import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { KPIStats } from './components/KPIStats';
import { FilterBar } from './components/FilterBar';
import { TableView } from './components/TableView';
import { GridView } from './components/GridView';
import { GroupedView } from './components/GroupedView';
import { SpeedDialView } from './components/SpeedDialView';
import { EmergencyModal } from './components/EmergencyModal';
import { QuickLookupModal } from './components/QuickLookupModal';
import { AnalyticsModal } from './components/AnalyticsModal';
import { PrintModal } from './components/PrintModal';
import { Toast } from './components/Toast';
import { UDHLogo } from './components/UDHLogo';

import { UDH_PHONE_DATA } from './data/udhPhoneData';
import { FilterState, ViewMode, UDHPhoneRecord } from './types';
import { exportToCSV } from './utils/exportCsv';
import { Building2, HeartPulse, Phone, ExternalLink } from 'lucide-react';

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

  // Persist favorites
  useEffect(() => {
    try {
      localStorage.setItem('udh_tel_favorites', JSON.stringify(Array.from(favorites)));
    } catch (e) {
      console.error('Error saving favorites to localStorage', e);
    }
  }, [favorites]);

  // Copy phone handler
  const handleCopyPhone = useCallback((phone: string, unit: string) => {
    navigator.clipboard.writeText(phone);
    setCopiedPhone(phone);
    setToastMessage(`คัดลอกหมายเลข ${phone} (${unit}) เรียบร้อยแล้ว`);
    setTimeout(() => {
      setCopiedPhone(null);
      setToastMessage(null);
    }, 2500);
  }, []);

  // Toggle favorite
  const handleToggleFavorite = useCallback((id: number) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  // Update filters
  const handleFilterChange = useCallback((newFilters: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  // Reset filters
  const handleResetFilters = useCallback(() => {
    setFilters(INITIAL_FILTERS);
  }, []);

  // Derive unique options for filter dropdowns
  const { buildingOptions, floorOptions, categoryOptions, phoneTypeOptions } = useMemo(() => {
    const buildingMap = new Map<string, number>();
    const floorMap = new Map<string, number>();
    const categoryMap = new Map<string, number>();
    const phoneTypeMap = new Map<string, number>();

    UDH_PHONE_DATA.forEach((item) => {
      // Buildings
      buildingMap.set(item.building, (buildingMap.get(item.building) || 0) + 1);

      // Floors (if building filter is active, only show floors in that building)
      if (filters.building === 'ALL' || item.building === filters.building) {
        floorMap.set(item.floor, (floorMap.get(item.floor) || 0) + 1);
      }

      // Categories
      categoryMap.set(item.category, (categoryMap.get(item.category) || 0) + 1);

      // Phone types
      phoneTypeMap.set(item.phoneType, (phoneTypeMap.get(item.phoneType) || 0) + 1);
    });

    const sortByName = (a: { name: string }, b: { name: string }) => a.name.localeCompare(b.name, 'th');

    return {
      buildingOptions: Array.from(buildingMap.entries())
        .map(([name, count]) => ({ name, count }))
        .sort(sortByName),
      floorOptions: Array.from(floorMap.entries())
        .map(([name, count]) => ({ name, count }))
        .sort(sortByName),
      categoryOptions: Array.from(categoryMap.entries())
        .map(([name, count]) => ({ name, count }))
        .sort(sortByName),
      phoneTypeOptions: Array.from(phoneTypeMap.entries())
        .map(([name, count]) => ({ name, count }))
        .sort(sortByName)
    };
  }, [filters.building]);

  // Filtered & Sorted records
  const filteredRecords = useMemo(() => {
    return UDH_PHONE_DATA.filter((item) => {
      // 1. Search Query
      if (filters.searchQuery.trim()) {
        const query = filters.searchQuery.toLowerCase().trim();
        const matchesUnit = item.unit.toLowerCase().includes(query);
        const matchesPhone = item.phone.toLowerCase().includes(query);
        const matchesBuilding = item.building.toLowerCase().includes(query);
        const matchesFloor = item.floor.toLowerCase().includes(query);
        const matchesCategory = item.category.toLowerCase().includes(query);
        const matchesNote = item.note.toLowerCase().includes(query);

        if (!matchesUnit && !matchesPhone && !matchesBuilding && !matchesFloor && !matchesCategory && !matchesNote) {
          return false;
        }
      }

      // 2. Building
      if (filters.building !== 'ALL' && item.building !== filters.building) {
        return false;
      }

      // 3. Floor
      if (filters.floor !== 'ALL' && item.floor !== filters.floor) {
        return false;
      }

      // 4. Category
      if (filters.category !== 'ALL' && item.category !== filters.category) {
        return false;
      }

      // 5. Phone Type
      if (filters.phoneType !== 'ALL' && item.phoneType !== filters.phoneType) {
        return false;
      }

      // 6. Quick Tag
      if (filters.quickTag !== 'ALL') {
        if (!item.tags.includes(filters.quickTag)) {
          return false;
        }
      }

      // 7. Favorites only
      if (filters.onlyFavorites && !favorites.has(item.id)) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      let comparison = 0;
      if (filters.sortBy === 'id') {
        comparison = a.id - b.id;
      } else if (filters.sortBy === 'unit') {
        comparison = a.unit.localeCompare(b.unit, 'th');
      } else if (filters.sortBy === 'phone') {
        comparison = a.phone.localeCompare(b.phone);
      } else if (filters.sortBy === 'building') {
        comparison = a.building.localeCompare(b.building, 'th');
      } else if (filters.sortBy === 'floor') {
        comparison = a.floor.localeCompare(b.floor, 'th');
      }
      return filters.sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [filters, favorites]);

  // Summary counts
  const totalCount = UDH_PHONE_DATA.length;
  const filteredCount = filteredRecords.length;
  const internalCount = useMemo(() => UDH_PHONE_DATA.filter(r => r.phoneType === 'เบอร์ภายใน').length, []);
  const externalCount = useMemo(() => UDH_PHONE_DATA.filter(r => r.phoneType === 'เบอร์สายนอก').length, []);

  // Export CSV
  const handleExportCsv = () => {
    const filename = filters.building !== 'ALL' 
      ? `udh_tel_${filters.building.replace(/\s+/g, '_')}.csv`
      : 'udh_tel_directory_all.csv';
    exportToCSV(filteredRecords, filename);
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-800 flex flex-col font-['IBM_Plex_Sans_Thai',sans-serif]">
      
      {/* Header */}
      <Header
        totalRecords={totalCount}
        filteredCount={filteredCount}
        onOpenEmergency={() => setIsEmergencyOpen(true)}
        onOpenDialpad={() => setIsDialpadOpen(true)}
        onOpenAnalytics={() => setIsAnalyticsOpen(true)}
        onExportCsv={handleExportCsv}
        onPrint={() => setIsPrintModalOpen(true)}
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
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 space-y-5">
        
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

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-6 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2.5">
            <UDHLogo size={22} />
            <span className="font-semibold text-slate-700">โรงพยาบาลอุดรธานี (Udon Thani Hospital)</span>
            <span>•</span>
            <span>เบอร์หลัก 042-215100, 042-245555 (Operator กด 0, 1000, 1001, 1002)</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>{totalCount} หมายเลข • 13 อาคาร • ปรับปรุงล่าสุด 2569</span>
            <span>พัฒนาโดย ไอทีกลุ่มงานประกันสุขภาพ</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
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

      <QuickLookupModal
        isOpen={isDialpadOpen}
        onClose={() => setIsDialpadOpen(false)}
        records={UDH_PHONE_DATA}
        onCopyPhone={handleCopyPhone}
        copiedPhone={copiedPhone}
      />

      <AnalyticsModal
        isOpen={isAnalyticsOpen}
        onClose={() => setIsAnalyticsOpen(false)}
        records={UDH_PHONE_DATA}
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
