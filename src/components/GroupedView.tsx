import React, { useState } from 'react';
import { 
  Building2, 
  Layers, 
  ChevronDown, 
  ChevronUp, 
  Phone, 
  Copy, 
  Check, 
  Star, 
  PhoneCall 
} from 'lucide-react';
import { UDHPhoneRecord } from '../types';
import { BUILDING_COLORS } from '../data/constants';
import { getCallablePhoneHref, getDialTooltip } from '../utils/phoneUtils';

interface GroupedViewProps {
  records: UDHPhoneRecord[];
  favorites: Set<number>;
  onToggleFavorite: (id: number) => void;
  onCopyPhone: (phone: string, unit: string) => void;
  copiedPhone: string | null;
  searchQuery: string;
}

export const GroupedView: React.FC<GroupedViewProps> = ({
  records,
  favorites,
  onToggleFavorite,
  onCopyPhone,
  copiedPhone,
  searchQuery
}) => {
  // State for expanded buildings
  const [expandedBuildings, setExpandedBuildings] = useState<Record<string, boolean>>({});

  // Group records by building, then by floor
  const groupedData: Record<string, Record<string, UDHPhoneRecord[]>> = {};

  records.forEach((record) => {
    if (!groupedData[record.building]) {
      groupedData[record.building] = {};
    }
    if (!groupedData[record.building][record.floor]) {
      groupedData[record.building][record.floor] = [];
    }
    groupedData[record.building][record.floor].push(record);
  });

  const buildings = Object.keys(groupedData);

  const toggleBuilding = (building: string) => {
    setExpandedBuildings((prev) => ({
      ...prev,
      [building]: prev[building] === undefined ? false : !prev[building]
    }));
  };

  const expandAll = () => {
    const allExpanded: Record<string, boolean> = {};
    buildings.forEach((b) => (allExpanded[b] = true));
    setExpandedBuildings(allExpanded);
  };

  const collapseAll = () => {
    const allCollapsed: Record<string, boolean> = {};
    buildings.forEach((b) => (allCollapsed[b] = false));
    setExpandedBuildings(allCollapsed);
  };

  if (buildings.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
        <h3 className="text-base font-bold text-slate-800 mb-1">ไม่พบข้อมูลอาคาร</h3>
        <p className="text-xs text-slate-500">กรุณาลองเปลี่ยนคำค้นหาหรือตัวกรอง</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Expand/Collapse All Toolbar */}
      <div className="flex items-center justify-between px-2">
        <span className="text-xs font-semibold text-slate-600">
          พบข้อมูล {buildings.length} อาคาร ({records.length} หมายเลข)
        </span>
        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={expandAll}
            className="px-2.5 py-1 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg text-slate-700 font-medium cursor-pointer"
          >
            เปิดทั้งหมด
          </button>
          <button
            onClick={collapseAll}
            className="px-2.5 py-1 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg text-slate-700 font-medium cursor-pointer"
          >
            พับทั้งหมด
          </button>
        </div>
      </div>

      {/* Buildings List */}
      <div className="space-y-3">
        {buildings.map((building) => {
          const floors = Object.keys(groupedData[building]);
          const totalInBuilding = floors.reduce((acc, f) => acc + groupedData[building][f].length, 0);
          const isExpanded = expandedBuildings[building] !== false; // default expanded
          const buildingStyle = BUILDING_COLORS[building] || {
            bg: 'bg-slate-50',
            border: 'border-slate-200',
            badge: 'bg-slate-100 text-slate-800 border-slate-200'
          };

          return (
            <div
              key={building}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden transition-all"
            >
              {/* Building Header Accordion Button */}
              <button
                onClick={() => toggleBuilding(building)}
                className={`w-full px-4 py-3.5 flex items-center justify-between text-left transition-colors cursor-pointer border-b ${
                  isExpanded ? `${buildingStyle.bg} ${buildingStyle.border}` : 'bg-slate-50 hover:bg-slate-100/80 border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-white/80 border border-slate-200/80 shadow-2xs text-slate-700">
                    <Building2 className="w-5 h-5 text-teal-700" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                      <span>{building}</span>
                      <span className="text-xs font-mono font-medium px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 border border-teal-200">
                        {totalInBuilding} หมายเลข
                      </span>
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      มีทั้งหมด {floors.length} ชั้น / โซน
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-slate-500">
                  <span className="text-xs hidden sm:inline">
                    {isExpanded ? 'คลิกเพื่อพับ' : 'คลิกเพื่อเปิดดู'}
                  </span>
                  {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </div>
              </button>

              {/* Floors & Extensions Content */}
              {isExpanded && (
                <div className="p-4 space-y-4">
                  {floors.map((floor) => {
                    const floorRecords = groupedData[building][floor];

                    return (
                      <div key={floor} className="bg-slate-50/60 rounded-xl border border-slate-200/70 p-3">
                        {/* Floor Label */}
                        <div className="flex items-center gap-2 mb-2.5 pb-1.5 border-b border-slate-200/60">
                          <Layers className="w-4 h-4 text-blue-600" />
                          <h4 className="text-xs font-bold text-slate-800">
                            {floor}
                          </h4>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-200 text-slate-700 font-mono font-semibold">
                            {floorRecords.length} เบอร์
                          </span>
                        </div>

                        {/* Extensions Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                          {floorRecords.map((item) => {
                            const isFavorite = favorites.has(item.id);
                            const isCopied = copiedPhone === item.phone;

                            return (
                              <div
                                key={item.id}
                                className="bg-white p-2.5 rounded-lg border border-slate-200/80 hover:border-teal-400/80 shadow-2xs flex items-center justify-between gap-2 group transition-all"
                              >
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center gap-1.5">
                                    <button
                                      onClick={() => onToggleFavorite(item.id)}
                                      className="text-slate-300 hover:text-amber-500 shrink-0 cursor-pointer"
                                    >
                                      <Star className={`w-3.5 h-3.5 ${isFavorite ? 'text-amber-400 fill-amber-400' : ''}`} />
                                    </button>
                                    <span className="text-xs font-semibold text-slate-800 truncate">
                                      {item.unit}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-500">
                                    {item.category && item.category !== 'ทั่วไป' && (
                                      <span className="truncate">{item.category}</span>
                                    )}
                                    {item.note && (
                                      <span className="text-amber-700 font-medium truncate">({item.note})</span>
                                    )}
                                  </div>
                                </div>

                                <div className="flex items-center gap-1.5 shrink-0">
                                  <span className="font-mono text-xs font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                                    {item.phone}
                                  </span>
                                  <button
                                    onClick={() => onCopyPhone(item.phone, item.unit)}
                                    className={`p-1 rounded border transition-all cursor-pointer ${
                                      isCopied
                                        ? 'bg-emerald-500 text-white border-emerald-600'
                                        : 'bg-white hover:bg-slate-100 text-slate-500 border-slate-200'
                                    }`}
                                    title="คัดลอก"
                                  >
                                    {isCopied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                  </button>
                                  <a
                                    href={getCallablePhoneHref(item.phone)}
                                    className="p-1 rounded bg-teal-600 hover:bg-teal-700 text-white transition-all"
                                    title={getDialTooltip(item.phone, item.unit)}
                                  >
                                    <PhoneCall className="w-3 h-3" />
                                  </a>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
