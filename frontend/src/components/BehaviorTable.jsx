const behaviorNotes = [
  { date: '2025-03-04', note: 'Participated actively in group project', level: 'Positive' },
  { date: '2025-03-12', note: 'Missed homework twice in a week', level: 'Attention' },
  { date: '2025-03-21', note: 'Helped peers during lab session', level: 'Positive' },
];

export default function BehaviorTable() {
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Behavioral Notes</h3>
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-blue-50">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Date</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Note</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Level</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {behaviorNotes.map((note, index) => (
              <tr key={index} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm text-gray-900">{note.date}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{note.note}</td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      note.level === 'Positive'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {note.level}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}