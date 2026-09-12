import { EmergencyQuickDial } from '../types';

export const MAIN_HOSPITAL_LINES = [
  {
    phone: '042-215100',
    rawPhone: '042215100',
    name: 'เบอร์หลัก รพ.อุดรธานี (สาย 1)',
    note: 'สายหลักภายนอก'
  },
  {
    phone: '042-245555',
    rawPhone: '042245555',
    name: 'เบอร์หลัก รพ.อุดรธานี (สาย 2)',
    note: 'สายหลักภายนอก'
  }
];

export const OPERATOR_EXTENSIONS = [
  { ext: '0', name: 'โอเปอเรเตอร์ (ติดต่อเจ้าหน้าที่/ต่อสาย)', note: 'กด 0' },
  { ext: '1000', name: 'โอเปอเรเตอร์ ประชาสัมพันธ์ (สาย 1)', note: 'กด 1000' },
  { ext: '1001', name: 'โอเปอเรเตอร์ ประชาสัมพันธ์ (สาย 2)', note: 'กด 1001' },
  { ext: '1002', name: 'โอเปอเรเตอร์ ประชาสัมพันธ์ (สาย 3)', note: 'กด 1002' },
];

export const EMERGENCY_NUMBERS: EmergencyQuickDial[] = [
  {
    name: 'เบอร์หลัก รพ.อุดรธานี (สาย 1)',
    unit: 'เบอร์โทรศัพท์หลัก รพ.อุดรธานี (สาย 1)',
    phone: '042-215100',
    building: 'อาคารผู้ป่วยนอกและอำนวยการ',
    floor: 'ชั้น 1',
    note: 'Operator กด 0, 1000, 1001, 1002',
    icon: 'Phone',
    badgeColor: 'bg-teal-700 text-white',
    description: 'หมายเลขโทรศัพท์หลักโรงพยาบาลอุดรธานี'
  },
  {
    name: 'เบอร์หลัก รพ.อุดรธานี (สาย 2)',
    unit: 'เบอร์โทรศัพท์หลัก รพ.อุดรธานี (สาย 2)',
    phone: '042-245555',
    building: 'อาคารผู้ป่วยนอกและอำนวยการ',
    floor: 'ชั้น 1',
    note: 'Operator กด 0, 1000, 1001, 1002',
    icon: 'Phone',
    badgeColor: 'bg-teal-700 text-white',
    description: 'หมายเลขโทรศัพท์หลักโรงพยาบาลอุดรธานี'
  },
  {
    name: 'โอเปอเรเตอร์ (Operator ต่อสาย)',
    unit: 'โอเปอเรเตอร์ ประชาสัมพันธ์ ต่อสายภายใน',
    phone: '0',
    building: 'อาคารผู้ป่วยนอกและอำนวยการ',
    floor: 'ชั้น 1',
    note: 'กด 0, 1000, 1001, 1002',
    icon: 'Headphones',
    badgeColor: 'bg-cyan-700 text-white',
    description: 'พนักงานรับสาย ประชาสัมพันธ์ ต่อสายภายใน'
  },
  {
    name: 'ศูนย์สั่งการ กู้ชีพ 1669',
    unit: 'ศูนย์สั่งการ กู้ชีพ 1669',
    phone: '3124',
    building: 'อาคารผู้ป่วยนอกและอำนวยการ',
    floor: 'ชั้น 1',
    note: 'กู้ชีพและเหตุฉุกเฉิน',
    icon: 'Ambulance',
    badgeColor: 'bg-rose-500 text-white',
    description: 'สั่งการกู้ชีพฉุกเฉิน 1669 รับแจ้งเหตุ 24 ชม.'
  },
  {
    name: 'ศูนย์ส่งต่อ REFER (ฉุกเฉิน)',
    unit: 'ศูนย์ส่งต่อ REFER',
    phone: '3115',
    building: 'อาคารผู้ป่วยนอกและอำนวยการ',
    floor: 'ชั้น 1',
    note: 'FAX: 042-248261',
    icon: 'ArrowUpRight',
    badgeColor: 'bg-rose-600 text-white',
    description: 'ประสานรับ-ส่งต่อผู้ป่วยวิกฤต/ฉุกเฉิน'
  },
  {
    name: 'ศูนย์ส่งต่อ REFER (สำรอง)',
    unit: 'ศูนย์ส่งต่อ REFER',
    phone: '1143',
    building: 'อาคารผู้ป่วยนอกและอำนวยการ',
    floor: 'ชั้น 1',
    note: 'FAX: 042-248261',
    icon: 'PhoneForwarded',
    badgeColor: 'bg-rose-600 text-white',
    description: 'สายตรงศูนย์ประสานส่งต่อผู้ป่วย'
  },
  {
    name: 'เคลื่อนย้ายผู้ป่วย (ศูนย์เปล)',
    unit: 'เคลื่อนย้ายผู้ป่วยสัมพันธ์ (ศูนย์เปล)',
    phone: '1135',
    building: 'เคลื่อนย้ายผู้ป่วยสัมพันธ์ (ศูนย์เปล)',
    floor: 'ไม่ระบุ',
    note: 'ศูนย์เปลทั่วไป',
    icon: 'Accessibility',
    badgeColor: 'bg-amber-600 text-white',
    description: 'เรียกรถเข็น/เปลรับส่งผู้ป่วยภายในโรงพยาบาล'
  },
  {
    name: 'ศูนย์เปลด่วน (กรณีฉุกเฉิน)',
    unit: 'เคลื่อนย้ายผู้ป่วยสัมพันธ์ (ศูนย์เปลด่วน)',
    phone: '1491',
    building: 'เคลื่อนย้ายผู้ป่วยสัมพันธ์ (ศูนย์เปล)',
    floor: 'ไม่ระบุ',
    note: 'เคสด่วนวิกฤต',
    icon: 'Zap',
    badgeColor: 'bg-amber-700 text-white',
    description: 'บริการเปลด่วนสำหรับผู้ป่วยวิกฤตและเคสเร่งด่วน'
  },
  {
    name: 'จุดคัดกรอง ER (Screen ER)',
    unit: 'จุดคัดกรองคนไข้ (Screen ER)',
    phone: '3150',
    building: 'อาคารผู้ป่วยนอกและอำนวยการ',
    floor: 'ชั้น 1',
    note: 'Screen ER',
    icon: 'ShieldAlert',
    badgeColor: 'bg-red-500 text-white',
    description: 'คัดแยกความรุนแรงผู้ป่วยอุบัติเหตุ-ฉุกเฉิน'
  },
  {
    name: 'ฉุกเฉิน Red Zone (โซนสีแดง)',
    unit: 'Red Zone',
    phone: '3143',
    building: 'อาคารผู้ป่วยนอกและอำนวยการ',
    floor: 'ชั้น 1',
    note: 'ผู้ป่วยวิกฤตฉุกเฉินสูงสุด',
    icon: 'Flame',
    badgeColor: 'bg-red-700 text-white',
    description: 'ห้องช่วยชีวิต Resuscitation Red Zone'
  },
  {
    name: 'หอผู้ป่วยอุบัติเหตุ-ฉุกเฉิน AE WARD',
    unit: 'หอผู้ป่วยอุบัติเหตุ-ฉุกเฉิน AE WARD',
    phone: '3112',
    building: 'อาคารผู้ป่วยนอกและอำนวยการ',
    floor: 'ชั้น 1',
    note: 'หอสังเกตอาการฉุกเฉิน',
    icon: 'Bed',
    badgeColor: 'bg-orange-600 text-white',
    description: 'หอผู้ป่วยอุบัติเหตุและฉุกเฉิน'
  },
  {
    name: 'ธนาคารเลือด (Blood Bank)',
    unit: 'ธนาคารเลือด',
    phone: '1251',
    building: 'ตึก OR เก่า',
    floor: 'ไม่ระบุ',
    note: 'บริการโลหิต 24 ชม.',
    icon: 'Droplet',
    badgeColor: 'bg-red-600 text-white',
    description: 'เบิกจ่ายเลือดและส่วนประกอบของเลือดฉุกเฉิน'
  },
  {
    name: 'ห้องคลอด (Labor Room)',
    unit: 'ห้องคลอด',
    phone: '1331',
    building: 'อาคารสูติ-นรีเวชกรรม',
    floor: 'ชั้น 1',
    note: 'ห้องคลอด 24 ชม.',
    icon: 'HeartPulse',
    badgeColor: 'bg-pink-600 text-white',
    description: 'รับคลอดและดูแลมารดาคลอดฉุกเฉิน'
  },
  {
    name: 'ศูนย์ประสานงานโรคหัวใจ',
    unit: 'ศูนย์ประสานงานโรคหัวใจ',
    phone: '4700',
    building: 'อาคารศูนย์เชี่ยวชาญ (EXCELLENT CENTER)',
    floor: 'ชั้น 7',
    note: 'Fast Track STEMI / หัวใจ',
    icon: 'HeartHandshake',
    badgeColor: 'bg-rose-700 text-white',
    description: 'ศูนย์ประสานงานผู้ป่วยโรคหัวใจและหลอดเลือด'
  },
  {
    name: 'ห้องตรวจสวนหัวใจ CATH LAB',
    unit: 'ห้องตรวจสวนหัวใจ CATH LAB',
    phone: '4605',
    building: 'อาคารศูนย์เชี่ยวชาญ (EXCELLENT CENTER)',
    floor: 'ชั้น 6',
    note: 'CATH LAB ด่วน',
    icon: 'Activity',
    badgeColor: 'bg-rose-800 text-white',
    description: 'ห้องปฏิบัติการสวนหัวใจและหลอดเลือด'
  },
  {
    name: 'ประชาสัมพันธ์ โรงพยาบาล',
    unit: 'จุดคัดกรองคนไข้(ประชาสัมพันธ์)',
    phone: '3236',
    building: 'อาคารผู้ป่วยนอกและอำนวยการ',
    floor: 'ชั้น 1',
    note: 'สอบถามข้อมูลทั่วไป',
    icon: 'HelpCircle',
    badgeColor: 'bg-sky-600 text-white',
    description: 'เคาน์เตอร์ต้อนรับ ประชาสัมพันธ์ และข้อมูลแผนก'
  },
  {
    name: 'ศูนย์คอมพิวเตอร์ / IT ซ่อม',
    unit: 'ช่างซ่อมคอมพิวเตอร์',
    phone: '1485',
    building: 'กลุ่มงานสารสนเทศทางการแพทย์(งานศูนย์คอมพิวเตอร์)',
    floor: 'ไม่ระบุ',
    note: 'แจ้งปัญหาไอที/ระบบเครือข่าย',
    icon: 'Monitor',
    badgeColor: 'bg-indigo-600 text-white',
    description: 'งานสารสนเทศทางการแพทย์และแจ้งซ่อมระบบ'
  },
  {
    name: 'สำนักงาน รปภ. / เหตุการณ์ทั่วไป',
    unit: 'สำนักงาน รปภ.',
    phone: '1187',
    building: 'ตึก OR เก่า',
    floor: 'ไม่ระบุ',
    note: 'รักษาความปลอดภัย',
    icon: 'Shield',
    badgeColor: 'bg-slate-700 text-white',
    description: 'ศูนย์รักษาความปลอดภัยและระงับเหตุฉุกเฉิน'
  },
  {
    name: 'ห้องกล้องวงจรปิด CCTV',
    unit: 'ห้องกล้องวงจรปิด',
    phone: '1411',
    building: 'ตึก OR เก่า',
    floor: 'ไม่ระบุ',
    note: 'ตรวจสอบกล้องวงจรปิด',
    icon: 'Video',
    badgeColor: 'bg-slate-800 text-white',
    description: 'ศูนย์ควบคุมกล้องวงจรปิดทั่วทั้งโรงพยาบาล'
  }
];

