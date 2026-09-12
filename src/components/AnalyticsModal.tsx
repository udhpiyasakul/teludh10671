import React from 'react';
import { 
  X, 
  BarChart3, 
  PieChart as PieIcon, 
  Building2, 
  TrendingUp, 
  PhoneCall, 
  Layers 
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell, 
  Legend 
} from 'recharts';
import { UDHPhoneRecord } from '../types';
import { BUILDING_COLORS } from '../data/constants';

interface AnalyticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  records: UDHPhoneRecord[];
}

export const AnalyticsModal: React.FC<AnalyticsModalProps> = ({
  isOpen,
  onClose,
  records
}) => {
  if (!isOpen) return null;

  // 1. Calculate count per building
  const buildingCounts: Record<string, number> = {};
  records.forEach((r) => {
    buildingCounts[r.building] = (buildingCounts[r.building] || 0) + 1;
  });

  const buildingChartData = Object.entries(buildingCounts)
    .map(([building, count]) => ({
      name: building.length > 22 ? building.substring(0, 22) + '...' : building,
      fullName: building,
      count
    }))
    .sort((a, b) => b.count - a.count);

  // 2. Calculate count per top categories
  const categoryCounts: Record<string, number> = {};
  records.forEach((r) => {
    const cat = r.category || 'ทั่วไป';
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
  });

  const topCategoriesData = Object.entries(categoryCounts)
    .filter(([name]) => name !== 'ทั่วไป')
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([name, value]) => ({
      name,
      value
    }));

  // 3. Types breakdown
  const internalCount = records.filter(r => r.phoneType === 'เบอร์ภายใน').length;
  const externalCount = records.filter(r => r.phoneType === 'เบอร์สายนอก').length;
  const typeChartData = [
    { name: 'เบอร์ภายใน', value: internalCount, color: '#0d9488' },
    { name: 'เบอร์สายนอก', value: externalCount, color: '#8b5cf6' }
  ];

  const PIE_COLORS = ['#0d9488', '#2563eb', '#059669', '#d97706', '#e11d48', '#db2777', '#4f46e5', '#8b5cf6'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 shadow-2xl">
        
        {/* Modal Header */}
        <div className="sticky top-0 bg-white px-6 py-4 border-b border-slate-200 flex items-center justify-between z-10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-teal-50 text-teal-700">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                สถิติและภาพรวมการกระจายหมายเลขโทรศัพท์ (UDH Analytics)
              </h3>
              <p className="text-xs text-slate-500">
                วิเคราะห์ข้อมูลหมายเลขโทรศัพท์ทั้ง 13 อาคารในโรงพยาบาลอุดรธานี
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          
          {/* Top 3 Insights Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-teal-50/60 border border-teal-200/80 rounded-xl p-3.5">
              <span className="text-xs font-semibold text-teal-800">อาคารที่มีเบอร์มากที่สุด</span>
              <div className="text-base font-bold text-slate-900 mt-1 truncate">
                {buildingChartData[0]?.fullName || '-'}
              </div>
              <p className="text-xs text-teal-700 font-mono font-semibold mt-0.5">
                {buildingChartData[0]?.count || 0} หมายเลขโทรศัพท์
              </p>
            </div>

            <div className="bg-blue-50/60 border border-blue-200/80 rounded-xl p-3.5">
              <span className="text-xs font-semibold text-blue-800">กลุ่มงานที่พบบ่อย</span>
              <div className="text-base font-bold text-slate-900 mt-1 truncate">
                {topCategoriesData[0]?.name || '-'}
              </div>
              <p className="text-xs text-blue-700 font-mono font-semibold mt-0.5">
                {topCategoriesData[0]?.value || 0} จุดบริการ
              </p>
            </div>

            <div className="bg-purple-50/60 border border-purple-200/80 rounded-xl p-3.5">
              <span className="text-xs font-semibold text-purple-800">สัดส่วนเบอร์ภายใน รพ.</span>
              <div className="text-base font-bold text-slate-900 mt-1">
                {((internalCount / records.length) * 100).toFixed(1)}%
              </div>
              <p className="text-xs text-purple-700 font-mono font-semibold mt-0.5">
                {internalCount} จาก {records.length} เบอร์ทั้งหมด
              </p>
            </div>
          </div>

          {/* Chart 1: Extensions per Building */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-teal-600" />
              จำนวนหมายเลขโทรศัพท์ แยกตามอาคาร (Top Buildings)
            </h4>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={buildingChartData}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
                >
                  <XAxis type="number" tick={{ fontSize: 11 }} />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    tick={{ fontSize: 11 }} 
                    width={110} 
                  />
                  <Tooltip 
                    formatter={(val: number) => [`${val} เบอร์`, 'จำนวนหมายเลข']}
                    labelFormatter={(label, payload) => payload?.[0]?.payload?.fullName || label}
                  />
                  <Bar dataKey="count" fill="#0d9488" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Top Categories Pie Chart */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <PieIcon className="w-4 h-4 text-purple-600" />
                กลุ่มงานเฉพาะทางที่มีเบอร์สูงสุด
              </h4>
              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={topCategoriesData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={70}
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    >
                      {topCategoriesData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <PhoneCall className="w-4 h-4 text-emerald-600" />
                ประเภทหมายเลขโทรศัพท์ (Internal vs External)
              </h4>
              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={typeChartData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={70}
                      paddingAngle={4}
                    >
                      {typeChartData.map((entry, index) => (
                        <Cell key={`cell-type-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(val: number) => [`${val} เบอร์`, 'จำนวน']} />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl cursor-pointer"
          >
            ปิดหน้าต่าง
          </button>
        </div>

      </div>
    </div>
  );
};
