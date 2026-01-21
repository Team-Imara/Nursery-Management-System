import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Layout from './Layout.jsx';

const AddStudent = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        dob: '',
        gender: '',
        admissionNo: '',
        session: '2024 - 2025',
        guardianName: '',
        relationship: '',
        phone: '',
        email: '',
        address: '',
        class: '',
        section: '',
        startDate: '',
        feePlan: '',
        baselineNotes: '',
        readiness: '',
        math: '',
        language: '',
        science: '',
        arts: '',
        status: 'Draft',
        image: '',
    });

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

    const handleSubmit = (e) => {
        e.preventDefault();

        // Save new student to localStorage
        const existingStudents = JSON.parse(localStorage.getItem('students')) || [];
        // Note: The logic in original file seemed a bit broken on line 63 with 'newStudent', but I will keep it consistent or fix it if obvious.
        // Original: localStorage.setItem('students', JSON.stringify([...existingStudents, newStudent])); -> newStudent was not defined in scope effectively, it used formData in state.
        // I will use formData here as intended.
        localStorage.setItem('students', JSON.stringify([...existingStudents, formData]));

        // Navigate to Student page
        navigate('/students', { state: { newStudent: formData } });
        // Reset form
        setFormData({
            firstName: '',
            lastName: '',
            dob: '',
            gender: '',
            admissionNo: '',
            session: '2024 - 2025',
            guardianName: '',
            relationship: '',
            phone: '',
            email: '',
            address: '',
            class: '',
            section: '',
            startDate: '',
            feePlan: '',
            baselineNotes: '',
            readiness: '',
            math: '',
            language: '',
            science: '',
            arts: '',
            status: 'Draft',
            image: '',
        });
        setPreviewImage(null);
        setShowPreview(false);
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
                    <form className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        {/* Basic Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                                <input
                                    type="date"
                                    name="dob"
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
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Admission No.</label>
                                <input
                                    type="text"
                                    name="admissionNo"
                                    value={formData.admissionNo}
                                    onChange={handleChange}
                                    placeholder="Auto-generated or enter"
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Session</label>
                                <input
                                    type="text"
                                    name="session"
                                    value={formData.session}
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
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">Guardian Details</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Guardian Name</label>
                                <input
                                    type="text"
                                    name="guardianName"
                                    value={formData.guardianName}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Relationship</label>
                                <input
                                    type="text"
                                    name="relationship"
                                    value={formData.relationship}
                                    onChange={handleChange}
                                    placeholder="Mother / Father / Other"
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                <input
                                    type="text"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                <input
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        {/* Class & Enrollment */}
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">Class & Enrollment</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
                                <input
                                    type="text"
                                    name="class"
                                    value={formData.class}
                                    onChange={handleChange}
                                    placeholder="Select KG1 / KG2"
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
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
                                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                                <input
                                    type="date"
                                    name="startDate"
                                    value={formData.startDate}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Fee Plan</label>
                                <input
                                    type="text"
                                    name="feePlan"
                                    value={formData.feePlan}
                                    onChange={handleChange}
                                    placeholder="Monthly / Term"
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        {/* Initial Performance */}
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">Initial Performance</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Baseline Notes</label>
                                <input
                                    type="text"
                                    name="baselineNotes"
                                    value={formData.baselineNotes}
                                    onChange={handleChange}
                                    placeholder="e.g., strengths, areas to support"
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Overall Readiness</label>
                                <select
                                    name="readiness"
                                    value={formData.readiness}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Select (High / Medium / Low)</option>
                                    <option value="High">High</option>
                                    <option value="Medium">Medium</option>
                                    <option value="Low">Low</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Math</label>
                                <input
                                    type="text"
                                    name="math"
                                    value={formData.math}
                                    onChange={handleChange}
                                    placeholder="A / B / C"
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                                <input
                                    type="text"
                                    name="language"
                                    value={formData.language}
                                    onChange={handleChange}
                                    placeholder="A / B / C"
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Science</label>
                                <input
                                    type="text"
                                    name="science"
                                    value={formData.science}
                                    onChange={handleChange}
                                    placeholder="A / B / C"
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Arts</label>
                                <input
                                    type="text"
                                    name="arts"
                                    value={formData.arts}
                                    onChange={handleChange}
                                    placeholder="A / B / C"
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        {/* Status & Buttons */}
                        <div className="flex gap-4">
                            <button
                                type="button"
                                onClick={handlePreview}
                                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                                disabled={!formData.firstName || !formData.lastName || !formData.image}
                            >
                                Preview
                            </button>
                            <button
                                type="submit"
                                onClick={handleSubmit}
                                className="w-full px-6 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors font-medium"
                                disabled={!formData.firstName || !formData.lastName || !formData.image}
                            >
                                Create Student
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
                                        {formData.firstName} {formData.lastName}
                                    </h3>
                                    <p className="text-lg text-gray-600 mb-3">{formData.class} • {formData.section}</p>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4 text-sm text-gray-600">
                                            <span>Guardian: {formData.guardianName || 'N/A'}</span>
                                            <span>{formData.relationship || 'N/A'}</span>
                                        </div>
                                        <span
                                            className={`text-sm font-medium px-3 py-1 rounded-full ${formData.status === 'Draft'
                                                    ? 'bg-gray-100 text-gray-700'
                                                    : 'bg-green-50 text-green-700'
                                                }`}
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