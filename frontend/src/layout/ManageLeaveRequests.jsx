import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Sidebar from '../components/Sidebar';

const ManageLeaveRequests = () => {
    const navigate = useNavigate();

    const [leaveRequests, setLeaveRequests] = useState([
        {
            id: 1,
            teacherName: 'Aarav Patel',
            startDate: '2025-10-25',
            endDate: '2025-10-27',
            status: 'Pending',
        },
        {
            id: 2,
            teacherName: 'Priya Sharma',
            startDate: '2025-10-28',
            endDate: '2025-10-30',
            status: 'Pending',
        },
        {
            id: 3,
            teacherName: 'Saanvi Iyer',
            startDate: '2025-10-31',
            endDate: '2025-11-02',
            status: 'Approved',
        },
    ]);

    const handleAction = (id, action) => {
        setLeaveRequests((prevRequests) =>
            prevRequests.map((request) =>
                request.id === id ? { ...request, status: action === 'approve' ? 'Approved' : 'Rejected' } : request
            )
        );
    };

    return (
        <div className="flex w-full min-h-screen bg-gray-50">
            <Sidebar />

            <div className="flex-1 ml-64 p-8">
                <header className="bg-white border-b border-gray-200 px-8 py-4 sticky top-0 z-10">
                    <div className="flex items-center justify-start">
                        <button
                            onClick={() => navigate('/teachers')}
                            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            <ArrowLeft size={20} />
                            Back to Teachers
                        </button>
                    </div>
                </header>

                <main className="pt-8">
                    <div className="max-w-4xl mx-auto">
                        <div className="mb-6">
                            <p className="text-lg text-gray-700">Current Date and Time: Friday, October 24, 2025, 12:18 PM +0530</p>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-6">Manage Leave Requests</h1>
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                    <tr className="bg-gray-50 border-b border-gray-200">
                                        <th className="p-4 text-sm font-medium text-gray-700">Teacher Name</th>
                                        <th className="p-4 text-sm font-medium text-gray-700">Start Date</th>
                                        <th className="p-4 text-sm font-medium text-gray-700">End Date</th>
                                        <th className="p-4 text-sm font-medium text-gray-700">Status</th>
                                        <th className="p-4 text-sm font-medium text-gray-700">Actions</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {leaveRequests.map((request) => (
                                        <tr key={request.id} className="border-b border-gray-200">
                                            <td className="p-4 text-sm text-gray-900">{request.teacherName}</td>
                                            <td className="p-4 text-sm text-gray-600">{request.startDate}</td>
                                            <td className="p-4 text-sm text-gray-600">{request.endDate}</td>
                                            <td className="p-4 text-sm">
                                                    <span
                                                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                                                            request.status === 'Approved'
                                                                ? 'bg-green-50 text-green-700'
                                                                : request.status === 'Rejected'
                                                                    ? 'bg-red-50 text-red-700'
                                                                    : 'bg-yellow-50 text-yellow-700'
                                                        }`}
                                                    >
                                                        {request.status}
                                                    </span>
                                            </td>
                                            <td className="p-4 text-sm">
                                                {request.status === 'Pending' && (
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => handleAction(request.id, 'approve')}
                                                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                                                        >
                                                            Approve
                                                        </button>
                                                        <button
                                                            onClick={() => handleAction(request.id, 'reject')}
                                                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                                                        >
                                                            Reject
                                                        </button>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default ManageLeaveRequests;