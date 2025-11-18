import { CheckCircle, AlertTriangle, Star } from 'lucide-react';

function SummaryCard({ label, value, bgColor }) {
  return (
    <div className={`${bgColor} rounded-2xl p-6`}>
      <p className="text-sm text-gray-600 mb-1">{label}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );
}

export default function ReportSummary() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Report Preview — Progress Reports</h2>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span>Passing</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <span>Needs Attention</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Star className="w-4 h-4 text-blue-600" />
            <span>Outstanding</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <SummaryCard label="Avg. Grade" value="B+" bgColor="bg-blue-50" />
        <SummaryCard label="Assignments" value="42" bgColor="bg-blue-50" />
        <SummaryCard label="Behavior Notes" value="3" bgColor="bg-blue-50" />
        <SummaryCard label="Attendance" value="96%" bgColor="bg-blue-50" />
      </div>
    </div>
  );
}