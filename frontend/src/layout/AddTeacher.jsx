import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Sidebar from '../components/Sidebar';

const AddTeacher = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        subject: '',
        class: '',
        room: '',
        experience: '',
        status: 'Active',
        image: '',
        email: '',
        phone: '',
        joinedDate: '',
        qualifications: '',
        bio: '',
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

    const handlePreview = () => {
        setShowPreview(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Pass the new teacher data back to Teachers component via navigation state
        navigate('/teachers', { state: { newTeacher: formData } });
        // Clear form and preview
        setFormData({
            name: '',
            subject: '',
            class: '',
            room: '',
            experience: '',
            status: 'Active',
            image: '',
            email: '',
            phone: '',
            joinedDate: '',
            qualifications: '',
            bio: '',
        });
        setPreviewImage(null);
        setShowPreview(false);
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
                    <div className="max-w-2xl mx-auto">
                        <h1 className="text-3xl font-bold text-gray-900 mb-6">Add New Teacher</h1>
                        <form className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                                    <input
                                        type="text"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
                                    <input
                                        type="text"
                                        name="class"
                                        value={formData.class}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Room</label>
                                    <input
                                        type="text"
                                        name="room"
                                        value={formData.room}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Experience</label>
                                    <input
                                        type="text"
                                        name="experience"
                                        value={formData.experience}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                    <select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="Active">Active</option>
                                        <option value="On Leave">On Leave</option>
                                    </select>
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                                    <div className="flex gap-4">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        <input
                                            type="text"
                                            name="image"
                                            value={formData.image}
                                            onChange={handleChange}
                                            placeholder="Or enter image URL"
                                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    {previewImage && (
                                        <div className="mt-4">
                                            <p className="text-sm text-gray-600 mb-1">Image Preview:</p>
                                            <img
                                                src={previewImage}
                                                alt="Preview"
                                                className="w-32 h-32 object-cover rounded-lg"
                                            />
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
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
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Joined Date</label>
                                    <input
                                        type="date"
                                        name="joinedDate"
                                        value={formData.joinedDate}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Qualifications</label>
                                    <input
                                        type="text"
                                        name="qualifications"
                                        value={formData.qualifications}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                                <textarea
                                    name="bio"
                                    value={formData.bio}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-24 resize-none"
                                    required
                                />
                            </div>
                            <div className="flex gap-4">
                                <button
                                    type="button"
                                    onClick={handlePreview}
                                    className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                                    disabled={!formData.name || !formData.subject || !formData.image}
                                >
                                    Preview
                                </button>
                                <button
                                    type="submit"
                                    onClick={handleSubmit}
                                    className="w-full px-6 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors font-medium"
                                    disabled={!formData.name || !formData.subject || !formData.image}
                                >
                                    Create Teacher
                                </button>
                            </div>
                        </form>

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
                                        <h3 className="text-2xl font-bold text-gray-900 mb-1">{formData.name || 'N/A'}</h3>
                                        <p className="text-lg text-gray-600 mb-3">{formData.subject || 'N/A'}</p>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4 text-sm text-gray-600">
                                                <span>{formData.room || 'N/A'}</span>
                                                <span>{formData.experience || 'N/A'}</span>
                                            </div>
                                            <span
                                                className={`text-sm font-medium px-3 py-1 rounded-full ${
                                                    formData.status === 'Active'
                                                        ? 'bg-green-50 text-green-700'
                                                        : 'bg-amber-50 text-amber-700'
                                                }`}
                                            >
                                                {formData.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <p className="text-sm text-gray-600"><strong>Class:</strong> {formData.class || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600"><strong>Room:</strong> {formData.room || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600"><strong>Experience:</strong> {formData.experience || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600"><strong>Status:</strong> {formData.status}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600"><strong>Email:</strong> {formData.email || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600"><strong>Phone:</strong> {formData.phone || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600"><strong>Joined Date:</strong> {formData.joinedDate || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600"><strong>Qualifications:</strong> {formData.qualifications || 'N/A'}</p>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600"><strong>Bio:</strong> {formData.bio || 'N/A'}</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setShowPreview(false)}
                                    className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                                >
                                    Close Preview
                                </button>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AddTeacher;