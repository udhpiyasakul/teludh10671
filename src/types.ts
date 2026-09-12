export interface UDHPhoneRecord {
  id: number;
  building: string;
  floor: string;
  category: string;
  unit: string;
  phone: string;
  phoneType: 'เบอร์ภายใน' | 'เบอร์สายนอก' | string;
  note: string;
  tags: string[];
}

export type ViewMode = 'table' | 'grid' | 'grouped' | 'speedDial';

export interface FilterState {
  searchQuery: string;
  building: string;
  floor: string;
  category: string;
  phoneType: string;
  quickTag: string;
  onlyFavorites: boolean;
  sortBy: 'id' | 'unit' | 'phone' | 'building' | 'floor';
  sortOrder: 'asc' | 'desc';
}

export interface BuildingStat {
  building: string;
  count: number;
  internalCount: number;
  externalCount: number;
  floors: string[];
  color: string;
}

export interface EmergencyQuickDial {
  name: string;
  unit: string;
  phone: string;
  building: string;
  floor: string;
  note?: string;
  icon: string;
  badgeColor: string;
  description: string;
}
