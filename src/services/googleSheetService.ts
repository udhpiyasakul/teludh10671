import { UDHPhoneRecord } from '../types';
import { RAW_DEFAULT_CSV } from '../data/rawCsvData';

export const STORAGE_KEY_SHEET_URL = 'udh_google_sheet_url';
export const STORAGE_KEY_LAST_SYNC = 'udh_google_sheet_last_sync';
export const STORAGE_KEY_CACHED_DATA = 'udh_google_sheet_cached_records';

/**
 * Embedded official Google Sheet URL for UDH Phone Directory
 */
export const DEFAULT_GOOGLE_SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTUxSKjIwJnqTnQl9GXczSgjOgHZi1Y2FVxmdVg5YiCqF119VUaGBcXq6X4QK9YSMar1co5NCImDIB-/pub?output=csv';
export const DEFAULT_GOOGLE_SHEET_VIEW_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTUxSKjIwJnqTnQl9GXczSgjOgHZi1Y2FVxmdVg5YiCqF119VUaGBcXq6X4QK9YSMar1co5NCImDIB-/pubhtml';

/**
 * Assigns smart tags corresponding to QUICK_TAGS in constants.ts
 */
export function assignQuickTags(
  unit: string, 
  category: string, 
  note: string, 
  building: string
): string[] {
  const text = `${unit} ${category} ${note} ${building}`.toLowerCase();
  const tags: string[] = [];

  // Emergency / ER
  if (
    text.includes('ฉุกเฉิน') || 
    text.includes('1669') || 
    text.includes('กู้ชีพ') || 
    text.includes('er') || 
    text.includes('อุบัติเหตุ') || 
    text.includes('refer') || 
    text.includes('red zone') || 
    text.includes('pink zone') || 
    text.includes('yellow zone') || 
    text.includes('screen er') ||
    text.includes('observe')
  ) {
    tags.push('ฉุกเฉิน/ER');
  }

  // ICU & Critical Care
  if (
    text.includes('icu') || 
    text.includes('ccu') || 
    text.includes('วิกฤต') || 
    text.includes('semi icu') || 
    text.includes('ผู้ป่วยหนัก') ||
    text.includes('stroke unit')
  ) {
    tags.push('ผู้ป่วยวิกฤต/ICU');
  }

  // Operating Room & Anesthesia
  if (
    text.includes('ผ่าตัด') || 
    text.includes('or ') || 
    text.includes(' or') || 
    text.includes('วิสัญญี') || 
    text.includes('ดมยา') || 
    text.includes('pre-op') || 
    text.includes('udsc')
  ) {
    tags.push('ห้องผ่าตัด/OR');
  }

  // Pharmacy & Medications
  if (
    text.includes('ห้องยา') || 
    text.includes('จ่ายยา') || 
    text.includes('เภสัช') || 
    text.includes('stock ยา') || 
    text.includes('แพ้ยา') || 
    text.includes('ผลิตยา') || 
    text.includes('tpn') ||
    text.includes('คลังยา')
  ) {
    tags.push('ห้องยา/เภสัช');
  }

  // Lab, Radiology & Special Diagnostics
  if (
    text.includes('lab') || 
    text.includes('ตรวจเลือด') || 
    text.includes('รังสี') || 
    text.includes('เอกซเรย์') || 
    text.includes('x-ray') || 
    text.includes('ct ') || 
    text.includes('ct scan') || 
    text.includes('mri') || 
    text.includes('อัลตราซาวด์') || 
    text.includes('พยาธิ') || 
    text.includes('ชันสูตร') || 
    text.includes('เลือด') || 
    text.includes('ธนาคารเลือด') ||
    text.includes('ชิ้นเนื้อ') ||
    text.includes('ชีวโมเลกุล')
  ) {
    tags.push('แล็บ/รังสี/ตรวจพิเศษ');
  }

  // Patient Transport & Referral
  if (
    text.includes('ศูนย์เปล') || 
    text.includes('เคลื่อนย้าย') || 
    text.includes('ส่งต่อ') || 
    text.includes('refer')
  ) {
    tags.push('ศูนย์เปล/ส่งต่อ');
  }

  // Registration, Billing, Social Work & Insurance
  if (
    text.includes('ห้องบัตร') || 
    text.includes('เคาท์เตอร์บัตร') || 
    text.includes('ลงทะเบียน') || 
    text.includes('การเงิน') || 
    text.includes('ประกัน') || 
    text.includes('เคลม') || 
    text.includes('ตรวจสอบสิทธิ์') || 
    text.includes('สิทธิ์เบิกได้') || 
    text.includes('บัญชี') ||
    text.includes('สังคมสงเคราะห์')
  ) {
    tags.push('ห้องบัตร/การเงิน/สิทธิ์');
  }

  // OPD & Clinics
  if (
    text.includes('ห้องตรวจ') || 
    text.includes('คลินิก') || 
    text.includes('คลินิค') || 
    text.includes('opd') || 
    text.includes('ซักประวัติ') || 
    text.includes('คัดกรอง') || 
    text.includes('หัตถการ') ||
    text.includes('ทันตกรรม') ||
    text.includes('กายภาพบำบัด') ||
    text.includes('ฝังเข็ม') ||
    text.includes('ไตเทียม')
  ) {
    tags.push('ห้องตรวจ/คลินิก');
  }

  // IPD & Wards
  if (
    text.includes('หอผู้ป่วย') || 
    text.includes('ward') || 
    text.includes('ห้องพิเศษ') || 
    text.includes('สงฆ์') || 
    text.includes('ทารก') ||
    text.includes('หลังคลอด')
  ) {
    tags.push('หอผู้ป่วย/IPD');
  }

  // Admin & Support
  if (
    text.includes('บริหาร') || 
    text.includes('ธุรการ') || 
    text.includes('ช่าง') || 
    text.includes('สารบรรณ') || 
    text.includes('รปภ.') || 
    text.includes('คอมพิวเตอร์') || 
    text.includes('ไอที') || 
    text.includes('โสต') || 
    text.includes('เวชระเบียน') || 
    text.includes('แม่บ้าน') || 
    text.includes('ยานพาหนะ') || 
    text.includes('นิติกร') ||
    text.includes('วิศวกรรม') ||
    text.includes('กล้องวงจรปิด')
  ) {
    tags.push('สนับสนุน/บริหาร');
  }

  return tags;
}

