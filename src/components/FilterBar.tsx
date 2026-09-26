import React from 'react';
import { 
  Search, 
  X, 
  Filter, 
  Building2, 
  Layers, 
  FolderTree, 
  Phone, 
  SlidersHorizontal, 
  ArrowUpDown, 
  RotateCcw,
  LayoutList,
  LayoutGrid,
  FolderOpen,
  ShieldAlert,
  Star,
  Check,
  Mic
} from 'lucide-react';
import { FilterState, ViewMode } from '../types';
import { QUICK_TAGS } from '../data/constants';

interface FilterBarProps {
  filters: FilterState;
  onFilterChange: (newFilters: Partial<FilterState>) => void;
  onResetFilters: () => void;
  buildingOptions: { name: string; count: number }[];
  floorOptions: { name: string; count: number }[];
  categoryOptions: { name: string; count: number }[];
  phoneTypeOptions: { name: string; count: number }[];
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  totalFiltered: number;
  totalCount: number;
  onOpenVoiceSearch?: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  buildingOptions,
  floorOptions,
  categoryOptions,
  phoneTypeOptions,
  viewMode,
  onViewModeChange,
  totalFiltered,
  totalCount,
  onOpenVoiceSearch
}) => {
  const hasActiveFilters = 
    filters.searchQuery !== '' ||
    filters.building !== 'ALL' ||
    filters.floor !== 'ALL' ||
    filters.category !== 'ALL' ||
    filters.phoneType !== 'ALL' ||
    filters.quickTag !== 'ALL' ||
    filters.onlyFavorites;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 space-y-4">
      
      {/* Top Row: Search Input & View Mode Switcher */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
        
        {/* Global Search Bar */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-5 h-5 text-teal-600" />
          </div>
          <input
            type="text"
            id="input-global-search"
            value={filters.searchQuery}
            onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
            placeholder="ค้นหาชื่อหน่วยงาน, ห้องตรวจ, หมายเลข 4 หลัก (เช่น 3110, 3124), อาคาร, ชั้น..."
            className="w-full pl-10 pr-28 py-2.5 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 focus:border-teal-500 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all"
          />
          <div className="absolute inset-y-0 right-0 pr-2 flex items-center gap-1.5">
            {filters.searchQuery && (
              <button
                onClick={() => onFilterChange({ searchQuery: '' })}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/60 cursor-pointer"
                title="ล้างคำค้นหา"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            {onOpenVoiceSearch && (
              <button
                type="button"
                onClick={onOpenVoiceSearch}
                id="btn-searchbar-voice"
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 text-xs font-semibold cursor-pointer transition-all active:scale-95"
                title="ค้นหาด้วยเสียงพูด และบอกอาการหาห้องตรวจ"
              >
                <Mic className="w-3.5 h-3.5 text-teal-600" />
                <span className="hidden sm:inline text-[11px]">เสียง/อาการ</span>
              </button>
            )}
          </div>
        </div>

        {/* View Mode Selector Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200/80 shrink-0 self-start md:self-auto overflow-x-auto max-w-full">
          <button
            onClick={() => onViewModeChange('table')}
            id="btn-view-table"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
              viewMode === 'table'
                ? 'bg-white text-teal-800 shadow-xs border border-slate-200/60'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <LayoutList className="w-3.5 h-3.5" />
            <span>ตาราง</span>
          </button>

          <button
            onClick={() => onViewModeChange('grid')}
            id="btn-view-grid"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
              viewMode === 'grid'
                ? 'bg-white text-teal-800 shadow-xs border border-slate-200/60'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>การ์ด</span>
          </button>

          <button
            onClick={() => onViewModeChange('grouped')}
            id="btn-view-grouped"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
              viewMode === 'grouped'
                ? 'bg-white text-teal-800 shadow-xs border border-slate-200/60'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FolderOpen className="w-3.5 h-3.5" />
            <span>แยกตามอาคาร</span>
          </button>

          <button
            onClick={() => onViewModeChange('speedDial')}
            id="btn-view-speeddial"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
              viewMode === 'speedDial'
                ? 'bg-white text-rose-800 shadow-xs border border-slate-200/60'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
            <span>สายด่วน</span>
          </button>
        </div>

      </div>

      {/* Second Row: Dropdown Filters Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 pt-1 border-t border-slate-100">
        
        {/* Filter 1: Building (อาคาร) */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-500 mb-1 flex items-center gap-1">
            <Building2 className="w-3 h-3 text-teal-600" />
            <span>อาคาร ({buildingOptions.length})</span>
          </label>
          <select
            id="select-building"
            value={filters.building}
            onChange={(e) => onFilterChange({ building: e.target.value, floor: 'ALL' })}
            className="w-full px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100/70 border border-slate-200 rounded-lg text-xs text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-teal-500"
          >
            <option value="ALL">อาคารทั้งหมด ({totalCount})</option>
            {buildingOptions.map((b, idx) => {
              const name = typeof b === 'string' ? b : (b?.name || '');
              const count = typeof b === 'object' && b?.count !== undefined ? b.count : undefined;
              if (!name) return null;
              return (
                <option key={name || idx} value={name}>
                  {name} {count !== undefined ? `(${count})` : ''}
                </option>
              );
            })}
          </select>
        </div>

        {/* Filter 2: Floor (ชั้น) */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-500 mb-1 flex items-center gap-1">
            <Layers className="w-3 h-3 text-blue-600" />
            <span>ชั้น ({floorOptions.length})</span>
          </label>
          <select
            id="select-floor"
            value={filters.floor}
            onChange={(e) => onFilterChange({ floor: e.target.value })}
            className="w-full px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100/70 border border-slate-200 rounded-lg text-xs text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-teal-500"
          >
            <option value="ALL">ชั้นทั้งหมด</option>
            {floorOptions.map((f, idx) => {
              const name = typeof f === 'string' ? f : (f?.name || '');
              const count = typeof f === 'object' && f?.count !== undefined ? f.count : undefined;
              if (!name) return null;
              return (
                <option key={name || idx} value={name}>
                  {name} {count !== undefined ? `(${count})` : ''}
                </option>
              );
            })}
          </select>
        </div>

        {/* Filter 3: Category / Department (กลุ่มงาน/หมวดหมู่) */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-500 mb-1 flex items-center gap-1">
            <FolderTree className="w-3 h-3 text-purple-600" />
            <span>กลุ่มงาน / หมวดหมู่</span>
          </label>
          <select
            id="select-category"
            value={filters.category}
            onChange={(e) => onFilterChange({ category: e.target.value })}
            className="w-full px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100/70 border border-slate-200 rounded-lg text-xs text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-teal-500"
          >
            <option value="ALL">กลุ่มงานทั้งหมด ({categoryOptions.length})</option>
            {categoryOptions.map((c, idx) => {
              const name = typeof c === 'string' ? c : (c?.name || '');
              const count = typeof c === 'object' && c?.count !== undefined ? c.count : undefined;
              if (!name) return null;
              return (
                <option key={name || idx} value={name}>
                  {name} {count !== undefined ? `(${count})` : ''}
                </option>
              );
            })}
          </select>
        </div>

        {/* Filter 4: Phone Type (ประเภทหมายเลข) */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-500 mb-1 flex items-center gap-1">
            <Phone className="w-3 h-3 text-emerald-600" />
            <span>ประเภทหมายเลข</span>
          </label>
          <select
            id="select-phone-type"
            value={filters.phoneType}
            onChange={(e) => onFilterChange({ phoneType: e.target.value })}
            className="w-full px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100/70 border border-slate-200 rounded-lg text-xs text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-teal-500"
          >
            <option value="ALL">ทุกประเภท (ภายใน/สายนอก)</option>
            {phoneTypeOptions.map((t, idx) => {
              const name = typeof t === 'string' ? t : (t?.name || '');
              const count = typeof t === 'object' && t?.count !== undefined ? t.count : undefined;
              if (!name) return null;
              return (
                <option key={name || idx} value={name}>
                  {name} {count !== undefined ? `(${count})` : ''}
                </option>
              );
            })}
          </select>
        </div>

        {/* Sort Controls */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-500 mb-1 flex items-center gap-1">
            <ArrowUpDown className="w-3 h-3 text-slate-600" />
            <span>เรียงลำดับ</span>
          </label>
          <div className="flex items-center gap-1">
            <select
              id="select-sort-by"
              value={filters.sortBy}
              onChange={(e) => onFilterChange({ sortBy: e.target.value as FilterState['sortBy'] })}
              className="flex-1 px-2 py-1.5 bg-slate-50 hover:bg-slate-100/70 border border-slate-200 rounded-lg text-xs text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-teal-500"
            >
              <option value="id">ตามลำดับต้นฉบับ</option>
              <option value="unit">ชื่อห้อง/หน่วยงาน (ก-ฮ)</option>
              <option value="phone">หมายเลขโทรศัพท์</option>
              <option value="building">อาคาร</option>
              <option value="floor">ชั้น</option>
            </select>
            <button
              onClick={() => onFilterChange({ sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc' })}
              id="btn-toggle-sort-order"
              className="px-2 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg text-xs text-slate-700 font-semibold transition-colors cursor-pointer"
              title={filters.sortOrder === 'asc' ? 'เรียงจากน้อยไปมาก' : 'เรียงจากมากไปน้อย'}
            >
              {filters.sortOrder === 'asc' ? '▲' : '▼'}
            </button>
          </div>
        </div>

      </div>

      {/* Third Row: Quick Preset Chips */}
      <div className="pt-2 border-t border-slate-100">
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1">
            <SlidersHorizontal className="w-3 h-3 text-teal-600" />
            หมวดหมู่ค้นหาด่วน (Quick Filters):
          </span>
          {hasActiveFilters && (
            <button
              onClick={onResetFilters}
              id="btn-reset-filters"
              className="flex items-center gap-1 text-[11px] font-semibold text-rose-600 hover:text-rose-700 hover:underline cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>ล้างตัวกรองทั้งหมด</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          {QUICK_TAGS.map((tag) => {
            const isActive = filters.quickTag === tag.id;
            return (
              <button
                key={tag.id}
                onClick={() => onFilterChange({ quickTag: isActive && tag.id !== 'ALL' ? 'ALL' : tag.id })}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 border cursor-pointer ${
                  isActive
                    ? 'bg-teal-700 text-white border-teal-800 shadow-xs'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200/80'
                }`}
              >
                {isActive && <Check className="w-3 h-3" />}
                <span>{tag.label}</span>
              </button>
            );
          })}

          {/* Favorites Filter Chip */}
          <button
            onClick={() => onFilterChange({ onlyFavorites: !filters.onlyFavorites })}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 border cursor-pointer ${
              filters.onlyFavorites
                ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                : 'bg-amber-50/70 hover:bg-amber-100 text-amber-800 border-amber-200'
            }`}
          >
            <Star className={`w-3 h-3 ${filters.onlyFavorites ? 'fill-white' : 'fill-amber-400'}`} />
            <span>เฉพาะเบอร์ติดดาว</span>
          </button>
        </div>
      </div>

      {/* Active Filter Badges Bar */}
      {hasActiveFilters && (
        <div className="bg-slate-50/80 border border-slate-200/70 rounded-xl p-2.5 flex items-center justify-between gap-3 text-xs flex-wrap">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-slate-600">ตัวกรองที่เลือก:</span>
            
            {filters.searchQuery && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-teal-100 text-teal-800 border border-teal-200">
                <span>คำค้น: &ldquo;{filters.searchQuery}&rdquo;</span>
                <button onClick={() => onFilterChange({ searchQuery: '' })} className="hover:text-teal-950">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {filters.building !== 'ALL' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 border border-blue-200">
                <span>อาคาร: {filters.building}</span>
                <button onClick={() => onFilterChange({ building: 'ALL' })} className="hover:text-blue-950">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {filters.floor !== 'ALL' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-800 border border-indigo-200">
                <span>ชั้น: {filters.floor}</span>
                <button onClick={() => onFilterChange({ floor: 'ALL' })} className="hover:text-indigo-950">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {filters.category !== 'ALL' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-100 text-purple-800 border border-purple-200">
                <span>กลุ่มงาน: {filters.category}</span>
                <button onClick={() => onFilterChange({ category: 'ALL' })} className="hover:text-purple-950">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {filters.phoneType !== 'ALL' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-200">
                <span>ประเภท: {filters.phoneType}</span>
                <button onClick={() => onFilterChange({ phoneType: 'ALL' })} className="hover:text-emerald-950">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {filters.quickTag !== 'ALL' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 border border-rose-200">
                <span>หมวดด่วน: {filters.quickTag}</span>
                <button onClick={() => onFilterChange({ quickTag: 'ALL' })} className="hover:text-rose-950">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {filters.onlyFavorites && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 border border-amber-200">
                <span>เฉพาะเบอร์ติดดาว</span>
                <button onClick={() => onFilterChange({ onlyFavorites: false })} className="hover:text-amber-950">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>

          <div className="font-semibold text-teal-800">
            พบ <span className="font-mono text-sm">{totalFiltered}</span> รายการ (จากทั้งหมด {totalCount})
          </div>
        </div>
      )}

    </div>
  );
};
