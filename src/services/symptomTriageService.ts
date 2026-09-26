import { UDHPhoneRecord } from '../types';

export type TriageUrgency = 'emergency' | 'urgent' | 'routine';

export interface SymptomRule {
  id: string;
  name: string;
  departmentName: string;
  urgency: TriageUrgency;
  urgencyLabel: string;
  description: string;
  advice: string;
  keywords: string[];
  unitMatchTerms: string[];
  preferredBuilding?: string;
  preferredFloor?: string;
  emergencyAction?: string;
}

export interface TriageResult {
  query: string;
  primaryMatch: SymptomRule | null;
  secondaryMatches: SymptomRule[];
  matchedRecords: UDHPhoneRecord[];
  allRelatedRecords: UDHPhoneRecord[];
  urgency: TriageUrgency;
  advice: string;
  isEmergencyAlert: boolean;
}

export const SYMPTOM_RULES: SymptomRule[] = [
  {
    id: 'emergency_critical',
    name: 'อุบัติเหตุ-ฉุกเฉิน วิกฤต / สโตรก / หัวใจวาย',
    departmentName: 'ศูนย์สั่งการกู้ชีพ 1669 / แผนกอุบัติเหตุ-ฉุกเฉิน (ER)',
    urgency: 'emergency',
    urgencyLabel: 'ฉุกเฉินวิกฤต (ต้องพบแพทย์ทันที 24 ชม.)',
    description: 'อุบัติเหตุรุนแรง เลือดออกมาก หมดสติ แขนขาอ่อนแรง ปากเบี้ยว ชัก หรือเจ็บแน่นหน้าอกรุนแรง',
    advice: 'หากผู้ป่วยหมดสติ ไม่รู้สึกตัว หรือมีอาการหลอดเลือดสมอง (ปากเบี้ยว พูดไม่ชัด แขนขาตก) ให้โทรแจ้งศูนย์สั่งการ 1669 ทันทีเพื่อส่งทีมกู้ชีพ อย่าเคลื่อนย้ายผู้ป่วยเองหากสงสัยกระดูกสันหลังบาดเจ็บ',
    keywords: [
      'ฉุกเฉิน', 'อุบัติเหตุ', 'รถชน', 'รถล้ม', 'เลือดออกมาก', 'หมดสติ', 'ไม่รู้สึกตัว', 
      'ชัก', 'สโตรก', 'stroke', 'ปากเบี้ยว', 'แขนขาอ่อนแรง', 'พูดไม่ชัด', 'ชาครึ่งซีก', 
      'หัวใจหยุดเต้น', 'หยุดหายใจ', 'สำลัก', 'จมน้ำ', 'ไฟไหม้รุนแรง', '1669', 'กู้ชีพ', 
      'วิกฤต', 'er', 'red zone'
    ],
    unitMatchTerms: ['1669', 'กู้ชีพ', 'ฉุกเฉิน', 'Screen ER', 'Red Zone', 'Yellow Zone', 'AE WARD', 'REFER'],
    preferredBuilding: 'อาคารผู้ป่วยนอกและอำนวยการ',
    preferredFloor: 'ชั้น 1',
    emergencyAction: 'โทรด่วน 1669 หรือต่อสายฉุกเฉิน ER 3124 / 3143 / 3150 ทันที'
  },
  {
    id: 'cardio',
    name: 'โรคหัวใจ แน่นหน้าอก ใจสั่น หายใจลำบาก',
    departmentName: 'ห้องตรวจหัวใจและทรงอก / หอผู้ป่วย CCU',
    urgency: 'urgent',
    urgencyLabel: 'เร่งด่วน (ควรตรวจหรือประเมินทันที)',
    description: 'แน่นหน้าอก เจ็บหน้าอกร้าวไปกรามหรือแขนซ้าย ใจสั่น หัวใจเต้นผิดจังหวะ เหนื่อยนอนราบไม่ได้',
    advice: 'หลีกเลี่ยงการออกแรง ให้นั่งพักในท่าที่หายใจสะดวก หากมีอาการเจ็บแน่นกลางอกรุนแรงเหมือนของหนักทับ ให้รีบเดินทางมาที่แผนกฉุกเฉิน (ER) ทันที พกยาประจำตัวที่ใช้อยู่มาด้วย',
    keywords: [
      'แน่นหน้าอก', 'เจ็บหน้าอก', 'เจ็บอก', 'ใจสั่น', 'เหนื่อยง่าย', 'หัวใจเต้นเร็ว', 
      'หัวใจเต้นผิดปกติ', 'นอนราบไม่ได้', 'หายใจไม่ออก', 'โรคหัวใจ', 'หลอดเลือดหัวใจ', 
      'กล้ามเนื้อหัวใจ', 'ccu', 'ทรงอก'
    ],
    unitMatchTerms: ['ห้องตรวจหัวใจและทรงอก', 'หัวใจ', 'CCU', 'Chesmed', 'Observe'],
    preferredBuilding: 'อาคารผู้ป่วยนอกและอำนวยการ',
    preferredFloor: 'ชั้น 1'
  },
  {
    id: 'ortho',
    name: 'กระดูกและข้อ / อุบัติเหตุกล้ามเนื้อ',
    departmentName: 'ห้องตรวจกระดูกและข้อ (ออร์โธปิดิกส์) / ห้องใส่เฝือก',
    urgency: 'routine',
    urgencyLabel: 'ทั่วไป - เร่งด่วนตามอาการ',
    description: 'กระดูกหัก ข้อเท้าแพลง ปวดเข่า ปวดหลัง ปวดสะโพก เอ็นฉีกขาด หรือตรวจมวลกระดูก',
    advice: 'หากมีกระดูกหักผิดรูป ให้ดามอวัยวะให้อยู่นิ่งและหลีกเลี่ยงการลงน้ำหนัก ประคบเย็นหากเพิ่งเกิดอุบัติเหตุไม่เกิน 48 ชม. ติดต่อเคาน์เตอร์ลงทะเบียนห้องตรวจกระดูก อาคารอำนวยการ',
    keywords: [
      'กระดูกหัก', 'แขนหัก', 'ขาหัก', 'ข้อเท้าพลิก', 'ข้อเท้าแพลง', 'ปวดเข่า', 'เข่าเสื่อม', 
      'ปวดหลัง', 'หมอนรองกระดูก', 'กระดูกทับเส้น', 'ปวดข้อ', 'ข้อมือซ้น', 'เอ็นฉีก', 
      'มวลกระดูก', 'กระดูกพรุน', 'ออร์โธ', 'เฝือก'
    ],
    unitMatchTerms: ['ห้องตรวจกระดูก', 'ห้องตรวจกระดูก 1', 'มวลกระดูก BMD', 'ศัลยกรรมกระดูก', 'เฝือก'],
    preferredBuilding: 'อาคารผู้ป่วยนอกและอำนวยการ',
    preferredFloor: 'ชั้น 1 หรือ 2'
  },
  {
    id: 'medicine',
    name: 'อายุรกรรมทั่วไป / ไข้หวัด / โรคเรื้อรัง',
    departmentName: 'ห้องตรวจอายุรกรรม 1-8 / คลินิก ARI ทางเดินหายใจ',
    urgency: 'routine',
    urgencyLabel: 'ตรวจทั่วไป (ตามคิวตรวจ)',
    description: 'ไข้สูง หวัด ไอ เจ็บคอ เสมหะ ปวดศีรษะ ปวดท้อง ท้องเสีย เบาหวาน ความดัน ไขมัน โรคทั่วไป',
    advice: 'ผู้ป่วยที่มีอาการไอ จาม มีน้ำมูก กรุณาสวมหน้ากากอนามัย นำบัตรประชาชนและประวัติการใช้ยาเดิมมาด้วย หากมาตรวจเลือดคัดกรองเบาหวาน-ไขมัน ควรงดน้ำและอาหารหลัง 20:00 น. ก่อนวันตรวจ',
    keywords: [
      'ไข้', 'ตัวร้อน', 'หวัด', 'ไอ', 'เจ็บคอ', 'มีน้ำมูก', 'เสมหะ', 'ปวดหัว', 'ปวดศีรษะ', 
      'เวียนหัว', 'บ้านหมุน', 'ปวดท้อง', 'ท้องเสีย', 'ถ่ายเหลว', 'เบาหวาน', 'ความดัน', 
      'ไขมันในเลือด', 'อ่อนเพลีย', 'เบื่ออาหาร', 'อายุรกรรม', 'opd'
    ],
    unitMatchTerms: ['ห้องตรวจอายุรกรรม', 'Chesmed', 'COPD', 'ส่องปอด', 'ตรวจอายุรกรรมคลินิกพิเศษ'],
    preferredBuilding: 'อาคารผู้ป่วยนอกและอำนวยการ',
    preferredFloor: 'ชั้น 1 หรือ 2'
  },
  {
    id: 'surgery',
    name: 'ศัลยกรรมทั่วไป / ผ่าตัด / ทางเดินอาหาร',
    departmentName: 'ห้องตรวจศัลยกรรม 1-2 / ห้องผ่าตัดเล็ก',
    urgency: 'routine',
    urgencyLabel: 'ตรวจทั่วไป - นัดหมายผ่าตัด',
    description: 'ปวดท้องเฉียบพลัน ไส้ติ่ง ลำไส้อุดตัน มีก้อนเนื้อ ถุงน้ำ แผลเรื้อรัง ริดสีดวงทวาร ผ่าตัดไส้เลื่อน',
    advice: 'หากมีอาการปวดท้องรุนแรงด้านขวาล่างหรือปวดเกร็งร่วมกับมีไข้ ห้ามรับประทานยาระบายและงดน้ำงดอาหารทันทีเพื่อเตรียมพร้อมตรวจวินิจฉัยศัลยกรรมหรือผ่าตัดฉุกเฉิน',
    keywords: [
      'ผ่าตัด', 'ศัลยกรรม', 'ไส้ติ่ง', 'ก้อนเนื้อ', 'ถุงน้ำดี', 'นิ่ว', 'ไส้เลื่อน', 
      'ริดสีดวง', 'แผลผ่าตัด', 'แผลติดเชื้อ', 'เย็บแผล', 'ตัดไหม', 'ฝี', 'หนอง', 
      'ผ่าตัดเล็ก', 'หัตถการ'
    ],
    unitMatchTerms: ['ห้องตรวจศัลยกรรม 1', 'ห้องตรวจศัลยกรรม 2', 'ห้องผ่าตัดเล็ก', 'ห้องตรวจหัตถการ', 'ห้องตรวจศัลยกรรมตกแต่ง'],
    preferredBuilding: 'อาคารผู้ป่วยนอกและอำนวยการ',
    preferredFloor: 'ชั้น 1'
  },
  {
    id: 'urology',
    name: 'ศัลยกรรมทางเดินปัสสาวะ / โรคไต',
    departmentName: 'ห้องตรวจศัลยกรรมทางเดินปัสสาวะ / คลินิกไตเทียม',
    urgency: 'routine',
    urgencyLabel: 'ตรวจทั่วไป',
    description: 'ปัสสาวะขัด ปัสสาวะเป็นเลือด ปัสสาวะไม่ออก นิ่วในทางเดินปัสสาวะ ต่อมลูกหมากโต หรือฟอกไต',
    advice: 'ควรสังเกตสีและปริมาณปัสสาวะ หากปัสสาวะไม่ออกเลย ปวดท้องน้อยรุนแรง หรือมีไข้หนาวสั่น ควรพบแพทย์โดยเร็ว',
    keywords: [
      'ปัสสาวะไม่ออก', 'ฉี่ไม่ออก', 'ปัสสาวะขัด', 'ฉี่แสบขัด', 'ปัสสาวะเป็นเลือด', 'ฉี่เป็นเลือด', 
      'นิ่วในกระเพาะปัสสาวะ', 'นิ่วในไต', 'ต่อมลูกหมาก', 'ทางเดินปัสสาวะ', 'ฟอกไต', 'ไตวาย', 'บวมน้ำ'
    ],
    unitMatchTerms: ['ห้องตรวจศัลยกรรมทางเดินปัสสาวะ', 'ไตเทียม', 'โรคไต'],
    preferredBuilding: 'อาคารผู้ป่วยนอกและอำนวยการ',
    preferredFloor: 'ชั้น 1 หรือ 4'
  },
  {
    id: 'pediatrics',
    name: 'กุมารเวชกรรม (คลินิกเด็กและทารก)',
    departmentName: 'คลินิกกุมารเวชกรรม / ห้องตรวจโรคเด็ก / คลินิกสุขภาพเด็กดี',
    urgency: 'routine',
    urgencyLabel: 'ตรวจโรคเด็ก / นัดหมายฉีดวัคซีน',
    description: 'เด็กมีไข้ ไอ หอบ ชัก ท้องเสีย ทารกตัวเหลือง ฉีดวัคซีนพัฒนาการ และโรคในเด็กแรกเกิดถึง 15 ปี',
    advice: 'หากเด็กมีไข้สูงเกิน 38.5 องศาเซลเซียส ให้เช็ดตัวลดไข้ด้วยน้ำอุณหภูมิห้องทันทีเพื่อป้องกันอาการชัก นำสมุดบันทึกสุขภาพแม่และเด็ก (สมุดสีชมพู) ติดตัวมาด้วยทุกครั้ง',
    keywords: [
      'เด็ก', 'ทารก', 'ลูกป่วย', 'เด็กมีไข้', 'เด็กตัวร้อน', 'เด็กไอ', 'เด็กชัก', 
      'ฉีดวัคซีนเด็ก', 'วัคซีน', 'พัฒนาการเด็ก', 'ตัวเหลือง', 'กุมาร', 'นมผง', 'ทารกแรกเกิด'
    ],
    unitMatchTerms: ['กุมาร', 'เด็ก', 'วัคซีน', 'ทารกแรกเกิด', 'NICU', 'PICU'],
    preferredBuilding: 'อาคารผู้ป่วยนอกและอำนวยการ หรือ อาคารเด็ก',
    preferredFloor: 'ชั้น 2 หรือ 3'
  },
  {
    id: 'obgyn',
    name: 'สูติ-นรีเวชกรรม / ฝากครรภ์ / คลอดบุตร',
    departmentName: 'ห้องตรวจสูตินรีเวช / คลินิกฝากครรภ์ / ห้องคลอด',
    urgency: 'routine',
    urgencyLabel: 'ตรวจสูติ-นรีเวช (คลอดฉุกเฉินพบห้องคลอด 24 ชม.)',
    description: 'ตั้งครรภ์ ฝากครรภ์ เจ็บครรภ์คลอด น้ำเดิน ตกขาวผิดปกติ ปวดประจำเดือน ตรวจมะเร็งปากมดลูก วางแผนครอบครัว',
    advice: 'หญิงตั้งครรภ์หากมีอาการน้ำเดิน มีมูกเลือด หรือเจ็บครรภ์สม่ำเสมอทุก 5-10 นาที ให้ตรงไปที่ห้องคลอดทันทีโดยไม่ต้องรอคิว OPD เตรียมสมุดฝากครรภ์และบัตรประชาชน',
    keywords: [
      'ท้อง', 'ตั้งครรภ์', 'ฝากครรภ์', 'คลอด', 'ห้องคลอด', 'เจ็บท้องคลอด', 'น้ำเดิน', 
      'มูกเลือด', 'ตกขาว', 'ปวดท้องน้อย', 'ประจำเดือนไม่มา', 'เมนส์ไม่มา', 'เลือดออกทางช่องคลอด', 
      'มะเร็งปากมดลูก', 'สูติ', 'นรีเวช', 'คุมกำเนิด', 'ยาคุม'
    ],
    unitMatchTerms: ['ตรวจสูตินรีเวช', 'ห้องคลอด', 'ฝากครรภ์', 'สูติ', 'นรีเวช', 'หลังคลอด'],
    preferredBuilding: 'อาคารผู้ป่วยนอกและอำนวยการ',
    preferredFloor: 'ชั้น 2 หรือ 3'
  },
  {
    id: 'eye',
    name: 'จักษุวิทยา (ห้องตรวจตา)',
    departmentName: 'ห้องตรวจตา (OPD จักษุ) 1-4',
    urgency: 'routine',
    urgencyLabel: 'ตรวจโรคตา / วัดสายตา',
    description: 'ตาแดง เจ็บตา เคืองตา ตามัว ตาพร่า ต้อกระจก ต้อหิน ขนตาทิ่มตา มีสิ่งแปลกปลอมเข้าตา สารเคมีเข้าตา',
    advice: 'หากมีสารเคมีเข้าตา ให้รีบล้างตาด้วยน้ำสะอาดไหลผ่านปริมาณมากๆ อย่างน้อย 15-20 นาทีทันทีแล้วรีบมาพบแพทย์ ห้ามขยี้ตาเด็ดขาด หากมีนัดขยายม่านตา ควรมีญาติพามาด้วยเนื่องจากตาจะพร่ามัวขับรถไม่ได้',
    keywords: [
      'ตา', 'ตาแดง', 'เจ็บตา', 'ตามัว', 'ตาพร่า', 'มองไม่ชัด', 'เคืองตา', 
      'ขี้ตาเยอะ', 'ต้อกระจก', 'ต้อหิน', 'ต้อเนื้อ', 'ต้อลม', 'สารเคมีเข้าตา', 
      'เศษเหล็กเข้าตา', 'วัดสายตา', 'จักษุ'
    ],
    unitMatchTerms: ['ห้องตรวจตา', 'ห้องตรวจตา 4', 'จักษุ', 'ศูนย์ตา'],
    preferredBuilding: 'อาคารผู้ป่วยนอกและอำนวยการ',
    preferredFloor: 'ชั้น 2 หรือ 3'
  },
  {
    id: 'ent',
    name: 'โสต ศอ นาสิก (หู คอ จมูก)',
    departmentName: 'ห้องตรวจโสต ศอ นาสิก (หู คอ จมูก)',
    urgency: 'routine',
    urgencyLabel: 'ตรวจหู คอ จมูก',
    description: 'ปวดหู มีน้ำหนองไหลจากหู หูอื้อ ได้ยินไม่ชัด คัดจมูกเรื้อรัง ไซนัส เลือดกำเดาไหล ก้างปลาติดคอ เสียงแหบ มีก้อนที่คอ',
    advice: 'หากมีก้างปลาหรือสิ่งแปลกปลอมติดคอ ห้ามกลืนก้อนข้าวเหนียวหรืออาหารแข็งเพราะอาจทำให้ก้างแทงลึกขึ้น ให้ดื่มน้ำเปล่าและรีบมาพบแพทย์เพื่อคีบออกอย่างปลอดภัย',
    keywords: [
      'หู', 'ปวดหู', 'หูอื้อ', 'หนองไหลจากหู', 'คัดจมูก', 'น้ำมูกไหล', 'ไซนัส', 
      'เลือดกำเดา', 'ก้างติดคอ', 'เจ็บคอเรื้อรัง', 'เสียงแหบ', 'ก้อนที่คอ', 
      'ต่อมทอนซิล', 'โสต', 'นาสิก'
    ],
    unitMatchTerms: ['โสต', 'หู คอ จมูก', 'นาสิก', 'ENT'],
    preferredBuilding: 'อาคารผู้ป่วยนอกและอำนวยการ',
    preferredFloor: 'ชั้น 2'
  },
  {
    id: 'dental',
    name: 'ทันตกรรม (ฟันและช่องปาก)',
    departmentName: 'กลุ่มงานทันตกรรม / ห้องตรวจทันตกรรม',
    urgency: 'routine',
    urgencyLabel: 'ตรวจรักษาฟัน (ตามคิวหรือนัดหมาย)',
    description: 'ปวดฟัน ฟันผุ เหงือกบวม อักเสบ เลือดออกตามไรฟัน ถอนฟัน อุดฟัน ขูดหินปูน ผ่าฟันคุด รักษารากฟัน ทำฟันปลอม',
    advice: 'ผู้ป่วยที่มีโรคประจำตัวหรือรับประทานยาละลายลิ่มเลือด (Aspirin, Warfarin) ต้องแจ้งทันตแพทย์ก่อนทำหัตถการถอนฟันหรือผ่าตัดทุกครั้ง',
    keywords: [
      'ปวดฟัน', 'ฟันผุ', 'ฟันคุด', 'ถอนฟัน', 'อุดฟัน', 'ขูดหินปูน', 'เหงือกบวม', 
      'เลือดออกตามไรฟัน', 'รักษารากฟัน', 'ทำฟัน', 'ฟันปลอม', 'จัดฟัน', 'ทันตกรรม', 'หมอฟัน'
    ],
    unitMatchTerms: ['ทันตกรรม', 'ทันตกรรม 1', 'ทันตกรรม 2', 'ห้องฟัน', 'งานทันตกรรม'],
    preferredBuilding: 'อาคารทันตกรรม หรือ อาคารผู้ป่วยนอก',
    preferredFloor: 'ชั้น 2'
  },
  {
    id: 'dermatology',
    name: 'ผิวหนังและภูมิแพ้',
    departmentName: 'ห้องตรวจผิวหนัง / คลินิกภูมิแพ้',
    urgency: 'routine',
    urgencyLabel: 'ตรวจโรคผิวหนัง',
    description: 'ผื่นคัน ลมพิษ แผลพุพอง สะเก็ดเงิน เริม งูสวัด ตุ่มน้ำใส สิวอักเสบเรื้อรัง ผมร่วง เล็บผิดปกติ',
    advice: 'หลีกเลี่ยงการเกาหรือแกะแผลเพราะอาจทำให้ติดเชื้อแบคทีเรียแทรกซ้อน ถ่ายรูปผื่นในระยะแรกไว้ให้แพทย์ดูประกอบการวินิจฉัยหากผื่นยุบๆ พองๆ',
    keywords: [
      'ผื่น', 'ผื่นคัน', 'ลมพิษ', 'คัน', 'ผิวหนัง', 'สะเก็ดเงิน', 'เริม', 'งูสวัด', 
      'แผลพุพอง', 'ตุ่มน้ำ', 'สิว', 'ผมร่วง', 'แพ้ยา', 'ภูมิแพ้ผิวหนัง'
    ],
    unitMatchTerms: ['ผิวหนัง', 'คลินิกผิวหนัง', 'อายุรกรรม'],
    preferredBuilding: 'อาคารผู้ป่วยนอกและอำนวยการ',
    preferredFloor: 'ชั้น 2'
  },
  {
    id: 'psychiatry',
    name: 'จิตเวชและสุขภาพจิต / ยาเสพติด',
    departmentName: 'กลุ่มงานจิตเวชและยาเสพติด / สายด่วนสุขภาพจิต',
    urgency: 'routine',
    urgencyLabel: 'ปรึกษาสุขภาพจิต (มีห้องตรวจเฉพาะทาง)',
    description: 'เครียด วิตกกังวล นอนไม่หลับ ซึมเศร้า ไม่อยากมีชีวิตอยู่ อารมณ์แปรปรวน หูแว่ว เห็นภาพหลอน เลิกยาเสพติด เลิกสุรา',
    advice: 'หากมีความคิดทำร้ายตนเองหรือรู้สึกไม่ไหว ให้ติดต่อเจ้าหน้าที่ทันที หรือโทรสายด่วนสุขภาพจิต 1323 (โทรฟรี 24 ชม.) โรงพยาบาลมีทีมจิตแพทย์และนักจิตวิทยาพร้อมดูแลด้วยความลับ',
    keywords: [
      'เครียด', 'นอนไม่หลับ', 'วิตกกังวล', 'ซึมเศร้า', 'เศร้า', 'ไม่อยากอยู่', 'หมดพลัง', 
      'อารมณ์แปรปรวน', 'แพนิค', 'panic', 'หูแว่ว', 'ภาพหลอน', 'จิตเวช', 'เลิกเหล้า', 
      'เลิกยา', 'ยาเสพติด', 'สุขภาพจิต'
    ],
    unitMatchTerms: ['จิตเวช', 'สุขภาพจิต', 'ยาเสพติด', 'กลุ่มงานจิตเวช'],
    preferredBuilding: 'อาคารจิตเวช หรือ ตึกอำนวยการ',
    preferredFloor: 'ชั้น 2 หรือ 3'
  },
  {
    id: 'rehab',
    name: 'เวชศาสตร์ฟื้นฟู / กายภาพบำบัด',
    departmentName: 'ห้องตรวจเวชกรรมฟื้นฟู / กลุ่มงานกายภาพบำบัด',
    urgency: 'routine',
    urgencyLabel: 'ตรวจเวชศาสตร์ฟื้นฟู / ทำกายภาพ',
    description: 'อัมพฤกษ์ อัมพาต แขนขาไม่มีแรง ฟื้นฟูหลังผ่าตัด กายภาพบำบัด ปวดกล้ามเนื้อเรื้อรัง ออฟฟิศซินโดรม',
    advice: 'แต่งกายด้วยเสื้อผ้าที่หลวมสบาย เคลื่อนไหวสะดวก หากเป็นผู้ป่วยฝึกเดินหรือนั่งรถเข็น ควรมีญาติหรือผู้ดูแลร่วมมาด้วย',
    keywords: [
      'กายภาพ', 'กายภาพบำบัด', 'ฟื้นฟู', 'อัมพฤกษ์', 'อัมพาต', 'แขนขาอ่อนแรงเรื้อรัง', 
      'ฝึกเดิน', 'ฝึกพูด', 'ออฟฟิศซินโดรม', 'ปวดกล้ามเนื้อเรื้อรัง', 'เวชกรรมฟื้นฟู'
    ],
    unitMatchTerms: ['ห้องตรวจเวชกรรมฟื้นฟู', 'กายภาพบำบัด', 'เวชกรรมฟื้นฟู'],
    preferredBuilding: 'อาคารผู้ป่วยนอกและอำนวยการ หรือ อาคารฟื้นฟู',
    preferredFloor: 'ชั้น 1 หรือ 2'
  },
  {
    id: 'registration_card',
    name: 'งานทำบัตร / ตรวจสอบสิทธิ / ประชาสัมพันธ์',
    departmentName: 'เคาท์เตอร์บัตร ลงทะเบียนห้องตรวจ / ประชาสัมพันธ์',
    urgency: 'routine',
    urgencyLabel: 'งานบริการทะเบียนและสิทธิการรักษา',
    description: 'เปิดบัตรผู้ป่วยใหม่ ขอคิวตรวจ ตรวจสอบสิทธิบัตรทอง ประกันสังคม ข้าราชการ ส่งต่อใบส่งตัว หรือสอบถามเส้นทาง',
    advice: 'นำบัตรประชาชนตัวจริง (หรือสูติบัตรสำหรับเด็ก) มาแสดงที่เคาน์เตอร์ลงทะเบียนชั้น 1 หากมีใบส่งตัวจาก รพ.ต้นทาง หรือใบรับรองสิทธิ ให้เตรียมมาพร้อมกัน',
    keywords: [
      'ทำบัตร', 'เปิดบัตร', 'บัตรใหม่', 'ลงทะเบียน', 'คัดกรอง', 'บัตรทอง', '30 บาท', 
      'ประกันสังคม', 'ข้าราชการ', 'ใบส่งตัว', 'ตรวจสอบสิทธิ', 'ประชาสัมพันธ์', 'ถามทาง', 
      'เคาน์เตอร์บัตร', 'จุดคัดกรอง'
    ],
    unitMatchTerms: ['เคาท์เตอร์บัตร', 'ลงทะบียน', 'จุดคัดกรอง', 'ประชาสัมพันธ์', 'สิทธิ'],
    preferredBuilding: 'อาคารผู้ป่วยนอกและอำนวยการ',
    preferredFloor: 'ชั้น 1'
  },
  {
    id: 'lab_xray',
    name: 'ห้องแล็บ / ตรวจเลือด / รังสีวินิจฉัย (X-Ray)',
    departmentName: 'ห้องตรวจเลือดผู้ป่วยนอก Lab OPD / กลุ่มงานรังสีวิทยา',
    urgency: 'routine',
    urgencyLabel: 'บริการชันสูตรและภาพถ่ายรังสี',
    description: 'เจาะเลือด ตรวจปัสสาวะ ตรวจเสมหะ ตรวจเลือดหาเบาหวาน เอ็กซเรย์ปอด X-ray กระดูก อัลตราซาวด์ CT Scan MRI',
    advice: 'กรุณาตรวจสอบว่ามีใบสั่งตรวจจากแพทย์หรือไม่ หากมีการตรวจระดับน้ำตาลหรือไขมันในเลือด ควรงดอาหารและเครื่องดื่ม (ดื่มน้ำเปล่าได้) ล่วงหน้า 8-12 ชั่วโมง',
    keywords: [
      'เจาะเลือด', 'ตรวจเลือด', 'ตรวจปัสสาวะ', 'แล็บ', 'lab', 'เอ็กซเรย์', 'x-ray', 
      'xray', 'ct scan', 'mri', 'อัลตราซาวด์', 'รังสี', 'ชันสูตร'
    ],
    unitMatchTerms: ['ห้องตรวจเลือดผู้ป่วยนอก Lab OPD', 'Lab', 'แล็บ', 'รังสี', 'เอ็กซเรย์', 'X-Ray'],
    preferredBuilding: 'อาคารผู้ป่วยนอกและอำนวยการ',
    preferredFloor: 'ชั้น 1 หรือ 2'
  }
];