/**
 * Robust CSV parser supporting quotes, commas, and newlines inside cells
 */
export function parseCsvRows(text: string): string[][] {
  // Remove UTF-8 BOM if present
  const cleanText = text.charCodeAt(0) === 0xfeff ? text.slice(1) : text;
  const rows: string[][] = [];
  let row: string[] = [];
  let token = '';
  let inQuotes = false;

  for (let i = 0; i < cleanText.length; i++) {
    const char = cleanText[i];
    const nextChar = cleanText[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        token += '"';
        i++; // skip escaped quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      row.push(token.trim());
      token = '';
    } else if ((char === '\r' || char === '\n') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') {
        i++; // skip LF after CR
      }
      row.push(token.trim());
      // Only push non-empty rows
      if (row.some(c => c.length > 0)) {
        rows.push(row);
      }
      row = [];
      token = '';
    } else {
      token += char;
    }
  }

  if (token.length > 0 || row.length > 0) {
    row.push(token.trim());
    if (row.some(c => c.length > 0)) {
      rows.push(row);
    }
  }

  return rows;
}

/**
 * Parses CSV text into UDHPhoneRecord array
 */
export function parseSheetCsv(csvText: string): UDHPhoneRecord[] {
  const rows = parseCsvRows(csvText);
  if (rows.length === 0) return [];

  // Determine column mapping by checking header row
  const header = rows[0].map(h => h.toLowerCase().trim());
  let colId = 0;
  let colBuilding = 1;
  let colFloor = 2;
  let colCategory = 3;
  let colUnit = 4;
  let colPhone = 5;
  let colPhoneType = 6;
  let colNote = 7;

  // Try to find matching columns dynamically if headers exist
  header.forEach((h, idx) => {
    if (h.includes('ลำดับ') || h.includes('id') || h.includes('no')) colId = idx;
    else if (h.includes('อาคาร') || h.includes('building')) colBuilding = idx;
    else if (h.includes('ชั้น') || h.includes('floor')) colFloor = idx;
    else if (h.includes('กลุ่มงาน') || h.includes('หมวดหมู่') || h.includes('category') || h.includes('department')) colCategory = idx;
    else if (h.includes('หน่วยงาน') || h.includes('ชื่อห้อง') || h.includes('unit') || h.includes('room') || h.includes('name')) colUnit = idx;
    else if (h.includes('โทรศัพท์') || h.includes('เบอร์') || h.includes('phone') || h.includes('tel') || h.includes('ext')) colPhone = idx;
    else if (h.includes('ประเภท') || h.includes('type')) colPhoneType = idx;
    else if (h.includes('หมายเหตุ') || h.includes('note') || h.includes('remark')) colNote = idx;
  });

  const records: UDHPhoneRecord[] = [];
  const startIdx = 1; // Skip header

  for (let i = startIdx; i < rows.length; i++) {
    const r = rows[i];
    // Need at least unit and phone
    const unit = r[colUnit] || r[4] || '';
    const phone = r[colPhone] || r[5] || '';
    if (!unit && !phone) continue;

    const building = r[colBuilding] || r[1] || 'ไม่ระบุ';
    const floor = r[colFloor] || r[2] || 'ไม่ระบุ';
    const rawCategory = r[colCategory] || r[3] || '-';
    const category = (!rawCategory || rawCategory === '-') ? 'ทั่วไป' : rawCategory;
    const phoneTypeRaw = r[colPhoneType] || r[6] || '';
    const phoneType: 'เบอร์ภายใน' | 'เบอร์สายนอก' = 
      phoneTypeRaw.includes('นอก') || phone.length >= 9 || phone.startsWith('0')
        ? 'เบอร์สายนอก' 
        : 'เบอร์ภายใน';
    const rawNote = r[colNote] || r[7] || '';
    const note = (!rawNote || rawNote === '-') ? '' : rawNote;

    const parsedId = parseInt(r[colId], 10);
    const recordId = !isNaN(parsedId) ? parsedId : i;
    const tags = assignQuickTags(unit, category, note, building);

    records.push({
      id: recordId,
      building,
      floor,
      category,
      unit,
      phone,
      phoneType,
      note,
      tags
    });
  }

  // Prepend main hospital lines if they aren't in the dataset
  const hasMainLine = records.some(r => r.phone.includes('042-215100') || r.phone.includes('042215100'));
  if (!hasMainLine && records.length > 0) {
    records.unshift(
      {
        id: 9001,
        building: 'อาคารผู้ป่วยนอกและอำนวยการ',
        floor: 'ชั้น 1',
        category: 'สายหลักโรงพยาบาล',
        unit: 'เบอร์หลักโรงพยาบาลอุดรธานี (สาย 1)',
        phone: '042-215100',
        phoneType: 'เบอร์สายนอก',
        note: 'Operator กด 0, 1000, 1001, 1002',
        tags: ['ฉุกเฉิน/ER', 'สนับสนุน/บริหาร']
      },
      {
        id: 9002,
        building: 'อาคารผู้ป่วยนอกและอำนวยการ',
        floor: 'ชั้น 1',
        category: 'สายหลักโรงพยาบาล',
        unit: 'เบอร์หลักโรงพยาบาลอุดรธานี (สาย 2)',
        phone: '042-245555',
        phoneType: 'เบอร์สายนอก',
        note: 'Operator กด 0, 1000, 1001, 1002',
        tags: ['ฉุกเฉิน/ER', 'สนับสนุน/บริหาร']
      }
    );
  }

  return records;
}

