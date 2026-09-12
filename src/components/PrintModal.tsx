import React from 'react';
import { X, Printer, Download, Check, FileText } from 'lucide-react';
import { UDHPhoneRecord } from '../types';

interface PrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  records: UDHPhoneRecord[];
}

export const PrintModal: React.FC<PrintModalProps> = ({
  isOpen,
  onClose,
  records
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 border border-slate-200 shadow-2xl space-y-4">
        
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-teal-50 text-teal-700">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">พิมพ์สมุดโทรศัพท์ (Print Directory)</h3>
              <p className="text-xs text-slate-500">พร้อมพิมพ์สำหรับติดโต๊ะทำงาน แผนก หรือบอร์ดประชาสัมพันธ์</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-2">
          <div className="flex justify-between">
            <span className="font-semibold text-slate-600">จำนวนรายการที่จะพิมพ์:</span>
            <span className="font-mono font-bold text-teal-800">{records.length} หมายเลข</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-slate-600">หัวกระดาษ:</span>
            <span>ทำเนียบหมายเลขโทรศัพท์ โรงพยาบาลอุดรธานี (UDH)</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-slate-600">วันที่จัดพิมพ์:</span>
            <span>{new Date().toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
        </div>

        <div className="text-[11px] text-slate-500 bg-teal-50/50 p-3 rounded-xl border border-teal-100">
          💡 <strong>คำแนะนำ:</strong> ในหน้าต่าง Print ให้เลือก Layout เป็น <strong>Landscape</strong> หรือ <strong>Portrait</strong> และสามารถปรับ Scale เพื่อให้พอดีกับหน้ากระดาษ A4
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl cursor-pointer"
          >
            ยกเลิก
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-5 py-2 bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold rounded-xl shadow-xs cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>เริ่มสั่งพิมพ์ (Print Now)</span>
          </button>
        </div>

      </div>
    </div>
  );
};