export const POPULAR_SYMPTOM_PRESETS = [
  { label: '🤒 ไข้ หวัด ไอ เจ็บคอ', text: 'มีไข้สูง หวัด ไอ เจ็บคอ มีเสมหะ' },
  { label: '💔 แน่นหน้าอก ใจสั่น', text: 'แน่นหน้าอก ใจสั่น เหนื่อยง่าย หายใจไม่ออก' },
  { label: '🚨 อุบัติเหตุ เลือดออก', text: 'อุบัติเหตุ รถล้ม เลือดออกมาก แผลฉีกขาด' },
  { label: '🦷 ปวดฟัน เหงือกบวม', text: 'ปวดฟันมาก เหงือกบวม อยากถอนฟันหรืออุดฟัน' },
  { label: '🦴 กระดูกหัก ข้อเท้าแพลง', text: 'ข้อเท้าพลิก บวม ปวดกระดูก ขาหัก เดินไม่ได้' },
  { label: '👶 เด็กป่วย ตัวร้อน', text: 'ลูกมีไข้สูง เด็กตัวร้อน ไอ มีน้ำมูก' },
  { label: '🤰 ฝากครรภ์ ตรวจสูติ', text: 'ตั้งครรภ์ ฝากครรภ์ ตรวจภายใน ปวดท้องน้อย' },
  { label: '👁️ ตาแดง ตามัว', text: 'ตาแดง เคืองตา ขี้ตาเยอะ มองไม่ชัด ตามัว' },
  { label: '👂 ปวดหู คัดจมูก', text: 'ปวดหู มีน้ำหนองไหล คัดจมูกเรื้อรัง เจ็บคอ' },
  { label: '🧠 เครียด นอนไม่หลับ', text: 'เครียด วิตกกังวล นอนไม่หลับ ซึมเศร้า' },
  { label: '🪪 ทำบัตรใหม่ เช็คสิทธิ', text: 'เปิดบัตรผู้ป่วยใหม่ ตรวจสอบสิทธิบัตรทอง ประกันสังคม' },
  { label: '🧪 เจาะเลือด ตรวจแล็บ', text: 'เจาะเลือด ตรวจสุขภาพ เอกซเรย์ปอด' }
];

