import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { motion } from 'framer-motion';
import Layout from '../components/Layout.jsx';

const StudentHealth = () => {
  const { students, updateStudentHealth, addStudent } = useAppContext();
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [name, setName] = useState('');
  const [grade, setGrade] = useState('');
  const [allergies, setAllergies] = useState('');
  const [healthIssues, setHealthIssues] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [emergencyFirstAid, setEmergencyFirstAid] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState('');
  const [currentTab, setCurrentTab] = useState('all');

  const handleStudentSelect = (studentId) => {
    const student = students.find(s => s.id === parseInt(studentId));
    setSelectedStudent(student);
    if (student) {
      setName(student.name);
      setGrade(student.grade);
      setAllergies(student.allergies?.join(', ') || '');
      setHealthIssues(student.healthIssues?.join(', ') || '');
      setEmergencyContact(student.emergencyContact || '');
      setEmergencyFirstAid(student.emergencyFirstAid || '');
    } else {
      setName('');
      setGrade('');
      setAllergies('');
      setHealthIssues('');
      setEmergencyContact('');
      setEmergencyFirstAid('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!name.trim() || !grade) {
      setError('Please provide student name and grade');
      return;
    }
    const allergiesArray = allergies
      .split(',')
      .map(item => item.trim())
      .filter(item => item.length > 0);
    const healthIssuesArray = healthIssues
      .split(',')
      .map(item => item.trim())
      .filter(item => item.length > 0);
    const data = {
      allergies: allergiesArray,
      healthIssues: healthIssuesArray,
      emergencyContact: emergencyContact.trim(),
      emergencyFirstAid: emergencyFirstAid.trim()
    };
    if (selectedStudent) {
      updateStudentHealth(selectedStudent.id, data);
    } else {
      const newId = students.length ? Math.max(...students.map(s => s.id)) + 1 : 1;
      const newStudent = {
        id: newId,
        name: name.trim(),
        grade,
        ...data
      };
      addStudent(newStudent);
    }
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
    handleClear();
  };

  const handleClear = () => {
    setSelectedStudent(null);
    setName('');
    setGrade('');
    setAllergies('');
    setHealthIssues('');
    setEmergencyContact('');
    setEmergencyFirstAid('');
    setError('');
  };

  const filteredStudents = currentTab === 'all'
    ? students
    : students.filter(s => s.grade === currentTab);

  return (
    <Layout>
      <main className="max-w-6xl mx-auto p-8 flex flex-col gap-8">
        <motion.div
          initial="initial"
          animate="animate"
          variants={{
            animate: { transition: { staggerChildren: 0.15 } },
          }} className="bg-white rounded-xl p-8 shadow-md">
          <h2 className="text-xl text-blue-800 mb-6">Manage Student Health Information</h2>
          {showSuccess && (
            <div className="p-4 rounded-lg mb-6 font-medium bg-green-100 text-green-800 border border-green-400" role="alert">
              ✓ Health information updated successfully!
            </div>
          )}
          {error && (
            <div className="p-4 rounded-lg mb-6 font-medium bg-red-100 text-red-800 border border-red-400" role="alert">
              ✗ {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label htmlFor="student-select" className="font-semibold text-gray-800 text-base">Select Student to Edit (or leave blank to add new):</label>
              <select
                id="student-select"
                value={selectedStudent?.id || ''}
                onChange={(e) => handleStudentSelect(e.target.value)}
                className="p-3 border-2 border-slate-200 rounded-lg text-base font-inherit transition-colors duration-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="">-- Add New Student --</option>
                {students.map(student => (
                  <option key={student.id} value={student.id}>
                    {student.name} ({student.grade.toUpperCase()})
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="name" className="font-semibold text-gray-800 text-base">Student Name: *</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="p-3 border-2 border-slate-200 rounded-lg text-base font-inherit transition-colors duration-200 focus:outline-none focus:border-indigo-500"
                disabled={!!selectedStudent}
                required
                placeholder="Enter student name"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="grade" className="font-semibold text-gray-800 text-base">Grade: *</label>
              <select
                id="grade"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="p-3 border-2 border-slate-200 rounded-lg text-base font-inherit transition-colors duration-200 focus:outline-none focus:border-indigo-500"
                disabled={!!selectedStudent}
                required
              >
                <option value="">-- Select Grade --</option>
                <option value="kg1">Kindergarten1</option>
                <option value="kg2">Kindergarten2</option>
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="allergies" className="font-semibold text-gray-800 text-base">Allergies:</label>
              <textarea
                id="allergies"
                value={allergies}
                onChange={(e) => setAllergies(e.target.value)}
                className="p-3 border-2 border-slate-200 rounded-lg text-base font-inherit transition-colors duration-200 focus:outline-none focus:border-indigo-500"
                rows="3"
                placeholder="Enter allergies separated by commas (e.g., peanuts, dairy, eggs)"
                aria-describedby="allergies-help"
              />
              <small id="allergies-help" className="text-gray-500 text-sm">
                Separate multiple allergies with commas
              </small>
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="health-issues" className="font-semibold text-gray-800 text-base">Health Issues:</label>
              <textarea
                id="health-issues"
                value={healthIssues}
                onChange={(e) => setHealthIssues(e.target.value)}
                className="p-3 border-2 border-slate-200 rounded-lg text-base font-inherit transition-colors duration-200 focus:outline-none focus:border-indigo-500"
                rows="3"
                placeholder="Enter health issues separated by commas (e.g., asthma, diabetes)"
                aria-describedby="health-help"
              />
              <small id="health-help" className="text-gray-500 text-sm">
                Separate multiple issues with commas
              </small>
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="emergency-contact" className="font-semibold text-gray-800 text-base">Emergency Contact:</label>
              <input
                id="emergency-contact"
                type="text"
                value={emergencyContact}
                onChange={(e) => setEmergencyContact(e.target.value)}
                className="p-3 border-2 border-slate-200 rounded-lg text-base font-inherit transition-colors duration-200 focus:outline-none focus:border-indigo-500"
                placeholder="Enter emergency contact (e.g., phone number or name)"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="emergency-firstaid" className="font-semibold text-gray-800 text-base">Emergency First Aid Instructions:</label>
              <textarea
                id="emergency-firstaid"
                value={emergencyFirstAid}
                onChange={(e) => setEmergencyFirstAid(e.target.value)}
                className="p-3 border-2 border-slate-200 rounded-lg text-base font-inherit transition-colors duration-200 focus:outline-none focus:border-indigo-500"
                rows="3"
                placeholder="Enter any specific first aid instructions"
              />
            </div>
            <div className="flex gap-4 flex-col sm:flex-row">
              <button type="submit" className="py-[0.875rem] px-[1.5rem] border-none rounded-lg text-base font-semibold cursor-pointer transition duration-200 flex-1 bg-indigo-500 text-white hover:bg-indigo-600 focus:outline-2 focus:outline-indigo-500 focus:outline-offset-2">
                {selectedStudent ? 'Update Health Information' : 'Add Student'}
              </button>
              <button type="button" onClick={handleClear} className="py-[0.875rem] px-[1.5rem] border-none rounded-lg text-base font-semibold cursor-pointer transition duration-200 flex-1 bg-slate-200 text-gray-800 hover:bg-slate-300 focus:outline-2 focus:outline-slate-300 focus:outline-offset-2">
                Clear Form
              </button>
            </div>
          </form>
        </motion.div>
        <section className="bg-white rounded-xl p-8 shadow-md">
          <h2 className="text-xl text-gray-800 mb-6">All Students Health Overview</h2>
          <div className="flex space-x-2 mb-4">
            <button
              onClick={() => setCurrentTab('all')}
              className={`${currentTab === 'all' ? 'bg-white text-indigo-500 border-b-2 border-indigo-500' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'} px-4 py-2 rounded-t-lg font-medium focus:outline-none transition-colors duration-200`}
            >
              All Students
            </button>
            <button
              onClick={() => setCurrentTab('kg1')}
              className={`${currentTab === 'kg1' ? 'bg-white text-indigo-500 border-b-2 border-indigo-500' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'} px-4 py-2 rounded-t-lg font-medium focus:outline-none transition-colors duration-200`}
            >
              Kindergarten1
            </button>
            <button
              onClick={() => setCurrentTab('kg2')}
              className={`${currentTab === 'kg2' ? 'bg-white text-indigo-500 border-b-2 border-indigo-500' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'} px-4 py-2 rounded-t-lg font-medium focus:outline-none transition-colors duration-200`}
            >
              Kindergarten2
            </button>
          </div>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Allergies</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Health Issues</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Emergency Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Emergency First Aid</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStudents.map(student => (
                <tr key={student.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.grade.toUpperCase()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.allergies?.join(', ') || 'None'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.healthIssues?.join(', ') || 'None'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.emergencyContact || 'None'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.emergencyFirstAid || 'None'}</td>
                </tr>
              ))}
              {filteredStudents.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">No students in this category</td>
                </tr>
              )}
            </tbody>
          </table>
        </section>
      </main>
    </Layout>
  );
}
export default StudentHealth;