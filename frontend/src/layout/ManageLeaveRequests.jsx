import React, { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { DownloadIcon, CheckIcon, XIcon } from '@heroicons/react/outline';
import { Search } from 'lucide-react';
import Layout from '../components/Layout.jsx';

// ---------------------------------------------------------------------
// Hard-coded data (replace later with API)
// ---------------------------------------------------------------------
const rawRequests = [
  {
    id: 1,
    teacher: { name: 'Saanvi Iyer', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
    reason: 'Child’s Vaccination Appointment',
    type: 'Half-day',
    dates: '2025-11-12',
    submittedAt: '2025-11-10',
    status: 'pending',
  },
  {
    id: 2,
    teacher: { name: 'Priya Sharma', avatar: 'https://randomuser.me/api/portraits/women/68.jpg' },
    reason: 'Family Wedding in Kandy',
    type: 'Full-day',
    dates: '2025-11-15',
    submittedAt: '2025-11-09',
    status: 'pending',
  },
  {
    id: 3,
    teacher: { name: 'Meera Nair', avatar: 'https://randomuser.me/api/portraits/women/12.jpg' },
    reason: 'Early Childhood Education Workshop (Colombo)',
    type: 'Multi-day',
    dates: '2025-11-20 to 2025-11-22',
    submittedAt: '2025-11-08',
    status: 'pending',
  },
  {
    id: 4,
    teacher: { name: 'Aisha Perera', avatar: 'https://randomuser.me/api/portraits/women/22.jpg' },
    reason: 'Personal Medical Checkup',
    type: 'Half-day',
    dates: '2025-11-13',
    submittedAt: '2025-11-10',
    status: 'pending',
  },
  {
    id: 5,
    teacher: { name: 'Ruwani Silva', avatar: 'https://randomuser.me/api/portraits/women/33.jpg' },
    reason: 'Poya Day Family Visit',
    type: 'Full-day',
    dates: '2025-11-14', // Full Moon Poya (approx)
    submittedAt: '2025-11-07',
    status: 'approved',
  },
  {
    id: 6,
    teacher: { name: 'Nimali Fernando', avatar: 'https://randomuser.me/api/portraits/women/55.jpg' },
    reason: 'Parent-Teacher Meeting Preparation',
    type: 'Half-day',
    dates: '2025-11-18',
    submittedAt: '2025-11-06',
    status: 'approved',
  },
  {
    id: 7,
    teacher: { name: 'Kamal Gunawardena', avatar: 'https://randomuser.me/api/portraits/men/45.jpg' },
    reason: 'Flu Recovery',
    type: 'Full-day',
    dates: '2025-11-11',
    submittedAt: '2025-11-05',
    status: 'rejected',
  },
  {
    id: 8,
    teacher: { name: 'Lakshmi Rajapaksa', avatar: 'https://randomuser.me/api/portraits/women/77.jpg' },
    reason: 'Child’s School Sports Day',
    type: 'Half-day',
    dates: '2025-11-25',
    submittedAt: '2025-11-10',
    status: 'pending',
  },

];

const ManageLeaveRequests = () => {
  const [requests, setRequests] = useState(rawRequests);
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState('pending');
  const [typeFilter, setTypeFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('This Month');
  const [selectedIds, setSelectedIds] = useState([]);

  // -----------------------------------------------------------------
  // 1. Filtering
  // -----------------------------------------------------------------
  const filtered = useMemo(() => {
    return requests.filter(r => {
      const matchesSearch =
        r.teacher.name.toLowerCase().includes(search.toLowerCase()) ||
        r.reason.toLowerCase().includes(search.toLowerCase());

      const matchesTab = tab === 'all' || r.status === tab;
      const matchesType = typeFilter === 'All' || r.type === typeFilter;

      const requestDate = new Date(r.dates.split(' to ')[0]);
      const now = new Date();
      const isThisMonth =
        dateFilter !== 'This Month' ||
        (requestDate.getMonth() === now.getMonth() &&
          requestDate.getFullYear() === now.getFullYear());

      return matchesSearch && matchesTab && matchesType && isThisMonth;
    });
  }, [requests, search, tab, typeFilter, dateFilter]);

  // -----------------------------------------------------------------
  // 2. Summary
  // -----------------------------------------------------------------
  const summary = useMemo(() => {
    const pending = requests.filter(r => r.status === 'pending').length;
    const approved = requests.filter(r => r.status === 'approved').length;
    const rejected = requests.filter(r => r.status === 'rejected').length;
    return { pending, approved, rejected };
  }, [requests]);

  // -----------------------------------------------------------------
  // 3. Approve / Reject
  // -----------------------------------------------------------------
  const handleStatus = (id, newStatus) => {
    setRequests(prev =>
      prev.map(r => (r.id === id ? { ...r, status: newStatus } : r))
    );
  };

  // -----------------------------------------------------------------
  // 4. Bulk Approve
  // -----------------------------------------------------------------
  const handleBulkApprove = () => {
    if (!selectedIds.length) return;
    setRequests(prev =>
      prev.map(r => (selectedIds.includes(r.id) ? { ...r, status: 'approved' } : r))
    );
    setSelectedIds([]);
  };

  // -----------------------------------------------------------------
  // 5. Export CSV
  // -----------------------------------------------------------------
  const exportCSV = () => {
    const headers = ['Teacher', 'Reason', 'Type', 'Dates', 'Submitted', 'Status'];
    const rows = filtered.map(r => [
      r.teacher.name,
      r.reason,
      r.type,
      r.dates,
      r.submittedAt,
      r.status,
    ]);
    const csv = [headers, ...rows].map(e => e.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leave-requests-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // -----------------------------------------------------------------
  // 6. Checkbox
  // -----------------------------------------------------------------
  const toggleSelect = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    const visibleIds = filtered.map(r => r.id);
    setSelectedIds(prev =>
      prev.length === visibleIds.length ? [] : visibleIds
    );
  };

  // -----------------------------------------------------------------
  // Render
  // -----------------------------------------------------------------
  return (
    <Layout>
      {/* Page Content */}
      <main className="flex-1 p-8 overflow-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Manage Leave Requests</h1>

        {/* Search & Filters */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex flex-wrap items-center gap-3">
          <div className="flex-1 min-w-[200px] relative">
            <input
              type="text"
              placeholder="Search by teacher or reason"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
          >
            <option value="All">Type: All</option>
            <option value="Half-day">Half-day</option>
            <option value="Full-day">Full-day</option>
            <option value="Multi-day">Multi-day</option>
          </select>
          <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={dateFilter}
            onChange={e => setDateFilter(e.target.value)}
          >
            <option>This Month</option>
            <option>Last Month</option>
            <option>This Year</option>
          </select>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-4">
          {['pending', 'approved', 'rejected'].map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-t-lg font-medium transition-colors
                  ${tab === t ? 'bg-indigo-700 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === filtered.length && filtered.length > 0}
                    onChange={selectAll}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teacher</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dates</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filtered.map(r => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(r.id)}
                      onChange={() => toggleSelect(r.id)}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap flex items-center">
                    <img src={r.teacher.avatar} alt={r.teacher.name} className="w-10 h-10 rounded-full mr-3" />
                    <span className="font-medium">{r.teacher.name}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{r.reason}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{r.type}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{r.dates}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{r.submittedAt}</td>
                  <td className="px-6 py-4 text-sm">
                    {r.status === 'pending' ? (
                      <>
                        <button
                          onClick={() => handleStatus(r.id, 'approved')}
                          className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium hover:bg-green-200 flex items-center"
                        >
                          <CheckIcon className="w-4 h-4 mr-1" />
                          Approve
                        </button>
                        <button
                          onClick={() => handleStatus(r.id, 'rejected')}
                          className="ml-2 px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium hover:bg-red-200 flex items-center"
                        >
                          <XIcon className="w-4 h-4 mr-1" />
                          Reject
                        </button>
                      </>
                    ) : (
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium
                            ${r.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
                      >
                        {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary + Actions */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex space-x-6">
            <div className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-lg font-medium">
              Pending <span className="ml-1">{summary.pending}</span>
            </div>
            <div className="bg-green-100 text-green-700 px-4 py-2 rounded-lg font-medium">
              Approved (This month) <span className="ml-1">{summary.approved}</span>
            </div>
            <div className="bg-red-100 text-red-700 px-4 py-2 rounded-lg font-medium">
              Rejected <span className="ml-1">{summary.rejected}</span>
            </div>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={exportCSV}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm font-medium flex items-center"
            >
              <DownloadIcon className="w-4 h-4 mr-1" />
              Export
            </button>
            <button
              onClick={handleBulkApprove}
              disabled={!selectedIds.length}
              className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center
                  ${selectedIds.length
                  ? 'bg-indigo-700 text-white hover:bg-indigo-800'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
            >
              Bulk Approve
            </button>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default ManageLeaveRequests;