export const BUILDING_COLORS: Record<string, { bg: string; text: string; border: string; badge: string; accent: string }> = {
  'อาคารผู้ป่วยนอกและอำนวยการ': {
    bg: 'bg-teal-50',
    text: 'text-teal-900',
    border: 'border-teal-200',
    badge: 'bg-teal-100 text-teal-800 border-teal-200',
    accent: '#0d9488'
  },
  'อาคารศูนย์เชี่ยวชาญ (EXCELLENT CENTER)': {
    bg: 'bg-blue-50',
    text: 'text-blue-900',
    border: 'border-blue-200',
    badge: 'bg-blue-100 text-blue-800 border-blue-200',
    accent: '#2563eb'
  },
  'อาคาร 69 ปี โรงพยาบาลอุดรธานี': {
    bg: 'bg-emerald-50',
    text: 'text-emerald-900',
    border: 'border-emerald-200',
    badge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    accent: '#059669'
  },
  'อาคาร 96 ปี หลวงตามหาบัว': {
    bg: 'bg-amber-50',
    text: 'text-amber-900',
    border: 'border-amber-200',
    badge: 'bg-amber-100 text-amber-800 border-amber-200',
    accent: '#d97706'
  },
  'อาคารศัลยคารอุตราทร': {
    bg: 'bg-rose-50',
    text: 'text-rose-900',
    border: 'border-rose-200',
    badge: 'bg-rose-100 text-rose-800 border-rose-200',
    accent: '#e11d48'
  },
  'อาคารสูติ-นรีเวชกรรม': {
    bg: 'bg-pink-50',
    text: 'text-pink-900',
    border: 'border-pink-200',
    badge: 'bg-pink-100 text-pink-800 border-pink-200',
    accent: '#db2777'
  },
  'อาคารผู้ป่วยนอก OPD เก่า': {
    bg: 'bg-cyan-50',
    text: 'text-cyan-900',
    border: 'border-cyan-200',
    badge: 'bg-cyan-100 text-cyan-800 border-cyan-200',
    accent: '#0891b2'
  },
  'ตึก OR เก่า': {
    bg: 'bg-indigo-50',
    text: 'text-indigo-900',
    border: 'border-indigo-200',
    badge: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    accent: '#4f46e5'
  },
  'อาคารศูนย์แพทย์ศาสตร์': {
    bg: 'bg-purple-50',
    text: 'text-purple-900',
    border: 'border-purple-200',
    badge: 'bg-purple-100 text-purple-800 border-purple-200',
    accent: '#7c3aed'
  },
  'ตึกพยาธิวิทยาคลินิก': {
    bg: 'bg-violet-50',
    text: 'text-violet-900',
    border: 'border-violet-200',
    badge: 'bg-violet-100 text-violet-800 border-violet-200',
    accent: '#8b5cf6'
  },
  'ตึกเวชกรรมสังคม-อาชีวเวชกรรม': {
    bg: 'bg-lime-50',
    text: 'text-lime-900',
    border: 'border-lime-200',
    badge: 'bg-lime-100 text-lime-800 border-lime-200',
    accent: '#65a30d'
  },
  'กลุ่มงานสารสนเทศทางการแพทย์(งานศูนย์คอมพิวเตอร์)': {
    bg: 'bg-sky-50',
    text: 'text-sky-900',
    border: 'border-sky-200',
    badge: 'bg-sky-100 text-sky-800 border-sky-200',
    accent: '#0284c7'
  },
  'เคลื่อนย้ายผู้ป่วยสัมพันธ์ (ศูนย์เปล)': {
    bg: 'bg-orange-50',
    text: 'text-orange-900',
    border: 'border-orange-200',
    badge: 'bg-orange-100 text-orange-800 border-orange-200',
    accent: '#ea580c'
  }
};

