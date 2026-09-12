import { UDHPhoneRecord } from '../types';

export function exportToCSV(records: UDHPhoneRecord[], filename = 'udh_phone_directory.csv') {
  const headers = ['ลำดับ', 'อาคาร', 'ชั้น', 'กลุ่มงาน_หมวดหมู่', 'หน่วยงาน_ชื่อห้อง', 'หมายเลขโทรศัพท์', 'ประเภทหมายเลข', 'หมายเหตุ'];
  
  const rows = records.map((r, index) => [
    index + 1,
    `"${r.building.replace(/"/g, '""')}"`,
    `"${r.floor.replace(/"/g, '""')}"`,
    `"${r.category.replace(/"/g, '""')}"`,
    `"${r.unit.replace(/"/g, '""')}"`,
    `"${r.phone}"`,
    `"${r.phoneType}"`,
    `"${(r.note || '-').replace(/"/g, '""')}"`
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(row => row.join(','))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
