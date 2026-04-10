import { useNavigate } from 'react-router-dom';
import { Loader2, Search, ArrowLeft } from 'lucide-react';
import { useState, useEffect } from 'react';
import axios from '../api/axios';
import { motion } from 'framer-motion';
import Layout from '../components/Layout.jsx';

const StudentHealth = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentTab, setCurrentTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [studentsRes, classesRes] = await Promise.all([
        axios.get('/students'),
        axios.get('/classes')
      ]);
      setStudents(studentsRes.data);
      setClasses(classesRes.data);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load student data. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };


  const filteredStudents = students.filter(student => {
    const matchesTab = currentTab === 'all' || 
                      (student.classe && student.classe.id.toString() === currentTab);
    const matchesSearch = student.fullname?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         student.allergies?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });


  return (
    <Layout>
      <main className="max-w-7xl mx-auto p-4 md:p-8 flex flex-col gap-6">
        <div className="flex items-center justify-start">
          <button
            onClick={() => navigate('/meal-plan')}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-all font-medium"
          >
            <ArrowLeft size={20} />
            Back to Meal Plan
          </button>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Student Health Records</h1>
            <p className="text-gray-500 mt-1">Manage and monitor student medical information and allergies.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8">
          {/* Table Side */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-xl border border-gray-100 w-full md:w-80">
                  <Search className="text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="Search students or allergies..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-transparent border-none focus:outline-none text-sm w-full"
                  />
                </div>

                <div className="flex gap-1 p-1 bg-gray-50 rounded-xl border border-gray-100 overflow-x-auto">
                  <button
                    onClick={() => setCurrentTab('all')}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-all whitespace-nowrap ${currentTab === 'all' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
                  >
                    All
                  </button>
                  {classes.map(cls => (
                    <button
                      key={cls.id}
                      onClick={() => setCurrentTab(cls.id.toString())}
                      className={`px-4 py-2 text-sm font-medium rounded-lg transition-all whitespace-nowrap ${currentTab === cls.id.toString() ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
                    >
                      {cls.classname}
                    </button>
                  ))}
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-50/50">
                      <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Student & Class</th>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Allergies</th>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Special Needs</th>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Emergency</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {loading && students.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="px-6 py-12 text-center">
                          <Loader2 className="animate-spin text-blue-600 mx-auto mb-2" size={32} />
                          <p className="text-gray-500">Loading student records...</p>
                        </td>
                      </tr>
                    ) : filteredStudents.length > 0 ? (
                      filteredStudents.map(student => (
                        <tr
                          key={student.id}
                          className="hover:bg-gray-50/80 transition-colors"
                        >
                          <td className="px-6 py-4">
                            <div>
                              <div className="font-semibold text-gray-900">{student.fullname}</div>
                              <div className="text-xs text-gray-500">{student.classe?.classname} {student.section && `- ${student.section}`}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            {student.allergies ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-100">
                                {student.allergies}
                              </span>
                            ) : (
                              <span className="text-sm text-gray-400">None</span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-gray-600 line-clamp-1">{student.special_needs || '—'}</span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900 font-medium">{student.emergency_contact_phone || '—'}</div>
                            <div className="text-xs text-gray-500 line-clamp-1">{student.health_notes || student.emergency_contact_name}</div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="px-6 py-12 text-center">
                          <div className="text-gray-400 mb-2">
                            <Search size={40} className="mx-auto opacity-20" />
                          </div>
                          <p className="text-gray-500 font-medium">No students found matching your criteria</p>
                          <button
                            onClick={() => {setSearchQuery(''); setCurrentTab('all');}}
                            className="mt-2 text-blue-600 text-sm hover:underline"
                          >
                            Clear all filters
                          </button>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </Layout>
  );
};
export default StudentHealth;