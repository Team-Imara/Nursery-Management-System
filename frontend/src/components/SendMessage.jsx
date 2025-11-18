import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Sidebar from "../components/Sidebar";
import { motion } from "framer-motion";
import { useState } from "react";

const SendMessage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const student = location.state?.student;

  const [message, setMessage] = useState("");
  const [subject, setSubject] = useState("");

  const handleSend = (e) => {
    e.preventDefault();
    alert(`Message sent to ${student?.name || "Student"}:\n\n${message}`);
    setMessage("");
    setSubject("");
  };

  if (!student) {
    return (
      <div className="flex w-full min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 ml-64 p-8">
          <p className="text-center text-gray-600 mt-20">
            ⚠️ No student data found. Please go back and try again.
          </p>
          <div className="text-center mt-4">
            <button
              onClick={() => navigate("/students")}
              className="px-6 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800"
            >
              Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 ml-64 p-8">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-4 sticky top-0 z-10 flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft size={20} />
            Back
          </button>
          <h1 className="text-xl font-semibold text-gray-900">Send Message</h1>
        </header>

        {/* Message Form */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100 p-8 mt-10"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Message to {student.name}
          </h2>
          <p className="text-gray-600 mb-6">
            <strong>Class:</strong> {student.class} •{" "}
            <strong>Email:</strong> {student.email}
          </p>

          <form onSubmit={handleSend} className="space-y-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Subject
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
                placeholder="Enter subject"
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-slate-500"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Message
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                placeholder="Write your message..."
                rows="6"
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-slate-500"
              ></textarea>
            </div>

            <button
              type="submit"
              className="px-6 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors font-medium"
            >
              Send Message
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default SendMessage;
