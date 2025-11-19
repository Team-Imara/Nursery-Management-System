import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import Sidebar from "../components/Sidebar";

const StudentDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const student = location.state?.student;

  const defaultStudent = {
    id: 1,
    name: "Unknown Student",
    class: "N/A",
    section: "N/A",
    roll: "N/A",
    guardian: "N/A",
    status: "N/A",
    image: "https://via.placeholder.com/150",
    email: "N/A",
    phone: "N/A",
    joinedDate: "N/A",
    fees: "N/A",
    address: "N/A",
    bio: "No details available.",
  };

  const displayStudent = student || defaultStudent;

  const cardAnimationVariants = {
    initial: { y: 50, opacity: 0 },
    animate: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100, damping: 10, duration: 0.6 },
    },
  };

  return (
    <div className="flex w-full min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 ml-64 p-8">
        {/* Back Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-4 sticky top-0 z-10">
          <div className="flex items-center justify-start">
            <button
              onClick={() => navigate("/students")}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft size={20} />
              Back to Students
            </button>
          </div>
        </header>

        <main className="pt-8">
          <motion.div
            className="max-w-3xl mx-auto"
            variants={cardAnimationVariants}
            initial="initial"
            animate="animate"
          >
            {/* Student Card */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
              <div className="flex items-start gap-6 mb-6">
                <div className="w-32 h-32 rounded-full overflow-hidden flex-shrink-0">
                  <img
                    src={displayStudent.image}
                    alt={displayStudent.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h1 className="text-3xl font-bold text-gray-900 mb-1">
                    {displayStudent.name}
                  </h1>
                  <p className="text-lg text-gray-600 mb-3">
                    Class {displayStudent.class} - Section {displayStudent.section}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>Roll: {displayStudent.roll}</span>
                      <span>Guardian: {displayStudent.guardian}</span>
                    </div>

                    <span
                      className={`text-sm font-medium px-3 py-1 rounded-full ${
                        displayStudent.status === "Active"
                          ? "bg-green-50 text-green-700"
                          : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {displayStudent.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-6">
                <DetailItem title="Class" value={displayStudent.class} />
                <DetailItem title="Section" value={displayStudent.section} />
                <DetailItem title="Roll No" value={displayStudent.roll} />
                <DetailItem title="Guardian" value={displayStudent.guardian} />
                <DetailItem title="Email" value={displayStudent.email} />
                <DetailItem title="Phone" value={displayStudent.phone} />
                <DetailItem title="Joined Date" value={displayStudent.joinedDate} />
                <DetailItem title="Fees" value={displayStudent.fees} />
                <DetailItem title="Address" value={displayStudent.address} />
                <DetailItem title="Status" value={displayStudent.status} />
              </div>

              {/* Bio */}
              <div className="mt-6">
                <p className="text-sm text-gray-600 mb-1">
                  <strong>Bio:</strong>
                </p>
                <p className="text-lg text-gray-700">{displayStudent.bio}</p>
              </div>
            </div>

            {/* Overview Boxes same UI */}
            {/* <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Overview</h2>
              <div className="grid grid-cols-3 gap-6">
                <StatCard label="Total Students" value="350" />
                <StatCard label="Active Students" value="300" />
                <StatCard label="On Leave" value="50" />
              </div>
            </div> */}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

const DetailItem = ({ title, value }) => (
  <div>
    <p className="text-sm text-gray-600 mb-1">
      <strong>{title}:</strong>
    </p>
    <p className="text-lg">{value}</p>
  </div>
);

const StatCard = ({ label, value }) => (
  <div className="bg-gray-50 rounded-xl p-5 text-center">
    <p className="text-sm text-gray-600 mb-2">{label}</p>
    <p className="text-4xl font-bold text-gray-900">{value}</p>
  </div>
);

export default StudentDetail;
