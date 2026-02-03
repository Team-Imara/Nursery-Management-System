import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Layout from '../components/Layout.jsx';
import axios from '../api/axios';

const AddStudent = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        fullname: '',
        name_with_initials: '',
        calling_name: '',
        dob: '',
        gender: '',
        first_language: '',
        religion: '',
        whatsapp_number: '',
        address: '',
        father_name: '',
        father_contact: '',
        mother_name: '',
        mother_contact: '',
        father_occupation: '',
        mother_occupation: '',
        father_nic: '',
        mother_nic: '',
        guardian_type: 'father',
        guardian_name: '',
        guardian_contact: '',
        guardian_occupation: '',
        guardian_nic: '',
        guardian_address: '',
        class_id: '',
        section: '',
        academic_year: new Date().getFullYear().toString(),
        end_year: (new Date().getFullYear() + 1).toString(),
        enrollment_date: new Date().toISOString().split('T')[0],
        assessment_reading: '',
        assessment_writing: '',
        assessment_numbers: '',
        assessment_language_tamil: '',
        assessment_language_english: '',
        assessment_language_sinhala: '',
        assessment_drawing: '',
        assessment_notes: '',
        status: 'Active',
        image: '',
    });

    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetchingClasses, setFetchingClasses] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const response = await axios.get('/classes');
                setClasses(response.data);
            } catch (err) {
                console.error('Error fetching classes:', err);
                setError('Failed to load classes. Please try again.');
            } finally {
                setFetchingClasses(false);
            }
        };
        fetchClasses();
    }, []);

    const [previewImage, setPreviewImage] = useState(null);
    const [showPreview, setShowPreview] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
                setFormData((prev) => ({ ...prev, image: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handlePreview = () => setShowPreview(true);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await axios.post('/students', formData);

            // Navigate to Student page with the new student
            navigate('/students', { state: { newStudent: response.data } });
        } catch (err) {
            console.error('Error creating student:', err);
            setError(err.response?.data?.message || 'Failed to create student. Please check the form.');
        } finally {
            setLoading(false);
        }
    };

    const headerContent = (
        <div className="flex items-center justify-start">
            <button
                onClick={() => navigate('/students')}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
            >
                <ArrowLeft size={20} />
                Back to Students
            </button>
        </div>
    );

    return (
        <Layout headerContent={headerContent}>
            <div className="pt-8">
                <div className="max-w-3xl mx-auto">
                    <h1 className="text-3xl font-bold text-gray-900 mb-6">Add New Student</h1>
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                            {error}
                        </div>
                    )}
                    <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        {/* Personal Details */}
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Personal Details</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                <input
                                    type="text"
                                    name="fullname"
                                    required
                                    value={formData.fullname}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Name with Initials</label>
                                <input
                                    type="text"
                                    name="name_with_initials"
                                    value={formData.name_with_initials}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Name by which child is called</label>
                                <input
                                    type="text"
                                    name="calling_name"
                                    value={formData.calling_name}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                                <input
                                    type="date"
                                    name="dob"
                                    required
                                    value={formData.dob}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                                <select
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Select gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">First Language</label>
                                <input
                                    type="text"
                                    name="first_language"
                                    value={formData.first_language}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Religion</label>
                                <input
                                    type="text"
                                    name="religion"
                                    value={formData.religion}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Upload Photo</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                {previewImage && (
                                    <div className="mt-4">
                                        <img
                                            src={previewImage}
                                            alt="Preview"
                                            className="w-32 h-32 object-cover rounded-lg"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Guardian Details */}
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold text-gray-900">Guardian Details</h2>

                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Number</label>
                                <input
                                    type="text"
                                    name="whatsapp_number"
                                    value={formData.whatsapp_number}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                <textarea
                                    name="address"
                                    rows="2"
                                    value={formData.address}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div className="col-span-2 border-t pt-4 mt-2">
                                <h3 className="text-md font-medium text-gray-900 mb-4">Father's Details</h3>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Father's Name</label>
                                <input
                                    type="text"
                                    name="father_name"
                                    value={formData.father_name}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Father's Contact Number</label>
                                <input
                                    type="text"
                                    name="father_contact"
                                    value={formData.father_contact}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Father's Occupation</label>
                                <input
                                    type="text"
                                    name="father_occupation"
                                    value={formData.father_occupation}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Father's NIC</label>
                                <input
                                    type="text"
                                    name="father_nic"
                                    value={formData.father_nic}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div className="col-span-2 border-t pt-4 mt-2">
                                <h3 className="text-md font-medium text-gray-900 mb-4">Mother's Details</h3>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Mother's Name</label>
                                <input
                                    type="text"
                                    name="mother_name"
                                    value={formData.mother_name}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Mother's Contact Number</label>
                                <input
                                    type="text"
                                    name="mother_contact"
                                    value={formData.mother_contact}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Mother's Occupation</label>
                                <input
                                    type="text"
                                    name="mother_occupation"
                                    value={formData.mother_occupation}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Mother's NIC</label>
                                <input
                                    type="text"
                                    name="mother_nic"
                                    value={formData.mother_nic}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <label className="text-sm font-medium text-gray-700">Guardian Type:</label>
                                <select
                                    name="guardian_type"
                                    value={formData.guardian_type}
                                    onChange={handleChange}
                                    className="px-3 py-1 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="father">Father</option>
                                    <option value="mother">Mother</option>
                                    <option value="others">Others</option>
                                </select>
                            </div>

                            {formData.guardian_type === 'others' && (
                                <>
                                    <div className="col-span-2 border-t pt-4 mt-2">
                                        <h3 className="text-md font-medium text-gray-900 mb-4">Other Guardian Details</h3>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Guardian Name</label>
                                        <input
                                            type="text"
                                            name="guardian_name"
                                            value={formData.guardian_name}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Guardian Contact Number</label>
                                        <input
                                            type="text"
                                            name="guardian_contact"
                                            value={formData.guardian_contact}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Guardian Occupation</label>
                                        <input
                                            type="text"
                                            name="guardian_occupation"
                                            value={formData.guardian_occupation}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Guardian Address</label>
                                        <textarea
                                            name="guardian_address"
                                            rows="2"
                                            value={formData.guardian_address}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Class & Enrollment */}
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Class & Enrollment</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
                                <select
                                    name="class_id"
                                    required
                                    value={formData.class_id}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    disabled={fetchingClasses}
                                >
                                    <option value="">Select class</option>
                                    {classes.map((cls) => (
                                        <option key={cls.id} value={cls.id}>
                                            {cls.classname}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Section</label>
                                <input
                                    type="text"
                                    name="section"
                                    value={formData.section}
                                    onChange={handleChange}
                                    placeholder="A / B / C"
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Academic Year (Start)</label>
                                <input
                                    type="text"
                                    name="academic_year"
                                    required
                                    value={formData.academic_year}
                                    onChange={handleChange}
                                    placeholder="e.g., 2024"
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">End Year</label>
                                <input
                                    type="text"
                                    name="end_year"
                                    value={formData.end_year}
                                    onChange={handleChange}
                                    placeholder="e.g., 2025"
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Enrollment Date</label>
                                <input
                                    type="date"
                                    name="enrollment_date"
                                    value={formData.enrollment_date}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        {/* Initial Performance */}
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Initial Performance Assessment</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Reading</label>
                                <select
                                    name="assessment_reading"
                                    value={formData.assessment_reading}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Select assessment</option>
                                    <option value="Excellent">Excellent</option>
                                    <option value="Very Good">Very Good</option>
                                    <option value="Good">Good</option>
                                    <option value="Can Improve">Can Improve</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Writing</label>
                                <select
                                    name="assessment_writing"
                                    value={formData.assessment_writing}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Select assessment</option>
                                    <option value="Excellent">Excellent</option>
                                    <option value="Very Good">Very Good</option>
                                    <option value="Good">Good</option>
                                    <option value="Can Improve">Can Improve</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Numbers</label>
                                <select
                                    name="assessment_numbers"
                                    value={formData.assessment_numbers}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Select assessment</option>
                                    <option value="Excellent">Excellent</option>
                                    <option value="Very Good">Very Good</option>
                                    <option value="Good">Good</option>
                                    <option value="Can Improve">Can Improve</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Language Skills (Tamil)</label>
                                <select
                                    name="assessment_language_tamil"
                                    value={formData.assessment_language_tamil}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Select assessment</option>
                                    <option value="Excellent">Excellent</option>
                                    <option value="Very Good">Very Good</option>
                                    <option value="Good">Good</option>
                                    <option value="Can Improve">Can Improve</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Language Skills (English)</label>
                                <select
                                    name="assessment_language_english"
                                    value={formData.assessment_language_english}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Select assessment</option>
                                    <option value="Excellent">Excellent</option>
                                    <option value="Very Good">Very Good</option>
                                    <option value="Good">Good</option>
                                    <option value="Can Improve">Can Improve</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Language Skills (Sinhala)</label>
                                <select
                                    name="assessment_language_sinhala"
                                    value={formData.assessment_language_sinhala}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Select assessment</option>
                                    <option value="Excellent">Excellent</option>
                                    <option value="Very Good">Very Good</option>
                                    <option value="Good">Good</option>
                                    <option value="Can Improve">Can Improve</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Drawing</label>
                                <select
                                    name="assessment_drawing"
                                    value={formData.assessment_drawing}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Select assessment</option>
                                    <option value="Excellent">Excellent</option>
                                    <option value="Very Good">Very Good</option>
                                    <option value="Good">Good</option>
                                    <option value="Can Improve">Can Improve</option>
                                </select>
                            </div>
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Additional Notes</label>
                                <textarea
                                    name="assessment_notes"
                                    rows="3"
                                    value={formData.assessment_notes}
                                    onChange={handleChange}
                                    placeholder="Any additional initial observations..."
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-4">
                            <button
                                type="button"
                                onClick={handlePreview}
                                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
                                disabled={!formData.fullname || !formData.class_id || loading}
                            >
                                Preview
                            </button>
                            <button
                                type="submit"
                                className="w-full px-6 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors font-medium flex items-center justify-center gap-2"
                                disabled={!formData.fullname || !formData.class_id || loading}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="animate-spin" size={20} />
                                        Creating...
                                    </>
                                ) : (
                                    'Create Student'
                                )}
                            </button>
                        </div>
                    </form>

                    {/* Preview */}
                    {showPreview && (
                        <div className="mt-6 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Preview</h2>
                            <div className="flex items-start gap-6 mb-6">
                                <div className="w-32 h-32 rounded-full overflow-hidden flex-shrink-0">
                                    <img
                                        src={previewImage || formData.image || 'https://via.placeholder.com/150'}
                                        alt="Preview"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-2xl font-bold text-gray-900 mb-1">
                                        {formData.fullname}
                                    </h3>
                                    <p className="text-lg text-gray-600 mb-3">
                                        {classes.find(c => c.id == formData.class_id)?.classname || 'N/A'} • {formData.section || 'N/A'}
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <div className="flex flex-col gap-1 text-sm text-gray-600">
                                            <span>Guardian Type: {formData.guardian_type}</span>
                                            <span>WhatsApp: {formData.whatsapp_number || 'N/A'}</span>
                                        </div>
                                        <span
                                            className="text-sm font-medium px-3 py-1 rounded-full bg-green-50 text-green-700"
                                        >
                                            {formData.status}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default AddStudent;