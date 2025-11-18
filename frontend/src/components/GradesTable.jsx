import React from 'react';

const grades = [
  { subject: 'Mathematics', termGrade: 'A-', assignmentsAvg: '88%', examsAvg: '91%' },
  { subject: 'Science', termGrade: 'B+', assignmentsAvg: '84%', examsAvg: '86%' },
  { subject: 'History', termGrade: 'B', assignmentsAvg: '80%', examsAvg: '82%' },
];

export default function GradesTable() {
  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Academic Grades</h3>
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-blue-50">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Subject</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Term Grade</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Assignments Avg</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Exams Avg</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {grades.map((grade, index) => (
              <tr key={index} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm text-gray-900">{grade.subject}</td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{grade.termGrade}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{grade.assignmentsAvg}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{grade.examsAvg}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