export const QUICK_TAGS = [
  { id: 'ALL', label: 'ทั้งหมด', icon: 'LayoutGrid' },
  { id: 'ฉุกเฉิน/ER', label: 'ฉุกเฉิน & ER', icon: 'ShieldAlert', color: 'bg-rose-100 text-rose-800 border-rose-200' },
  { id: 'ผู้ป่วยวิกฤต/ICU', label: 'ICU & วิกฤต', icon: 'Activity', color: 'bg-red-100 text-red-800 border-red-200' },
  { id: 'ห้องผ่าตัด/OR', label: 'ห้องผ่าตัด & OR', icon: 'Scissors', color: 'bg-amber-100 text-amber-800 border-amber-200' },
  { id: 'ห้องยา/เภสัช', label: 'ห้องยา & เภสัช', icon: 'Pill', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
  { id: 'แล็บ/รังสี/ตรวจพิเศษ', label: 'Lab & เอกซเรย์', icon: 'FlaskConical', color: 'bg-purple-100 text-purple-800 border-purple-200' },
  { id: 'ศูนย์เปล/ส่งต่อ', label: 'ศูนย์เปล & ส่งต่อ', icon: 'Accessibility', color: 'bg-orange-100 text-orange-800 border-orange-200' },
  { id: 'ห้องบัตร/การเงิน/สิทธิ์', label: 'ห้องบัตร & การเงิน', icon: 'CreditCard', color: 'bg-blue-100 text-blue-800 border-blue-200' },
  { id: 'ห้องตรวจ/คลินิก', label: 'ห้องตรวจ & OPD', icon: 'Stethoscope', color: 'bg-teal-100 text-teal-800 border-teal-200' },
  { id: 'หอผู้ป่วย/IPD', label: 'หอผู้ป่วย & IPD', icon: 'Bed', color: 'bg-cyan-100 text-cyan-800 border-cyan-200' },
  { id: 'สนับสนุน/บริหาร', label: 'ธุรการ & ช่าง/รปภ.', icon: 'Wrench', color: 'bg-slate-100 text-slate-800 border-slate-200' }
];