/**
 * Parses the embedded default CSV dataset
 */
export function getDefaultRecords(): UDHPhoneRecord[] {
  return parseSheetCsv(RAW_DEFAULT_CSV);
}

/**
 * Normalizes any Google Sheet link into a direct CSV export / publish link
 */
export function normalizeGoogleSheetUrl(inputUrl: string): { 
  fetchUrl: string; 
  editUrl: string; 
  sheetId?: string;
  isPublishToWeb: boolean 
} {
  const trimmed = inputUrl.trim();
  if (!trimmed) {
    return { fetchUrl: '', editUrl: '', isPublishToWeb: false };
  }

  // 1. Published link: https://docs.google.com/spreadsheets/d/e/{PUBLISHED_ID}/pub?output=csv
  if (trimmed.includes('/pub?output=csv') || trimmed.includes('/pub?gid=') || trimmed.includes('/pub#')) {
    let fetchUrl = trimmed;
    if (!fetchUrl.includes('output=csv')) {
      fetchUrl += (fetchUrl.includes('?') ? '&' : '?') + 'output=csv';
    }
    const editUrl = trimmed.includes('/pub?output=csv')
      ? trimmed.replace('/pub?output=csv', '/pubhtml')
      : (trimmed.includes('/pub?') ? trimmed.split('/pub?')[0] + '/pubhtml' : trimmed);
    return { fetchUrl, editUrl, isPublishToWeb: true };
  }

  // 2. Published HTML: https://docs.google.com/spreadsheets/d/e/{PUBLISHED_ID}/pubhtml
  if (trimmed.includes('/pubhtml')) {
    const base = trimmed.split('/pubhtml')[0];
    const fetchUrl = `${base}/pub?output=csv`;
    return { fetchUrl, editUrl: trimmed, isPublishToWeb: true };
  }

  // 3. Standard Edit link: https://docs.google.com/spreadsheets/d/{SHEET_ID}/edit...
  const match = trimmed.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  if (match && match[1]) {
    const sheetId = match[1];
    
    // Extract gid if present
    let gid = '0';
    const gidMatch = trimmed.match(/[#&?]gid=([0-9]+)/);
    if (gidMatch && gidMatch[1]) {
      gid = gidMatch[1];
    }

    const fetchUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid}`;
    const editUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/edit#gid=${gid}`;
    return { fetchUrl, editUrl, sheetId, isPublishToWeb: false };
  }

  // 4. Any other raw CSV URL
  return { fetchUrl: trimmed, editUrl: trimmed, isPublishToWeb: false };
}

/**
 * Fetches CSV content with multi-strategy fallback (direct -> CORS proxy)
 */
export async function fetchGoogleSheetCsv(url: string): Promise<string> {
  const { fetchUrl } = normalizeGoogleSheetUrl(url);
  if (!fetchUrl) {
    throw new Error('กรุณาระบุลิงก์ Google Sheet');
  }

  // Strategy 1: Direct fetch (works immediately for "Publish to Web" CSV)
  try {
    const response = await fetch(fetchUrl, {
      method: 'GET',
      headers: {
        'Accept': 'text/csv, text/plain, */*'
      },
      cache: 'no-cache'
    });

    if (response.ok) {
      const text = await response.text();
      // Check if it returned HTML instead of CSV (e.g. login page or preview page)
      if (text.includes('<!DOCTYPE html') || text.includes('<html')) {
        throw new Error('Google Sheet ยังไม่ได้เปิดแชร์เป็น "ทุกคนที่มีลิงก์มีสิทธิ์ดู" หรือยังไม่ได้เลือก "เผยแพร่ไปยังเว็บ"');
      }
      return text;
    }
  } catch (err: any) {
    // If it was already our custom error, rethrow
    if (err.message && err.message.includes('Google Sheet')) {
      throw err;
    }
    // Otherwise continue to fallback proxy
  }

  // Strategy 2: Proxy via allorigins (for spreadsheets exported without "Publish to web" but public view)
  try {
    const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(fetchUrl)}`;
    const response = await fetch(proxyUrl, { cache: 'no-cache' });
    if (response.ok) {
      const text = await response.text();
      if (text.includes('<!DOCTYPE html') || text.includes('<html')) {
        throw new Error('Google Sheet ปลายทางไม่สามารถเข้าถึงได้ โปรดตรวจสอบการตั้งค่าแชร์ หรือใช้ฟังก์ชัน "เผยแพร่ไปยังเว็บ" (Publish to web) เป็น CSV');
      }
      return text;
    }
  } catch (proxyErr: any) {
    // Both failed
  }

  throw new Error('ไม่สามารถดึงข้อมูลจาก Google Sheet ได้ โปรดใช้เมนู "ไฟล์" -> "แชร์" -> "เผยแพร่ไปยังเว็บ" (Publish to web) เลือกแผ่นงานและเลือกประเภทเป็น "ค่าที่คั่นด้วยเครื่องหมายจุลภาค (.csv)"');
}

/**
 * Storage Helpers
 */
export function getSavedSheetUrl(): string {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_SHEET_URL);
    if (saved && saved.trim()) {
      return saved.trim();
    }
    return DEFAULT_GOOGLE_SHEET_URL;
  } catch {
    return DEFAULT_GOOGLE_SHEET_URL;
  }
}

export function saveSheetUrl(url: string): void {
  try {
    localStorage.setItem(STORAGE_KEY_SHEET_URL, url.trim());
  } catch {
    // ignore
  }
}

export function getSavedLastSync(): string {
  try {
    return localStorage.getItem(STORAGE_KEY_LAST_SYNC) || '';
  } catch {
    return '';
  }
}

export function saveLastSync(timeStr: string): void {
  try {
    localStorage.setItem(STORAGE_KEY_LAST_SYNC, timeStr);
  } catch {
    // ignore
  }
}

export function getCachedRecords(): UDHPhoneRecord[] | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CACHED_DATA);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

export function saveCachedRecords(records: UDHPhoneRecord[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_CACHED_DATA, JSON.stringify(records));
  } catch {
    // ignore
  }
}
