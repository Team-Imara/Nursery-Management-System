// src/pages/ViewTimetable.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Download, Edit, Save, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useReactToPrint } from 'react-to-print';
import Layout from '../components/Layout.jsx';

const ViewTimetable = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const printRef = useRef();

  const [isEditing, setIsEditing] = useState(false);
  const [timetable, setTimetable] = useState([]);
  const [classInfo, setClassInfo] = useState(null);
  const [allClasses, setAllClasses] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const DAY_MAP = { mon: 'Monday', tue: 'Tuesday', wed: 'Wednesday', thu: 'Thursday', fri: 'Friday' };
  const REVERSE_DAY_MAP = { 'Monday': 'mon', 'Tuesday': 'tue', 'Wednesday': 'wed', 'Thursday': 'thu', 'Friday': 'fri' };

  // Load all classes once
  useEffect(() => {
    const fetchAllClasses = async () => {
      try {
        const response = await axios.get('/classes');
        setAllClasses(response.data);

        const params = new URLSearchParams(location.search);
        let classId = params.get('class');

        if (classId && !isNaN(classId)) {
          setSelectedClassId(parseInt(classId));
        } else if (response.data.length > 0) {
          const firstId = response.data[0].id;
          setSelectedClassId(firstId);
          navigate(`/ViewTimetable?class=${firstId}`, { replace: true });
        }
      } catch (err) {
        console.error('Error fetching classes:', err);
        setError('Failed to load classes.');
      } finally {
        setLoading(false);
      }
    };
    fetchAllClasses();
  }, [location.search, navigate]);

  // Load timetable when selectedClassId changes
  useEffect(() => {
    if (!selectedClassId || allClasses.length === 0) return;

    const currentClass = allClasses.find(c => c.id === selectedClassId);
    if (!currentClass) return;

    setClassInfo(currentClass);
    fetchTimetable(selectedClassId);
  }, [selectedClassId, allClasses]);

  const fetchTimetable = async (classId) => {
    try {
      setLoading(true);
      const response = await axios.get(`/timetables/${classId}`);

      if (response.data && response.data.length > 0) {
        // Transform backend data to frontend grid structure
        const template = generateDefaultTemplate();
        response.data.forEach(item => {
          const slot = template.find(s => s.time === item.time_slot);
          const dayKey = REVERSE_DAY_MAP[item.day];
          if (slot && dayKey) {
            const [title, ...rest] = item.activity.split('|');
            slot.days[dayKey] = {
              title: title || '',
              desc: rest.join('|') || ''
            };
          }
        });
        setTimetable(template);
      } else {
        setTimetable(generateDefaultTemplate());
      }
    } catch (err) {
      console.error('Error fetching timetable:', err);
      setError('Failed to load timetable.');
    } finally {
      setLoading(false);
    }
  };

  // Handle class selection
  const handleClassChange = (e) => {
    const newId = parseInt(e.target.value);
    setSelectedClassId(newId);
    navigate(`/ViewTimetable?class=${newId}`);
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
  const saveTimetable = async () => {
    if (!selectedClassId) return;

    // Transform grid back to flat array for backend
    const flatTimetable = [];
    timetable.forEach(slot => {
      Object.entries(slot.days).forEach(([dayKey, activity]) => {
        flatTimetable.push({
          day: DAY_MAP[dayKey],
          time_slot: slot.time,
          activity: `${activity.title}|${activity.desc}`
        });
      });
    });

    try {
      setLoading(true);
      await axios.post(`/timetables/sync/${selectedClassId}`, {
        timetable: flatTimetable
      });
      setIsEditing(false);
      alert('Timetable saved successfully!');
    } catch (err) {
      console.error('Error saving timetable:', err);
      alert('Failed to save timetable.');
    } finally {
      setLoading(false);
    }
  };

  // Update cell
  const updateCell = (timeIndex, day, field, value) => {
    setTimetable(prev => {
      const updated = [...prev];
      updated[timeIndex].days[day] = {
        ...updated[timeIndex].days[day],
        [field]: value
      };
      return updated;
    });
  };

  // Export PDF
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: `${classInfo?.classname || 'Timetable'}`,
  });

  if (loading && allClasses.length === 0) return (
    <Layout>
      <div className="flex h-64 items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    </Layout>
  );

  if (!loading && allClasses.length === 0) {
    return (
      <Layout>
        <div className="p-8">
          <p className="text-gray-600">No classes found. Please create a class first.</p>
          <Link to="/class-management" className="text-indigo-600 hover:underline">Go to Class Management</Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
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
                {cls.classname} • Room {cls.room || 'N/A'}
              </option>
            ))}
          </select>
        </div>

        {/* Print Area */}
        <div ref={printRef} className="bg-white p-8 rounded-lg shadow-sm">
          {classInfo && (
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900 print:text-xl">
                {classInfo.classname} • Room {classInfo.room || 'N/A'} • Age {classInfo.ageGroup || '4-6'}
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Teacher: {classInfo.head_teacher?.fullname || classInfo.headTeacher?.fullname || 'Unassigned'}
              </p>
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
    </Layout>
  );
};

export default ViewTimetable;