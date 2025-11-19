import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const EventDetail = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const event = state?.event;

  const [recipient, setRecipient] = useState("parent");

  if (!event) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-gray-700">
        <p>No event data found.</p>
        <button
          onClick={() => navigate("/")}
          className="mt-4 bg-slate-900 text-white px-4 py-2 rounded-lg"
        >
          Back to Events
        </button>
      </div>
    );
  }

  const handleSendNotification = () => {
    if (!recipient) {
      alert("Please select who to send notification to.");
      return;
    }

    // 🔔 You can later replace this with real API call
    alert(
      `📩 Notification for "${event.title}" sent successfully to all ${recipient}s!`
    );
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center p-6">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-2xl border border-gray-200">
        <h1 className="text-3xl font-bold text-slate-900 mb-6">
          {event.title}
        </h1>

        <div className="space-y-3 text-gray-800 text-base">
          <p>
            <strong>📅 Date:</strong> {event.date}
          </p>
          {event.time && (
            <p>
              <strong>🕒 Time:</strong> {event.time}
            </p>
          )}
          {event.venue && (
            <p>
              <strong>📍 Venue:</strong> {event.venue}
            </p>
          )}
          {event.audience && (
            <p>
              <strong>👥 Target Audience:</strong> {event.audience}
            </p>
          )}
          {event.description && (
            <div className="mt-4">
              <strong>📝 Description:</strong>
              <p className="mt-1 text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-200">
                {event.description}
              </p>
            </div>
          )}
        </div>

        {/* Notification Section */}
        <div className="mt-8 border-t pt-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-3">
            Send Notification
          </h2>

          <div className="flex flex-col sm:flex-row items-center gap-3 mb-4">
            <label className="text-sm font-medium text-gray-700">
              Select Recipient:
            </label>
            <select
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="border rounded-lg px-3 py-2 text-sm text-gray-700 focus:ring-2 focus:ring-slate-500 outline-none"
            >
              <option value="parent">Parents</option>
              <option value="staff">Staff</option>
            </select>
          </div>

          <button
            onClick={handleSendNotification}
            className="bg-slate-900 text-white px-5 py-2 rounded-lg hover:bg-slate-800 transition-all"
          >
            Send Notification
          </button>
        </div>

        {/* Back Button */}
        <div className="mt-6">
          <button
            onClick={() => navigate("/event-management")}
            className="text-slate-700 underline hover:text-slate-900"
          >
            ← Back to Event Calendar
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
