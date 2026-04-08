import { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Layout from '../components/Layout.jsx';
import axios from '../api/axios';

const EditStudent = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const location = useLocation();

    // Initial state
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
        academic_year: '',
        end_year: '',
        enrollment_date: '',
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
        uniform_details: '',
        favourite_toys: '',
        emergency_contact_name: '',
        emergency_contact_phone: '',
        allergies: '',
        height: '',
        weight: '',
        special_needs: '',
        health_notes: ''
    });

    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetchingData, setFetchingData] = useState(true);
    const [error, setError] = useState(null);
    const [fieldErrors, setFieldErrors] = useState({});

    const getFieldClass = (fieldName) => `w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${fieldErrors[fieldName] ? "border-red-500 bg-red-50" : "border-gray-200"}`;

    const [previewImage, setPreviewImage] = useState(null);
    const [showPreview, setShowPreview] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            try {
                // Fetch Classes
                const classesResponse = await axios.get('/classes');
                setClasses(classesResponse.data);

                // Fetch Student Data
                let studentData = location.state?.student;
                if (!studentData && id) {
                    const response = await axios.get(`/students/${id}`);
                    studentData = response.data;
                }

                if (studentData) {
                    // Map student data to form fields
                    // Ensure null values are converted to empty strings for controlled inputs
                    const mappedData = {};
                    Object.keys(formData).forEach(key => {
                        mappedData[key] = studentData[key] || '';
                    });

                    // Handle specific fields if needed
                    if (studentData.classe && studentData.classe.id) {
                        mappedData.class_id = studentData.classe.id;
                    }
                    // If class_id is directly available
                    if (studentData.class_id) {
                        mappedData.class_id = studentData.class_id;
                    }

                    // Handle date formatting if necessary (backend usually sends YYYY-MM-DD or ISO)
                    if (mappedData.dob) mappedData.dob = mappedData.dob.split('T')[0];
                    if (mappedData.enrollment_date) mappedData.enrollment_date = mappedData.enrollment_date.split('T')[0];

                    setFormData(mappedData);
                    const initialImage = studentData.image_url || studentData.image;
                    if (initialImage) {
                        setPreviewImage(initialImage);
                    }
                }
            } catch (err) {
                console.error('Error loading data:', err);
                setError('Failed to load student data.');
            } finally {
                setFetchingData(false);
            }
        };
        loadData();
    }, [id, location.state]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (fieldErrors[name]) {
            setFieldErrors(prev => {
                const newErrs = { ...prev };
                delete newErrs[name];
                return newErrs;
            });
        }
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


        // Validation: All fields mandatory
        const emptyFields = Object.entries(formData).filter(([key, value]) => {
            if (key === 'image' && !value) return false;
            if (key === 'created_at' || key === 'updated_at' || key === 'deleted_at' || key === 'classe' || key === 'tenant_id' || key === 'status') return false;

            if (key.startsWith('guardian_') && key !== 'guardian_type' && formData.guardian_type !== 'others') {
                return false;
            }
            if (!value || value.toString().trim() === '') {
                return true;
            }
            return false;
        });

        let newErrors = {};
        let hasError = false;

        if (emptyFields.length > 0) {
            emptyFields.forEach(f => {
                newErrors[f[0]] = "This field is required";
            });
            hasError = true;
        }

        // Validation: Contact numbers must be exactly 11 digits
        const contactFields = [
            { id: 'whatsapp_number', name: 'WhatsApp Number', value: formData.whatsapp_number },
            { id: 'father_contact', name: 'Father Contact Number', value: formData.father_contact },
            { id: 'mother_contact', name: 'Mother Contact Number', value: formData.mother_contact },
            { id: 'emergency_contact_phone', name: 'Emergency Contact Phone', value: formData.emergency_contact_phone }
        ];

        if (formData.guardian_type === 'others') {
            contactFields.push({ id: 'guardian_contact', name: 'Guardian Contact Number', value: formData.guardian_contact });
        }

        const phoneRegex = /^\d{11}$/;
        for (let contact of contactFields) {
            if (contact.value && !phoneRegex.test(contact.value)) {
                newErrors[contact.id] = "Must be exactly 11 digits";
                hasError = true;
            }
        }

        if (hasError) {
            setFieldErrors(newErrors);
            setError("Please correct the highlighted fields below.");
            setLoading(false);
            return;
        }

        try {
            const response = await axios.put(`/students/${id}`, formData);

            // Navigate back to Student Detail or Students list
            navigate('/students', { state: { updatedStudent: response.data } });
        } catch (err) {
            console.error('Error updating student:', err);
            setError(err.response?.data?.message || 'Failed to update student.');
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

    if (fetchingData) {
        return (
            <Layout headerContent={headerContent}>
                <div className="flex items-center justify-center h-screen">
                    <Loader2 className="animate-spin text-blue-600" size={40} />
                </div>
            </Layout>
        );
    }

    return (
        <Layout headerContent={headerContent}>
            <div className="pt-8">
                <div className="max-w-3xl mx-auto">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-3xl font-bold text-gray-900">Edit Student</h1>
                    </div>

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
                                    className={getFieldClass("fullname")}
                                />
                                {fieldErrors.fullname && <span className="text-xs text-red-500 mt-1 block font-medium">{fieldErrors.fullname}</span>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Name with Initials</label>
                                <input
                                    type="text"
                                    name="name_with_initials"
                                    value={formData.name_with_initials}
                                    onChange={handleChange}
                                    className={getFieldClass("name_with_initials")}
                                />
                                {fieldErrors.name_with_initials && <span className="text-xs text-red-500 mt-1 block font-normal"></span>}

                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Name by which child is called</label>
                                <input
                                    type="text"
                                    name="calling_name"
                                    value={formData.calling_name}
                                    onChange={handleChange}
                                    className={getFieldClass("calling_name")}
                                />
                                {fieldErrors.calling_name && <span className="text-xs text-red-500 mt-1 block font-normal"></span>}

                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                                <input
                                    type="date"
                                    name="dob"
                                    required
                                    value={formData.dob}
                                    onChange={handleChange}
                                    className={getFieldClass("dob")}
                                />
                                {fieldErrors.dob && <span className="text-xs text-red-500 mt-1 block font-normal"></span>}

                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                                <select
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleChange}
                                    className={getFieldClass("gender")}
                                >
                                    <option value="">Select gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                                {fieldErrors.gender && <span className="text-sm text-red-500 mt-1 block font-medium">{fieldErrors.gender}</span>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">First Language</label>
                                <input
                                    type="text"
                                    name="first_language"
                                    value={formData.first_language}
                                    onChange={handleChange}
                                    className={getFieldClass("first_language")}
                                />
                                {fieldErrors.first_language && <span className="text-xs text-red-500 mt-1 block font-normal"></span>}

                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Religion</label>
                                <input
                                    type="text"
                                    name="religion"
                                    value={formData.religion}
                                    onChange={handleChange}
                                    className={getFieldClass("religion")}
                                />
                                {fieldErrors.religion && <span className="text-xs text-red-500 mt-1 block font-normal"></span>}

                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Uniform Details</label>
                                <input
                                    type="text"
                                    name="uniform_details"
                                    value={formData.uniform_details}
                                    onChange={handleChange}
                                    placeholder="Size, etc."
                                    className={getFieldClass("uniform_details")}
                                />
                                {fieldErrors.uniform_details && <span className="text-xs text-red-500 mt-1 block font-normal"></span>}

                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Favourite Toy / Activity</label>
                                <input
                                    type="text"
                                    name="favourite_toys"
                                    value={formData.favourite_toys}
                                    onChange={handleChange}
                                    className={getFieldClass("favourite_toys")}
                                />
                                {fieldErrors.favourite_toys && <span className="text-xs text-red-500 mt-1 block font-normal"></span>}

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
                                    className={getFieldClass("whatsapp_number")}
                                />
                                {fieldErrors.whatsapp_number && <span className="text-xs text-red-500 mt-1 block font-normal"></span>}

                            </div>
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                <textarea
                                    name="address"
                                    rows="2"
                                    value={formData.address}
                                    onChange={handleChange}
                                    className={getFieldClass("address")}
                                />
                                {fieldErrors.address && <span className="text-xs text-red-500 mt-1 block font-normal"></span>}

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
                                    className={getFieldClass("father_name")}
                                />
                                {fieldErrors.father_name && <span className="text-xs text-red-500 mt-1 block font-normal"></span>}

                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Father's Contact Number</label>
                                <input
                                    type="text"
                                    name="father_contact"
                                    value={formData.father_contact}
                                    onChange={handleChange}
                                    className={getFieldClass("father_contact")}
                                />
                                {fieldErrors.father_contact && <span className="text-xs text-red-500 mt-1 block font-normal"></span>}

                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Father's Occupation</label>
                                <input
                                    type="text"
                                    name="father_occupation"
                                    value={formData.father_occupation}
                                    onChange={handleChange}
                                    className={getFieldClass("father_occupation")}
                                />
                                {fieldErrors.father_occupation && <span className="text-xs text-red-500 mt-1 block font-normal"></span>}

                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Father's NIC</label>
                                <input
                                    type="text"
                                    name="father_nic"
                                    value={formData.father_nic}
                                    onChange={handleChange}
                                    className={getFieldClass("father_nic")}
                                />
                                {fieldErrors.father_nic && <span className="text-xs text-red-500 mt-1 block font-normal"></span>}

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
                                    className={getFieldClass("mother_name")}
                                />
                                {fieldErrors.mother_name && <span className="text-xs text-red-500 mt-1 block font-normal"></span>}

                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Mother's Contact Number</label>
                                <input
                                    type="text"
                                    name="mother_contact"
                                    value={formData.mother_contact}
                                    onChange={handleChange}
                                    className={getFieldClass("mother_contact")}
                                />
                                {fieldErrors.mother_contact && <span className="text-xs text-red-500 mt-1 block font-normal"></span>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Mother's Occupation</label>
                                <input
                                    type="text"
                                    name="mother_occupation"
                                    value={formData.mother_occupation}
                                    onChange={handleChange}
                                    className={getFieldClass("mother_occupation")}
                                />
                                {fieldErrors.mother_occupation && <span className="text-xs text-red-500 mt-1 block font-normal"></span>}

                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Mother's NIC</label>
                                <input
                                    type="text"
                                    name="mother_nic"
                                    value={formData.mother_nic}
                                    onChange={handleChange}
                                    className={getFieldClass("mother_nic")}
                                />
                                {fieldErrors.mother_nic && <span className="text-xs text-red-500 mt-1 block font-normal"></span>}

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
                                {fieldErrors.guardian_type && <span className="text-sm text-red-500 mt-1 block font-medium">{fieldErrors.guardian_type}</span>}
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
                                            className={getFieldClass("guardian_name")}
                                        />
                                        {fieldErrors.guardian_name && <span className="text-xs text-red-500 mt-1 block font-normal"></span>}

                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Guardian Contact Number</label>
                                        <input
                                            type="text"
                                            name="guardian_contact"
                                            value={formData.guardian_contact}
                                            onChange={handleChange}
                                            className={getFieldClass("guardian_contact")}
                                        />
                                        {fieldErrors.guardian_contact && <span className="text-xs text-red-500 mt-1 block font-normal"></span>}

                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Guardian Occupation</label>
                                        <input
                                            type="text"
                                            name="guardian_occupation"
                                            value={formData.guardian_occupation}
                                            onChange={handleChange}
                                            className={getFieldClass("guardian_occupation")}
                                        />
                                        {fieldErrors.guardian_occupation && <span className="text-xs text-red-500 mt-1 block font-normal"></span>}

                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Guardian Address</label>
                                        <textarea
                                            name="guardian_address"
                                            rows="2"
                                            value={formData.guardian_address}
                                            onChange={handleChange}
                                            className={getFieldClass("guardian_address")}
                                        />
                                        {fieldErrors.guardian_address && <span className="text-xs text-red-500 mt-1 block font-normal">{fieldErrors.guardian_address}</span>}

                                    </div>
                                </>
                            )}
                        </div>

                        {/* Emergency Contact */}
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Emergency Contact</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Name</label>
                                <input
                                    type="text"
                                    name="emergency_contact_name"
                                    value={formData.emergency_contact_name}
                                    onChange={handleChange}
                                    className={getFieldClass("emergency_contact_name")}
                                />
                                {fieldErrors.emergency_contact_name && <span className="text-xs text-red-500 mt-1 block font-normal">{fieldErrors.emergency_contact_name}</span>}

                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                                <input
                                    type="text"
                                    name="emergency_contact_phone"
                                    value={formData.emergency_contact_phone}
                                    onChange={handleChange}
                                    className={getFieldClass("emergency_contact_phone")}
                                />
                                {fieldErrors.emergency_contact_phone && <span className="text-xs text-red-500 mt-1 block font-normal">{fieldErrors.emergency_contact_phone}</span>}

                            </div>
                        </div>

                        {/* Health & Medical Information */}
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Health & Medical Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Height (cm)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    name="height"
                                    value={formData.height}
                                    onChange={handleChange}
                                    className={getFieldClass("height")}
                                />
                                {fieldErrors.height && <span className="text-xs text-red-500 mt-1 block font-normal">{fieldErrors.height}</span>}

                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    name="weight"
                                    value={formData.weight}
                                    onChange={handleChange}
                                    className={getFieldClass("weight")}
                                />
                                {fieldErrors.weight && <span className="text-xs text-red-500 mt-1 block font-normal">{fieldErrors.weight}</span>}

                            </div>
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Allergies</label>
                                <textarea
                                    name="allergies"
                                    rows="2"
                                    value={formData.allergies}
                                    onChange={handleChange}
                                    placeholder="List any allergies..."
                                    className={getFieldClass("allergies")}
                                />
                                {fieldErrors.allergies && <span className="text-xs text-red-500 mt-1 block font-normal">{fieldErrors.allergies}</span>}

                            </div>
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Special Needs / Requirements</label>
                                <textarea
                                    name="special_needs"
                                    rows="2"
                                    value={formData.special_needs}
                                    onChange={handleChange}
                                    className={getFieldClass("special_needs")}
                                />
                                {fieldErrors.special_needs && <span className="text-xs text-red-500 mt-1 block font-normal">{fieldErrors.special_needs}</span>}

                            </div>
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Health Notes</label>
                                <textarea
                                    name="health_notes"
                                    rows="2"
                                    value={formData.health_notes}
                                    onChange={handleChange}
                                    placeholder="Any other health related notes..."
                                    className={getFieldClass("health_notes")}
                                />
                                {fieldErrors.health_notes && <span className="text-xs text-red-500 mt-1 block font-normal">{fieldErrors.health_notes}</span>}

                            </div>
                        </div>

                        {/* Class & Enrollment */}
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Class & Enrollment</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Class & Section</label>
                                <select
                                    name="class_and_section"
                                    required
                                    value={`${formData.class_id}|${formData.section}`}
                                    onChange={(e) => {
                                        const [classId, section] = e.target.value.split('|');
                                        setFormData(prev => ({
                                            ...prev,
                                            class_id: classId || '',
                                            section: section || ''
                                        }));
                                    }}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    disabled={fetchingData}
                                >
                                    <option value="|">Select class</option>
                                    {classes.flatMap(cls => {
                                        if (!cls.sections || cls.sections.length === 0) {
                                            return [<option key={cls.id} value={`${cls.id}|`}>{cls.classname}</option>];
                                        }
                                        return cls.sections.map(sec => (
                                            <option key={`${cls.id}-${sec}`} value={`${cls.id}|${sec}`}>
                                                {cls.classname} - {sec}
                                            </option>
                                        ));
                                    })}
                                </select>
                                {fieldErrors.class_and_section && <span className="text-xs text-red-500 mt-1 block font-normal">{fieldErrors.class_and_section}</span>}
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
                                    className={getFieldClass("academic_year")}
                                />
                                {fieldErrors.academic_year && <span className="text-xs text-red-500 mt-1 block font-normal">{fieldErrors.academic_year}</span>}

                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">End Year</label>
                                <input
                                    type="text"
                                    name="end_year"
                                    value={formData.end_year}
                                    onChange={handleChange}
                                    placeholder="e.g., 2025"
                                    className={getFieldClass("end_year")}
                                />
                                {fieldErrors.end_year && <span className="text-xs text-red-500 mt-1 block font-normal">{fieldErrors.end_year}</span>}

                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Enrollment Date</label>
                                <input
                                    type="date"
                                    name="enrollment_date"
                                    value={formData.enrollment_date}
                                    onChange={handleChange}
                                    className={getFieldClass("enrollment_date")}
                                />
                                {fieldErrors.enrollment_date && <span className="text-xs text-red-500 mt-1 block font-normal">{fieldErrors.enrollment_date}</span>}

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
                                    className={getFieldClass("assessment_reading")}
                                >
                                    <option value="">Select assessment</option>
                                    <option value="Excellent">Excellent</option>
                                    <option value="Very Good">Very Good</option>
                                    <option value="Good">Good</option>
                                    <option value="Can Improve">Can Improve</option>
                                </select>
                                {fieldErrors.assessment_reading && <span className="text-sm text-red-500 mt-1 block font-medium">{fieldErrors.assessment_reading}</span>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Writing</label>
                                <select
                                    name="assessment_writing"
                                    value={formData.assessment_writing}
                                    onChange={handleChange}
                                    className={getFieldClass("assessment_writing")}
                                >
                                    <option value="">Select assessment</option>
                                    <option value="Excellent">Excellent</option>
                                    <option value="Very Good">Very Good</option>
                                    <option value="Good">Good</option>
                                    <option value="Can Improve">Can Improve</option>
                                </select>
                                {fieldErrors.assessment_writing && <span className="text-sm text-red-500 mt-1 block font-medium">{fieldErrors.assessment_writing}</span>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Numbers</label>
                                <select
                                    name="assessment_numbers"
                                    value={formData.assessment_numbers}
                                    onChange={handleChange}
                                    className={getFieldClass("assessment_numbers")}
                                >
                                    <option value="">Select assessment</option>
                                    <option value="Excellent">Excellent</option>
                                    <option value="Very Good">Very Good</option>
                                    <option value="Good">Good</option>
                                    <option value="Can Improve">Can Improve</option>
                                </select>
                                {fieldErrors.assessment_numbers && <span className="text-sm text-red-500 mt-1 block font-medium">{fieldErrors.assessment_numbers}</span>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Language Skills (Tamil)</label>
                                <select
                                    name="assessment_language_tamil"
                                    value={formData.assessment_language_tamil}
                                    onChange={handleChange}
                                    className={getFieldClass("assessment_language_tamil")}
                                >
                                    <option value="">Select assessment</option>
                                    <option value="Excellent">Excellent</option>
                                    <option value="Very Good">Very Good</option>
                                    <option value="Good">Good</option>
                                    <option value="Can Improve">Can Improve</option>
                                </select>
                                {fieldErrors.assessment_language_tamil && <span className="text-sm text-red-500 mt-1 block font-medium">{fieldErrors.assessment_language_tamil}</span>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Language Skills (English)</label>
                                <select
                                    name="assessment_language_english"
                                    value={formData.assessment_language_english}
                                    onChange={handleChange}
                                    className={getFieldClass("assessment_language_english")}
                                >
                                    <option value="">Select assessment</option>
                                    <option value="Excellent">Excellent</option>
                                    <option value="Very Good">Very Good</option>
                                    <option value="Good">Good</option>
                                    <option value="Can Improve">Can Improve</option>
                                </select>
                                {fieldErrors.assessment_language_english && <span className="text-sm text-red-500 mt-1 block font-medium">{fieldErrors.assessment_language_english}</span>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Language Skills (Sinhala)</label>
                                <select
                                    name="assessment_language_sinhala"
                                    value={formData.assessment_language_sinhala}
                                    onChange={handleChange}
                                    className={getFieldClass("assessment_language_sinhala")}
                                >
                                    <option value="">Select assessment</option>
                                    <option value="Excellent">Excellent</option>
                                    <option value="Very Good">Very Good</option>
                                    <option value="Good">Good</option>
                                    <option value="Can Improve">Can Improve</option>
                                </select>
                                {fieldErrors.assessment_language_sinhala && <span className="text-sm text-red-500 mt-1 block font-medium">{fieldErrors.assessment_language_sinhala}</span>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Drawing</label>
                                <select
                                    name="assessment_drawing"
                                    value={formData.assessment_drawing}
                                    onChange={handleChange}
                                    className={getFieldClass("assessment_drawing")}
                                >
                                    <option value="">Select assessment</option>
                                    <option value="Excellent">Excellent</option>
                                    <option value="Very Good">Very Good</option>
                                    <option value="Good">Good</option>
                                    <option value="Can Improve">Can Improve</option>
                                </select>
                                {fieldErrors.assessment_drawing && <span className="text-sm text-red-500 mt-1 block font-medium">{fieldErrors.assessment_drawing}</span>}
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
                                {fieldErrors.assessment_notes && <span className="text-xs text-red-500 mt-1 block font-light">{fieldErrors.assessment_notes}</span>}

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
                                        Updating...
                                    </>
                                ) : (
                                    'Update Student'
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

export default EditStudent;
