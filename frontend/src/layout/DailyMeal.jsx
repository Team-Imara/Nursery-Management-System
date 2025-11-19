import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import Sidebar from '../components/Sidebar';
import HeaderRightSection from '../components/HeaderRightSection.jsx';

export default function DailyMeals() {
  const { students, mealRecords, addMealRecord, updateMealRecord } = useAppContext();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [currentTab, setCurrentTab] = useState('all');
  const [formData, setFormData] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const data = {};
    students.forEach(student => {
      const record = mealRecords.find(r => r.studentId === student.id && r.date === selectedDate);
      if (record) {
        data[student.id] = {
          status: record.status,
          notes: record.notes,
          recordId: record.id
        };
      } else {
        data[student.id] = {
          status: '',
          notes: ''
        };
      }
    });
    setFormData(data);
  }, [selectedDate, students, mealRecords]);

  const updateForm = (studentId, field, value) => {
    setFormData(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [field]: value
      }
    }));
  };

  const handleSaveAll = () => {
    setError('');
    let hasError = false;
    Object.keys(formData).forEach(studentId => {
      const data = formData[studentId];
      if (!data.status) {
        setError('Please select meal status for all students before saving.');
        hasError = true;
        return;
      }
      const student = students.find(s => s.id === parseInt(studentId));
      if (!student) return;
      const record = {
        studentId: parseInt(studentId),
        studentName: student.name,
        date: selectedDate,
        status: data.status,
        notes: data.notes.trim(),
        timestamp: new Date().toISOString()
      };
      if (data.recordId) {
        updateMealRecord(data.recordId, record);
      } else {
        addMealRecord(record);
      }
    });
    if (!hasError) {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  const filteredStudents = currentTab === 'all'
    ? students
    : students.filter(student => student.grade === currentTab.toLowerCase());

  const getDateRecords = () => {
    return mealRecords.filter(record => record.date === selectedDate);
  };

  return (
    <div className="min-h-screen bg-gray-50">
         <Sidebar />
     
        <div className="flex-1 flex flex-col lg:ml-64">
             <header className="bg-white border-b border-gray-200 px-8 py-4 sticky top-0 z-10">
       <div className="flex items-center justify-end">
            <HeaderRightSection
              notificationCount={3}
              imageSrc="https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100"
              name="Admin"
              onNotificationClick={() => alert('Notifications clicked!')}
            />
          </div>
        </header>
      <main className="max-w-[1200px] mx-auto p-[2rem] grid grid-cols-1 md:grid-cols-2 gap-[2rem]">
        <section className="bg-white rounded-[12px] p-[2rem] shadow-[0_4px_6px_rgba(0,0,0,0.1)] md:col-span-2">
          <h2 className="text-[1.5rem] text-[#2d3748] mb-[1.5rem]">Manage Meal Records for {selectedDate}</h2>
          {showSuccess && (
            <div className="p-[1rem] rounded-[8px] mb-[1.5rem] font-medium bg-[#c6f6d5] text-[#22543d] border border-[#9ae6b4]" role="alert">
              ✓ Meal records saved successfully!
            </div>
          )}
          {error && (
            <div className="p-[1rem] rounded-[8px] mb-[1.5rem] font-medium bg-[#fed7d7] text-[#742a2a] border border-[#fc8181]" role="alert">
              ✗ {error}
            </div>
          )}
          <div className="flex items-center gap-4 mb-4">
            <label htmlFor="date-select" className="font-semibold text-[#2d3748] text-[0.95rem]">Select Date:</label>
            <input
              type="date"
              id="date-select"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="p-[0.75rem] border-2 border-[#e2e8f0] rounded-[8px] text-base font-inherit transition-colors duration-200 focus:outline-none focus:border-[#667eea]"
            />
            <button
              type="button"
              onClick={handleSaveAll}
              className="bg-[#667eea] text-white p-[0.875rem_1.5rem] border-none rounded-[8px] text-base font-semibold cursor-pointer transition-colors duration-200 hover:bg-[#5568d3] focus:outline-2 focus:outline-[#667eea] focus:outline-offset-2"
            >
              Save All
            </button>
          </div>
          <div className="tabs flex space-x-2 mb-4">
            <button
              onClick={() => setCurrentTab('all')}
              className={`${currentTab === 'all' ? 'bg-white text-[#667eea] border-b-2 border-[#667eea]' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'} px-4 py-2 rounded-t-lg font-medium focus:outline-none transition-colors duration-200`}
            >
              All Students
            </button>
            <button
              onClick={() => setCurrentTab('kg1')}
              className={`${currentTab === 'kg1' ? 'bg-white text-[#667eea] border-b-2 border-[#667eea]' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'} px-4 py-2 rounded-t-lg font-medium focus:outline-none transition-colors duration-200`}
            >
              Kindergarten 1
            </button>
            <button
              onClick={() => setCurrentTab('kg2')}
              className={`${currentTab === 'kg2' ? 'bg-white text-[#667eea] border-b-2 border-[#667eea]' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'} px-4 py-2 rounded-t-lg font-medium focus:outline-none transition-colors duration-200`}
            >
              Kindergarten 2
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Meal Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredStudents.map(student => (
                  <tr key={student.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{student.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.grade.toUpperCase()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex gap-[1.5rem] p-[0.5rem_0] sm:flex-row flex-col">
                        <label className="flex items-center gap-[0.5rem] cursor-pointer text-base">
                          <input
                            type="radio"
                            value="completed"
                            checked={formData[student.id]?.status === 'completed'}
                            onChange={(e) => updateForm(student.id, 'status', e.target.value)}
                            className="w-[1.25rem] h-[1.25rem] cursor-pointer"
                          />
                          <span>✓ Completed</span>
                        </label>
                        <label className="flex items-center gap-[0.5rem] cursor-pointer text-base">
                          <input
                            type="radio"
                            value="incomplete"
                            checked={formData[student.id]?.status === 'incomplete'}
                            onChange={(e) => updateForm(student.id, 'status', e.target.value)}
                            className="w-[1.25rem] h-[1.25rem] cursor-pointer"
                          />
                          <span>✗ Incomplete</span>
                        </label>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <textarea
                        value={formData[student.id]?.notes || ''}
                        onChange={(e) => updateForm(student.id, 'notes', e.target.value)}
                        className="p-[0.75rem] border-2 border-[#e2e8f0] rounded-[8px] text-base font-inherit transition-colors duration-200 focus:outline-none focus:border-[#667eea] w-full"
                        rows="2"
                        placeholder="Add any notes..."
                      />
                    </td>
                  </tr>
                ))}
                {filteredStudents.length === 0 && (
                  <tr>
                    <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">No students in this category.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
        <section className="bg-white rounded-[12px] p-[2rem] shadow-[0_4px_6px_rgba(0,0,0,0.1)]">
          <h2 className="text-[1.5rem] text-[#2d3748] mb-[1.5rem]">Records for {selectedDate} ({getDateRecords().length})</h2>
          {getDateRecords().length === 0 ? (
            <p className="text-center text-[#718096] p-[2rem]">No meal records added for this date yet.</p>
          ) : (
            <div className="flex flex-col gap-[1rem]">
              {getDateRecords().map(record => (
                <div key={record.id} className="bg-[#f7fafc] rounded-[8px] p-[1rem] border-l-4 border-l-[#667eea]">
                  <div className="flex justify-between items-center mb-[0.5rem]">
                    <strong className="text-[1.1rem] text-[#2d3748]">{record.studentName}</strong>
                    <span className={`p-[0.25rem_0.75rem] rounded-[12px] text-[0.875rem] font-semibold ${record.status === 'completed' ? 'bg-[#c6f6d5] text-[#22543d]' : 'bg-[#fed7d7] text-[#742a2a]'}`}>
                      {record.status === 'completed' ? '✓' : '✗'} {record.status}
                    </span>
                  </div>
                  {record.notes && (
                    <p className="text-[#4a5568] text-[0.95rem] my-[0.5rem]">{record.notes}</p>
                  )}
                  <small className="text-[#718096] text-[0.875rem]">
                    {new Date(record.timestamp).toLocaleTimeString()}
                  </small>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
    </div>
  );
}