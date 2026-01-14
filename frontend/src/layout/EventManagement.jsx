import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import HeaderRightSection from '../components/HeaderRightSection';
import { useNavigate } from "react-router-dom";


const Header = () => {
  return (

    <header className="bg-white border-b border-gray-200 px-8 py-4 sticky top-0 z-10">
      <div className="flex items-center justify-end">
        <HeaderRightSection
          notificationCount={2}
          imageSrc="https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100"
          name="Admin"
        />
      </div>
    </header>
  );
};

const EventManagement = () => {

  const navigate = useNavigate();
  // Existing event list
  const [events, setEvents] = useState([
    { date: "2025-10-01", title: "Children’s Day", type: "special" },
    { date: "2025-10-06", title: "Full Moon Poya", type: "holiday" },
    { date: "2025-10-07", title: "Teacher’s Day", type: "special" },
    { date: "2025-10-15", title: "Sportsmeet Day", type: "special" },
    { date: "2025-10-20", title: "Diwali Holiday", type: "holiday" },
  ]);

  // Month control
  const [currentMonth, setCurrentMonth] = useState(9);
  const [currentYear, setCurrentYear] = useState(2025);

  // New event form data
  const [newEvent, setNewEvent] = useState({
    title: "",
    date: "",
    time: "",
    description: "",
    venue: "",
    audience: "",
  });

  // Filter and modal state
  const [filter, setFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const blanks = (firstDay + 6) % 7;

  const handleAddEvent = () => {
    if (!newEvent.title || !newEvent.date) {
      alert("Please fill event title and date.");
      return;
    }
    setEvents([...events, { ...newEvent, type: "special" }]);
    setNewEvent({
      title: "",
      date: "",
      time: "",
      description: "",
      venue: "",
      audience: "",
    });
    setShowForm(false);
  };

  const handleMonthChange = (direction) => {
    let newMonth = currentMonth + direction;
    let newYear = currentYear;
    if (newMonth < 0) {
      newMonth = 11;
      newYear--;
    } else if (newMonth > 11) {
      newMonth = 0;
      newYear++;
    }
    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
  };

  const getEventByDate = (day) => {
    const dateStr = `${currentYear}-${(currentMonth + 1)
      .toString()
      .padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
    return events.find(
      (event) =>
        event.date === dateStr &&
        (filter === "all" || event.type === filter)
    );
  };

 
const renderDay = (day) => {
  const event = getEventByDate(day);
  let bgColor = "bg-white";
  if (event?.type === "holiday") bgColor = "bg-red-100 border-red-400";
  if (event?.type === "special") bgColor = "bg-yellow-100 border-yellow-400";

  return (

    <div
      key={day}
      className={`relative border rounded-lg h-20 flex flex-col justify-center items-center text-sm font-medium transition-all duration-200 ${bgColor}`}
    >
      <span>{day}</span>

      {event && (
        <div className="relative group"
        onClick={() => navigate(`/event/${event.date}`, { state: { event } })}>
          <span className="text-xs mt-1 text-center px-1 text-gray-700 cursor-pointer hover:font-semibold">
            {event.title}
          </span>

          {/* Tooltip (below the event) */}
          <div className="absolute top-full left-1/2 mt-2 -translate-x-1/2 hidden group-hover:flex flex-col bg-white border border-gray-200 rounded-xl shadow-lg text-xs text-gray-700 p-3 w-48 z-50 transition-opacity duration-200 opacity-0 group-hover:opacity-100">
            <p className="font-semibold text-slate-800 mb-1">{event.title}</p>
            {event.date && <p>📅 {event.date}</p>}
            {event.time && <p>🕒 {event.time}</p>}
            {event.venue && <p>📍 {event.venue}</p>}
            {event.description && (
              <p className="mt-1 italic text-gray-500">
                {event.description.slice(0, 40)}...
              </p>
            )}
          </div>
        )}
      </div>
    );
  };




  return (
    
    <div className="flex min-h-screen bg-slate-100 text-gray-900">
      {/* Sidebar */}
      <Sidebar />

      {/* Main area */}
      <div className="flex-1 flex flex-col lg:ml-64">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-4 sticky top-0 z-10">
          <div className="flex items-center justify-end">
            <HeaderRightSection
              notificationCount={3}
              imageSrc="https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100"
              name="Admin"
              onNotificationClick={() => alert('Notifications clicked!')}
            />
          </div>
        </header>

      {/* Main Content */}
      <main className="flex-1 p-6 transition-all duration-300">

        {/* Top bar (New Event button) */}
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-2xl font-bold text-gray-900">
            Interactive Calendar
          </h1>

          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-green-100 text-green-700 rounded-lg font-medium hover:bg-green-200"
          >
            + New Event
          </button>
        </div>


        {/* Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        

        
          {/* Calendar */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow p-6">

            {/* Month Navigation */}
            <div className="flex justify-between items-center mb-4">
              <button
                onClick={() => handleMonthChange(-1)}
                className="bg-gray-100 px-3 py-1 rounded hover:bg-gray-200"
              >
                Prev
              </button>
              <span className="font-medium text-gray-700">
                {months[currentMonth]} {currentYear}
              </span>
              <button
                onClick={() => handleMonthChange(1)}
                className="bg-gray-100 px-3 py-1 rounded hover:bg-gray-200"
              >
                Next
              </button>
            </div>

              {/* Filter Options */}
              <div className="flex gap-3 mb-4">
                <button
                  onClick={() => setFilter("all")}
                  className={`px-3 py-1 rounded ${filter === "all"
                    ? "bg-slate-900 text-white"
                    : "bg-gray-200 text-gray-800"
                    }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilter("special")}
                  className={`px-3 py-1 rounded ${filter === "special"
                    ? "bg-yellow-400 text-gray-900"
                    : "bg-gray-200 text-gray-800"
                    }`}
                >
                  Special Events
                </button>
                <button
                  onClick={() => setFilter("holiday")}
                  className={`px-3 py-1 rounded ${filter === "holiday"
                    ? "bg-red-400 text-white"
                    : "bg-gray-200 text-gray-800"
                    }`}
                >
                  Holidays
                </button>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-2 text-center font-semibold text-gray-600 mb-2">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                  <div key={day}>{day}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: blanks }).map((_, i) => (
                  <div key={`b${i}`} className="h-20"></div>
                ))}
                {Array.from({ length: daysInMonth }, (_, i) => renderDay(i + 1))}
              </div>

              {/* Legend */}
              <div className="flex items-center gap-4 mt-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <span className="w-3 h-3 bg-gray-200 rounded-full"></span> Regular
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-3 h-3 bg-red-300 rounded-full"></span> Holidays
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-3 h-3 bg-yellow-300 rounded-full"></span> Events
                </div>
              </div>
            </div>

            {/* Event Editor */}
            {/* {showForm && ( */}
            <div className="bg-white rounded-2xl shadow p-6 flex flex-col gap-3">
              <h2 className="text-lg font-semibold mb-2 text-slate-800">
                Create / Manage Event
              </h2>

              <input
                type="text"
                placeholder="Enter event title"
                value={newEvent.title}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, title: e.target.value })
                }
                className="border rounded-lg px-3 py-2 text-sm"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="date"
                  value={newEvent.date}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, date: e.target.value })
                  }
                  className="border rounded-lg px-3 py-2 text-sm"
                />
                <input
                  type="time"
                  value={newEvent.time}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, time: e.target.value })
                  }
                  className="border rounded-lg px-3 py-2 text-sm"
                />
              </div>

              <textarea
                placeholder="Add description and instructions"
                value={newEvent.description}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, description: e.target.value })
                }
                className="border rounded-lg px-3 py-2 text-sm"
              />

              <input
                type="text"
                placeholder="Venue"
                value={newEvent.venue}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, venue: e.target.value })
                }
                className="border rounded-lg px-3 py-2 text-sm"
              />
              <input
                type="text"
                placeholder="Audience"
                value={newEvent.audience}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, audience: e.target.value })
                }
                className="border rounded-lg px-3 py-2 text-sm"
              />

              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => setShowForm(false)}
                  className="bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddEvent}
                  className="bg-gray-200 text-gray-800 px-3 py-2 rounded-lg hover:bg-gray-300"
                >
                  Save
                </button>
                {/* <button
                  onClick={() => alert("Notification sent")}
                  className="bg-slate-900 text-white px-3 py-2 rounded-lg hover:bg-slate-800"
                >
                  Send Notification
                </button> */}
              </div>
            </div>
            {/* )} */}
          </div>

        </main>
      </div>
    </div>
  );
};

export default EventManagement;
