// src/pages/ViewTimetable.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Download, Edit, Save, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useReactToPrint } from 'react-to-print';
import Sidebar from '../components/Sidebar';
import HeaderRightSection from '../components/HeaderRightSection';

const ViewTimetable = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const printRef = useRef();

  const [isEditing, setIsEditing] = useState(false);
  const [timetable, setTimetable] = useState([]);
  const [classInfo, setClassInfo] = useState(null);
  const [allClasses, setAllClasses] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState(null);

  // Load all classes once
  useEffect(() => {
    const savedClasses = JSON.parse(localStorage.getItem('nursery-classes') || '[]');
    setAllClasses(savedClasses);
  }, []);

  // Sync URL → selected class
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const classId = params.get('class');
    if (classId && !isNaN(classId)) {
      setSelectedClassId(parseInt(classId));
    } else if (allClasses.length > 0) {
      // Default to first class if no ?class
      const firstId = allClasses[0].id;
      setSelectedClassId(firstId);
      navigate(`/classes/timetable?class=${firstId}`, { replace: true });
    }
  }, [location.search, allClasses, navigate]);

  // Load timetable when selectedClassId changes
  useEffect(() => {
    if (!selectedClassId) return;

    const currentClass = allClasses.find(c => c.id === selectedClassId);
    if (!currentClass) return;

    setClassInfo(currentClass);

    const savedTimetables = JSON.parse(localStorage.getItem('nursery-timetables') || '{}');
    const saved = savedTimetables[selectedClassId];

    if (saved) {
      setTimetable(saved);
    } else {
      const defaultTemplate = generateDefaultTemplate();
      setTimetable(defaultTemplate);
      savedTimetables[selectedClassId] = defaultTemplate;
      localStorage.setItem('nursery-timetables', JSON.stringify(savedTimetables));
    }
  }, [selectedClassId, allClasses]);

  // Handle class selection
  const handleClassChange = (e) => {
    const newId = parseInt(e.target.value);
    setSelectedClassId(newId);
    navigate(`/classes/timetable?class=${newId}`);
  };

  // Generate default template
  const generateDefaultTemplate = () => [
    { time: '08:00 - 09:00', days: { mon: { title: 'Arrival & Free Play', desc: 'Blocks, Art' }, tue: { title: 'Arrival & Free Play', desc: 'Fine motor' }, wed: { title: 'Arrival & Free Play', desc: 'Story corner' }, thu: { title: 'Arrival & Free Play', desc: 'Puzzles' }, fri: { title: 'Arrival & Free Play', desc: 'Drawing' } } },
    { time: '09:00 - 10:00', days: { mon: { title: 'Circle Time', desc: 'Theme: Colors' }, tue: { title: 'Circle Time', desc: 'Theme: Shapes' }, wed: { title: 'Circle Time', desc: 'Theme: Nature' }, thu: { title: 'Circle Time', desc: 'Theme: Animals' }, fri: { title: 'Circle Time', desc: 'Theme: Weather' } } },
    { time: '10:00 - 10:30', days: { mon: { title: 'Snack Break', desc: 'Fruits + Milk' }, tue: { title: 'Snack Break', desc: 'Fruits + Milk' }, wed: { title: 'Snack Break', desc: 'Packed (trip)' }, thu: { title: 'Snack Break', desc: 'Fruits + Milk' }, fri: { title: 'Snack Break', desc: 'Fruits + Milk' } } },
    { time: '10:30 - 12:00', days: { mon: { title: 'Literacy', desc: 'Letter A + Worksheet' }, tue: { title: 'Numeracy', desc: 'Counting to 10' }, wed: { title: 'Field Trip', desc: 'Park visit' }, thu: { title: 'Art & Craft', desc: 'Finger painting' }, fri: { title: 'Science', desc: 'Sink or Float' } } },
    { time: '12:00 - 13:00', days: { mon: { title: 'Lunch', desc: 'Meal plan' }, tue: { title: 'Lunch', desc: 'Meal plan' }, wed: { title: 'Lunch', desc: 'Packed (trip day)' }, thu: { title: 'Lunch', desc: 'Meal plan' }, fri: { title: 'Lunch', desc: 'Meal plan' } } },
    { time: '13:00 - 14:00', days: { mon: { title: 'Nap/Quiet Time', desc: 'Soothing music' }, tue: { title: 'Nap/Quiet Time', desc: 'Story audio' }, wed: { title: 'Nap/Quiet Time', desc: 'Return by 13:30' }, thu: { title: 'Nap/Quiet Time', desc: 'Soft lights' }, fri: { title: 'Nap/Quiet Time', desc: 'Calm corner' } } },
    { time: '14:00 - 15:00', days: { mon: { title: 'Outdoor Play', desc: 'Playground' }, tue: { title: 'Music & Movement', desc: 'Action songs' }, wed: { title: 'Art Journal', desc: 'Trip reflection' }, thu: { title: 'PE (Light)', desc: 'Ball games' }, fri: { title: 'Show & Tell', desc: 'Bring 1 item' } } },
  ];

  // Save timetable
  const saveTimetable = () => {
    if (!selectedClassId) return;
    const savedTimetables = JSON.parse(localStorage.getItem('nursery-timetables') || '{}');
    savedTimetables[selectedClassId] = timetable;
    localStorage.setItem('nursery-timetables', JSON.stringify(savedTimetables));
    setIsEditing(false);
  };

  // Update cell
  const updateCell = (timeIndex, day, field, value) => {
    setTimetable(prev => {
      const updated = [...prev];
      updated[timeIndex].days[day][field] = value;
      return updated;
    });
  };

  // Export PDF
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: `${classInfo?.name || 'Timetable'}`,
  });

  if (allClasses.length === 0) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 ml-64 p-8">
          <p className="text-gray-600">No classes found. Please create a class first.</p>
          <Link to="/class-management" className="text-indigo-600 hover:underline">Go to Class Management</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 ml-64 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-4 sticky top-0 z-10">
          <div className="flex items-center justify-end">
            <HeaderRightSection
              notificationCount={3}
              imageSrc="https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100"
              name="Admin"
            />
          </div>
        </header>

        <main className="flex-1 p-8 overflow-auto">
          {/* Class Selector */}
          <div className="mb-6 flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700">Select Class:</label>
            <select
              value={selectedClassId || ''}
              onChange={handleClassChange}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium"
            >
              {allClasses.map(cls => (
                <option key={cls.id} value={cls.id}>
                  {cls.name} • Room {cls.room}
                </option>
              ))}
            </select>
          </div>

          {/* Print Area */}
          <div ref={printRef} className="bg-white p-8 rounded-lg shadow-sm">
            {classInfo && (
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 print:text-xl">
                  {classInfo.name} • Room {classInfo.room} • Age {classInfo.ageGroup}
                </h1>
                <p className="text-sm text-gray-600 mt-1">Teacher: {classInfo.teacher.name}</p>
              </div>
            )}

           

            {/* Timetable Grid */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase border-b">Time</th>
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(day => (
                      <th key={day} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase border-b">{day}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {timetable.map((slot, i) => (
                    <tr key={i}>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap border-r">{slot.time}</td>
                      {['mon', 'tue', 'wed', 'thu', 'fri'].map(day => {
                        const activity = slot.days[day];
                        return (
                          <td key={day} className="px-6 py-4 border-r">
                            {isEditing ? (
                              <div className="space-y-1">
                                <input
                                  type="text"
                                  className="w-full px-2 py-1 text-sm border rounded"
                                  value={activity.title}
                                  onChange={e => updateCell(i, day, 'title', e.target.value)}
                                />
                                <input
                                  type="text"
                                  className="w-full px-2 py-1 text-xs border rounded text-gray-600"
                                  value={activity.desc}
                                  onChange={e => updateCell(i, day, 'desc', e.target.value)}
                                />
                              </div>
                            ) : (
                              <div className="bg-gray-100 rounded-lg p-3 min-h-[60px]">
                                <div className="font-medium text-sm">{activity.title}</div>
                                <div className="text-xs text-gray-600 mt-1">{activity.desc}</div>
                              </div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center mt-6 print:hidden">
            <Link to="/class-management" className="px-4 py-2 border rounded-lg text-sm">
              Back to Classes
            </Link>

            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <button
                    onClick={saveTimetable}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" /> Save
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 border rounded-lg text-sm flex items-center gap-2"
                  >
                    <X className="w-4 h-4" /> Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-pink-600 text-white rounded-lg text-sm flex items-center gap-2"
                  >
                    <Edit className="w-4 h-4" /> Edit Timetable
                  </button>
                  <button
                    onClick={handlePrint}
                    className="px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" /> Export PDF
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Pagination */}
          <div className="mt-6 flex justify-center gap-2 print:hidden">
            <button className="p-2 border rounded-lg"><ChevronLeft className="w-5 h-5" /></button>
            <button className="px-3 py-1 bg-indigo-700 text-white rounded-lg text-sm">1</button>
            <button className="px-3 py-1 border rounded-lg text-sm">2</button>
            <button className="p-2 border rounded-lg"><ChevronRight className="w-5 h-5" /></button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ViewTimetable;