import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Edit,
  User,
  Users,
  HeartPulse,
  GraduationCap,
  Phone,
  MapPin,
  Calendar,
  ShieldCheck,
  Award,
  BookOpen,
  Scale,
  Ruler,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Layout from "../components/Layout.jsx";
import axios from "../api/axios";

const StudentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("general");

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/students/${id}`);
        setStudent(response.data);
      } catch (err) {
        console.error("Error fetching student:", err);
        setError("Failed to load student details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchStudentData();
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-[70vh]">
          <Loader2 className="animate-spin text-blue-600 mb-4" size={48} />
          <p className="text-gray-500 font-medium animate-pulse">Loading student records...</p>
        </div>
      </Layout>
    );
  }

  if (error || !student) {
    return (
      <Layout>
        <div className="p-8 text-center max-w-md mx-auto">
          <div className="p-4 bg-red-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="text-red-600" size={32} />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Notice</h2>
          <p className="text-gray-600 mb-6">{error || "Student not found."}</p>
          <button
            onClick={() => navigate("/students")}
            className="px-6 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition"
          >
            Go Back
          </button>
        </div>
      </Layout>
    );
  }

  const tabs = [
    { id: "general", label: "General", icon: <User size={18} /> },
    { id: "guardian", label: "Guardian", icon: <Users size={18} /> },
    { id: "health", label: "Health & Medical", icon: <HeartPulse size={18} /> },
    { id: "academic", label: "Academic & Progress", icon: <GraduationCap size={18} /> },
  ];

  const headerContent = (
    <div className="flex items-center justify-between w-full">
      <button
        onClick={() => navigate("/students")}
        className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 rounded-xl hover:bg-gray-100 transition-all font-medium"
      >
        <ArrowLeft size={20} />
        Back
      </button>


    </div>
  );

  return (
    <Layout headerContent={headerContent}>
      <main className="max-w-6xl mx-auto pb-12">
        {/* Profile Summary Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 mb-8 overflow-hidden relative"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/50 rounded-full -mr-32 -mt-32 blur-3xl" />

          <div className="relative flex flex-col md:flex-row items-center gap-8">
            <div className="w-40 h-40 rounded-3xl overflow-hidden shadow-xl border-4 border-white flex-shrink-0 group">
              <img
                src={student.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(student.fullname)}&background=random&size=200`}
                alt={student.fullname}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>

            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-2">
                <h1 className="text-2xl font-bold text-gray-900 leading-tight">
                  {student.fullname}
                </h1>

              </div>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-gray-500 text-sm font-medium">
                <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-lg">
                  <GraduationCap size={14} className="text-blue-500" />
                  {student.classe?.classname || 'No Class'} - {student.section || 'No Section'}
                </div>
                <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-lg">
                  <span className="text-indigo-500 font-bold">#</span>
                  Roll: {student.id}
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin size={14} className="text-red-400" />
                  {student.address || 'Address not set'}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 mb-6 p-1 bg-gray-100/80 backdrop-blur-sm rounded-xl w-fit">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === tab.id
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-500 hover:text-gray-900"
                  }`}
              >
                {tab.icon && <span className="scale-75">{tab.icon}</span>}
                {tab.label}
              </button>
            ))}


          </div>
          <button
            onClick={() => navigate(`/students/edit/${id}`, { state: { student } })}
            className="flex items-center gap-2 mb-6 px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 font-bold"
          >
            <Edit size={18} />
            Edit Profile
          </button>
        </div>
        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm min-h-[400px]"
          >
            {activeTab === "general" && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-8">
                <SectionItem icon={<User />} title="Full Name" value={student.fullname} />
                <SectionItem icon={<User />} title="Initials Name" value={student.name_with_initials} />
                <SectionItem icon={<User />} title="Calling Name" value={student.calling_name} />
                <SectionItem icon={<Calendar />} title="Date of Birth" value={new Date(student.dob).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })} />
                <SectionItem icon={<ShieldCheck />} title="Gender" value={student.gender} isCapitalized />
                <SectionItem icon={<BookOpen />} title="Language" value={student.first_language} />
                <SectionItem icon={<Award />} title="Religion" value={student.religion} />
                <SectionItem icon={<ShieldCheck />} title="Uniform Details" value={student.uniform_details} />
                <SectionItem icon={<Phone />} title="WhatsApp" value={student.whatsapp_number} />
                <SectionItem icon={<Scale />} title="Favourite Activity" value={student.favourite_toys} />
                <SectionItem icon={<MapPin />} title="Postal Address" value={student.address} className="col-span-full md:col-span-2" />
              </div>
            )}

            {activeTab === "guardian" && (
              <div className="space-y-12">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                    <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                      <Users className="text-indigo-500" size={20} /> Father's Details
                    </h3>
                    <div className="space-y-4">
                      <SmallInfoItem label="Name" value={student.father_name} />
                      <SmallInfoItem label="Contact" value={student.father_contact} />
                      <SmallInfoItem label="Occupation" value={student.father_occupation} />
                      <SmallInfoItem label="NIC" value={student.father_nic} />
                    </div>
                  </div>

                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                    <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                      <Users className="text-pink-500" size={20} /> Mother's Details
                    </h3>
                    <div className="space-y-4">
                      <SmallInfoItem label="Name" value={student.mother_name} />
                      <SmallInfoItem label="Contact" value={student.mother_contact} />
                      <SmallInfoItem label="Occupation" value={student.mother_occupation} />
                      <SmallInfoItem label="NIC" value={student.mother_nic} />
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-8">
                  <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <ShieldCheck className="text-blue-500" size={20} /> Primary Guardian
                  </h3>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <SectionItem title="Relationship" value={student.guardian_type} isCapitalized />
                    <SectionItem title="Guardian Name" value={student.guardian_name} />
                    <SectionItem title="Contact Number" value={student.guardian_contact} />
                    <SectionItem title="Occupation" value={student.guardian_occupation} />
                    <SectionItem title="NIC Number" value={student.guardian_nic} />
                    <SectionItem title="Guardian Address" value={student.guardian_address} className="col-span-full" />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "health" && (
              <div className="space-y-10">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <MetricBox icon={<Ruler />} label="Height" value={student.height} unit="cm" />
                  <MetricBox icon={<Scale />} label="Weight" value={student.weight} unit="kg" />
                  <MetricBox icon={<AlertCircle />} label="Allergies" value={student.allergies ? "Yes" : "None"} color="red" />
                  <MetricBox icon={<Loader2 />} label="Status" value="Healthy" color="green" />
                </div>

                <div className="grid md:grid-cols-2 gap-8 mt-10">
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Emergency Contact</h4>
                      <div className="bg-red-50 p-4 rounded-xl border border-red-100">
                        <p className="text-gray-900 font-bold mb-1 text-base">{student.emergency_contact_name || "N/A"}</p>
                        <p className="text-red-600 font-bold flex items-center gap-2 text-lg">
                          <Phone size={16} /> {student.emergency_contact_phone || "N/A"}
                        </p>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                      <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Allergies List</h4>
                      <p className="text-gray-700 font-medium">{student.allergies || "No allergies documented."}</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                      <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Special Needs</h4>
                      <p className="text-gray-700 font-medium">{student.special_needs || "No special needs documented."}</p>
                    </div>

                    <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                      <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Health & Medical Notes</h4>
                      <p className="text-gray-700 font-medium leading-relaxed">{student.health_notes || "No additional health notes."}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "academic" && (
              <div className="space-y-10">
                <div className="grid md:grid-cols-3 gap-8">
                  <SectionItem icon={<GraduationCap />} title="Assigned Class" value={student.classe?.classname} />
                  <SectionItem icon={<Award />} title="Section" value={student.section} />
                  <SectionItem icon={<Calendar />} title="Academic Year" value={`${student.academic_year} - ${student.end_year || 'Now'}`} />
                  <SectionItem icon={<Calendar />} title="Enrollment Date" value={new Date(student.enrollment_date).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })} />
                </div>

                <div className="border-t border-gray-100 pt-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Award className="text-amber-500" size={24} /> Performance Assessment
                  </h3>

                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AssessmentCard label="Reading" value={student.assessment_reading} />
                    <AssessmentCard label="Writing" value={student.assessment_writing} />
                    <AssessmentCard label="Numbers" value={student.assessment_numbers} />
                    <AssessmentCard label="Tamil" value={student.assessment_language_tamil} />
                    <AssessmentCard label="English" value={student.assessment_language_english} />
                    <AssessmentCard label="Sinhala" value={student.assessment_language_sinhala} />
                    <AssessmentCard label="Drawing" value={student.assessment_drawing} className="col-span-full md:col-span-1" />

                    <div className="col-span-full mt-4">
                      <label className="text-sm font-bold text-gray-500 uppercase tracking-wider block mb-2">Teacher's Observations</label>
                      <div className="bg-amber-50/50 p-5 rounded-2xl border border-amber-100 italic text-gray-700 leading-relaxed shadow-inner">
                        "{student.assessment_notes || "No observations recorded yet."}"
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </Layout >
  );
};

const SectionItem = ({ title, value, icon, className = "", isCapitalized = false }) => (
  <div className={`space-y-1.5 ${className}`}>
    <div className="flex items-center gap-2 text-gray-400 capitalize font-bold text-xs tracking-widest">
      {icon && <span className="text-slate-300">{icon}</span>}
      {title}
    </div>
    <div className={`text-gray-900 font-semibold text-base ${isCapitalized ? 'capitalize' : ''}`}>
      {value || "—"}
    </div>
  </div>
);

const SmallInfoItem = ({ label, value }) => (
  <div className="flex justify-between items-center py-2 border-b border-slate-100 last:border-0">
    <span className="text-slate-400 text-sm font-medium">{label}</span>
    <span className="text-slate-900 font-bold">{value || "—"}</span>
  </div>
);

const MetricBox = ({ icon, label, value, unit = "", color = "blue" }) => {
  const colors = {
    blue: "text-blue-600 bg-blue-50 border-blue-100",
    red: "text-red-600 bg-red-50 border-red-100",
    green: "text-green-600 bg-green-50 border-green-100",
    slate: "text-slate-600 bg-slate-50 border-slate-100",
  };

  return (
    <div className={`p-5 rounded-2xl border ${colors[color]} flex items-center gap-4`}>
      <div className={`p-3 rounded-xl bg-white shadow-sm`}>{icon}</div>
      <div>
        <p className="text-xs font-bold uppercase tracking-widest opacity-60 mb-1">{label}</p>
        <p className="text-xl font-bold text-gray-900">
          {value || "—"}<span className="text-xs ml-0.5 opacity-60">{unit}</span>
        </p>
      </div>
    </div>
  );
};

const AssessmentCard = ({ label, value, className = "" }) => {
  const getLevel = (v) => {
    if (!v) return 0;
    if (v === 'Excellent') return 4;
    if (v === 'Very Good') return 3;
    if (v === 'Good') return 2;
    return 1;
  };

  const level = getLevel(value);

  return (
    <div className={`bg-gray-50 border border-gray-100 p-4 rounded-xl ${className}`}>
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">{label}</p>
      <p className={`text-base font-bold mb-2 ${level >= 3 ? 'text-green-600' : 'text-amber-600'}`}>
        {value || "Pending"}
      </p>
      <div className="flex gap-1.5">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className={`h-1.5 flex-1 rounded-full ${i <= level ? 'bg-amber-400' : 'bg-gray-200'}`} />
        ))}
      </div>
    </div>
  );
};

export default StudentDetail;