/**
 * Intelligent Symptom Matching Algorithm
 * Analyzes spoken or typed Thai text and finds appropriate hospital units and guidance.
 */
export function triageSymptomQuery(
  rawQuery: string, 
  records: UDHPhoneRecord[]
): TriageResult {
  const query = (rawQuery || '').trim().toLowerCase();
  
  if (!query) {
    return {
      query: '',
      primaryMatch: null,
      secondaryMatches: [],
      matchedRecords: [],
      allRelatedRecords: [],
      urgency: 'routine',
      advice: 'กรุณาพูดบอกอาการเบื้องต้น หรือพิมพ์ข้อความอาการ เพื่อให้ระบบค้นหาและแนะนำห้องตรวจที่เหมาะสม',
      isEmergencyAlert: false
    };
  }

  // 1. Check if the query is a 4-digit extension or phone number
  const numericOnly = query.replace(/[^0-9]/g, '');
  if (numericOnly.length >= 3 && numericOnly.length <= 10) {
    const directPhoneMatches = records.filter(r => 
      r.phone.replace(/[^0-9]/g, '').includes(numericOnly)
    );
    if (directPhoneMatches.length > 0) {
      return {
        query,
        primaryMatch: {
          id: 'phone_direct',
          name: `ค้นหาด้วยหมายเลข "${numericOnly}"`,
          departmentName: directPhoneMatches[0].unit,
          urgency: 'routine',
          urgencyLabel: 'ค้นหาด้วยหมายเลขโทรศัพท์',
          description: `พบ ${directPhoneMatches.length} หน่วยงานที่ตรงกับหมายเลขนี้`,
          advice: 'ท่านสามารถกดโทรออก หรือคัดลอกหมายเลข 4 หลักเพื่อติดต่อห้องตรวจหรือหน่วยงานได้ทันที',
          keywords: [numericOnly],
          unitMatchTerms: [directPhoneMatches[0].unit],
          preferredBuilding: directPhoneMatches[0].building,
          preferredFloor: directPhoneMatches[0].floor
        },
        secondaryMatches: [],
        matchedRecords: directPhoneMatches,
        allRelatedRecords: directPhoneMatches,
        urgency: 'routine',
        advice: `พบหน่วยงานตรงกับหมายเลข ${numericOnly} แนะนำติดต่อ ${directPhoneMatches[0].unit} อาคาร ${directPhoneMatches[0].building} ชั้น ${directPhoneMatches[0].floor}`,
        isEmergencyAlert: false
      };
    }
  }

  // 2. Score each symptom rule
  const scoredRules = SYMPTOM_RULES.map(rule => {
    let score = 0;
    
    // Keyword match
    for (const kw of rule.keywords) {
      const lowerKw = kw.toLowerCase();
      if (query.includes(lowerKw)) {
        score += lowerKw.length > 3 ? 15 : 10;
      }
    }

    // Name match
    if (query.includes(rule.name.toLowerCase())) {
      score += 25;
    }

    // Direct department match
    if (query.includes(rule.departmentName.toLowerCase())) {
      score += 30;
    }

    return { rule, score };
  }).filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score);

  const primaryRule = scoredRules.length > 0 ? scoredRules[0].rule : null;
  const secondaryRules = scoredRules.slice(1, 3).map(s => s.rule);

  // 3. Find matching real records from UDH phone database
  let matchedRecords: UDHPhoneRecord[] = [];

  if (primaryRule) {
    matchedRecords = records.filter(record => {
      const unitText = `${record.unit} ${record.building} ${record.category || ''} ${record.note || ''}`.toLowerCase();
      return primaryRule.unitMatchTerms.some(term => unitText.includes(term.toLowerCase()));
    });
  }

  // Also search records directly by query tokens
  const queryTokens = query.split(/\s+/).filter(t => t.length >= 2);
  const directRecordMatches = records.filter(record => {
    const text = `${record.unit} ${record.building} ${record.floor} ${record.category || ''} ${record.note || ''}`.toLowerCase();
    return queryTokens.some(token => text.includes(token));
  });

  // Combine and deduplicate
  const combinedMap = new Map<number, UDHPhoneRecord>();
  matchedRecords.forEach(r => combinedMap.set(r.id, r));
  directRecordMatches.forEach(r => combinedMap.set(r.id, r));
  const finalRecords = Array.from(combinedMap.values());

  const urgency = primaryRule ? primaryRule.urgency : 'routine';
  const isEmergencyAlert = urgency === 'emergency' || query.includes('ฉุกเฉิน') || query.includes('1669');

  const adviceText = primaryRule 
    ? primaryRule.advice 
    : 'หากไม่แน่ใจเรื่องห้องตรวจ แนะนำติดต่อ "จุดคัดกรองคนไข้" หรือ "เคาท์เตอร์บัตร ลงทะเบียนห้องตรวจ" ที่ชั้น 1 อาคารผู้ป่วยนอกและอำนวยการ โทร 3110 หรือ 3236 เพื่อให้พยาบาลคัดกรองอาการโดยตรง';

  return {
    query,
    primaryMatch: primaryRule,
    secondaryMatches: secondaryRules,
    matchedRecords: finalRecords.slice(0, 15),
    allRelatedRecords: finalRecords,
    urgency,
    advice: adviceText,
    isEmergencyAlert
  };
}
