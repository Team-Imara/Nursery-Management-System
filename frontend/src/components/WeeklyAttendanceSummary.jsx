// src/components/WeeklyAttendanceSummary.jsx
import React from "react";

const WeeklyAttendanceSummary = ({
  title = "Weekly Attendance",
  type = "student", // "student" or "teacher"
  data = [],
  loading = false,
  className = "",
}) => {
  // Loading state
  if (loading) {
    return (
      <div className={`bg-white rounded-xl p-8 shadow-sm border border-gray-200 mb-8 ${className}`}>
        <div className="animate-pulse">
          <div className="h-7 bg-gray-200 rounded w-64 mb-6"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-100 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (!data || data.length === 0) {
    return (
      <div className={`bg-white rounded-xl p-8 shadow-sm border border-gray-200 mb-8 ${className}`}>
        <h3 className="text-xl font-bold text-gray-900 mb-4">{title}</h3>
        <p className="text-center text-gray-500 py-8">No attendance data available for this week.</p>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 mb-8 ${className}`}>
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-900">{title}</h3>
          <span className="text-xs font-semibold text-gray-600 bg-gray-100 px-3 py-1.5 rounded-full">
            {type === "teacher" ? "Teachers" : "Students"}
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                {type === "teacher" ? "Teacher Name" : "Class"}
              </th>
              {data[0].days.map((day, idx) => (
                <th
                  key={idx}
                  className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider"
                >
                  <div>{day.day}</div>
                  {day.date && (
                    <div className="text-xs font-normal text-gray-500 mt-1">
                      {day.date}
                    </div>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {data.map((row, index) => (
              <tr
                key={row.className || row.name || index}
                className="hover:bg-gray-50 transition-colors duration-150"
              >
                <td className="px-6 py-5 font-semibold text-gray-800 whitespace-nowrap">
                  {row.className || row.name || row.teacherName || "—"}
                </td>
                {row.days.map((day, i) => {
                  const value = day.percentage;
                  const isEmpty = !value || value === "-" || value === "";
                  const num = parseFloat(value);

                  return (
                    <td
                      key={i}
                      className={`px-6 py-5 text-center font-bold text-lg ${
                        isEmpty
                          ? "text-gray-400"
                          : num < 90
                          ? "text-red-600 bg-red-50"
                          : num >= 95
                          ? "text-green-600 bg-green-50"
                          : "text-gray-700"
                      }`}
                    >
                      {isEmpty ? "—" : value}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WeeklyAttendanceSummary;