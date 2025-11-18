import { RotateCcw, Play, SlidersHorizontal } from 'lucide-react';

export default function FiltersPanel() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        <button className="text-gray-500 hover:text-gray-700">
          <SlidersHorizontal className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
          <select className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option>This Term</option>
            <option>Last Term</option>
            <option>Custom</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Student</label>
            <select className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option>Search or select student</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Class</label>
            <select className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option>Select class</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Teacher</label>
            <select className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option>Search or select teacher</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Term / Month</label>
            <select className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option>Term 2</option>
              <option>Term 1</option>
              <option>Term 3</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Quick Ranges</label>
          <div className="grid grid-cols-2 gap-2">
            <button className="px-4 py-2.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl text-sm text-gray-700 transition-colors">
              This Month
            </button>
            <button className="px-4 py-2.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl text-sm text-gray-700 transition-colors">
              This Term
            </button>
            <button className="px-4 py-2.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl text-sm text-gray-700 transition-colors">
              Last Term
            </button>
            <button className="px-4 py-2.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl text-sm text-gray-700 transition-colors">
              Custom
            </button>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 mb-4">
            Adjust filters to refine your report. Changes apply when you generate.
          </p>
          <div className="flex gap-2">
            <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white hover:bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 transition-colors flex-1">
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
            <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 rounded-xl text-sm font-medium text-white transition-colors flex-1">
              <Play className="w-4 h-4" />
              Generate Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
