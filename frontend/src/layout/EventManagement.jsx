import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout.jsx";
import axios from "../api/axios";
import { Loader2, Calendar, Zap } from "lucide-react";

const EventManagement = () => {
  const navigate = useNavigate();
  // Existing event list
  const [events, setEvents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Month control
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  // New event form data
  const [newEvent, setNewEvent] = useState({
    title: "",
    date: "",
    time: "",
    description: "",
    venue: "",
    type: "special",
    audience: "all",
  });

  // Filter and modal state
  const [filter, setFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);

  // Fetch events and classes on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [eventsRes, classesRes] = await Promise.all([
          axios.get('/calendar-events'),
          axios.get('/classes')
        ]);
        setEvents(eventsRes.data);
        setClasses(classesRes.data);
      } catch (error) {
        console.error("Error fetching calendar data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  // Fix blanks logic (assuming Monday as first day)
  const blanks = firstDay === 0 ? 6 : firstDay - 1;

  const handleAddEvent = async () => {
    if (!newEvent.title || !newEvent.date || !newEvent.type || !newEvent.audience) {
      alert("Please fill in all required fields (Title, Date, Type, Audience).");
      return;
    }

    try {
      setSaving(true);
      // Avoid sending empty strings for optional fields
      const payload = { ...newEvent };
      if (!payload.time) delete payload.time;
      if (!payload.description) delete payload.description;
      if (!payload.venue) delete payload.venue;

      const res = await axios.post('/calendar-events', payload);
      setEvents([...events, res.data.event]);
      setNewEvent({
        title: "",
        date: "",
        time: "",
        description: "",
        venue: "",
        type: "special",
        audience: "all",
      });
      setShowForm(false);
    } catch (error) {
      console.error("Error creating event:", error);
      alert("Failed to create event. Please check the console for details.");
    } finally {
      setSaving(false);
    }
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
          </div>
        )}
      </div>
    );
  };

  return (
    <Layout>
      <main className="flex-1 p-6 transition-all duration-300">
        {/* Top bar (New Event button) */}
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-2xl font-bold text-gray-900">
            Interactive Calendar
          </h1>
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
          <div className="bg-white rounded-2xl shadow p-6 flex flex-col gap-3">
            <h2 className="text-lg font-semibold mb-2 text-slate-800">
              Create New Event
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

            <select
              value={newEvent.type}
              onChange={(e) =>
                setNewEvent({ ...newEvent, type: e.target.value })
              }
              className="border rounded-lg px-3 py-2 text-sm"
            >
              <option value="special">Special Event</option>
              <option value="holiday">Holiday</option>
            </select>

            <input
              type="text"
              placeholder="Venue"
              value={newEvent.venue}
              onChange={(e) =>
                setNewEvent({ ...newEvent, venue: e.target.value })
              }
              className="border rounded-lg px-3 py-2 text-sm"
            />

            <select
              value={newEvent.audience}
              onChange={(e) =>
                setNewEvent({ ...newEvent, audience: e.target.value })
              }
              className="border rounded-lg px-3 py-2 text-sm"
            >
              <option value="all">All Classes</option>
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.classname}
                </option>
              ))}
            </select>

            <div className="flex gap-2 mt-3">
              <button
                onClick={() => setShowForm(false)}
                className="bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600"
              >
                Cancel
              </button>
              <button
                onClick={handleAddEvent}
                disabled={saving}
                className="bg-gray-200 text-gray-800 px-3 py-2 rounded-lg hover:bg-gray-300 flex items-center justify-center min-w-[80px]"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save"}
              </button>
            </div>
          </div>
        </div>
        {/* Yearly Plan Section (Refined Top-tier Typography) */}
        <div className="mt-12 bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 p-10 overflow-hidden relative">
          {/* Subtle Background Decoration */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-50/10 rounded-full -mr-48 -mt-48 blur-[100px]"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-50/10 rounded-full -ml-48 -mb-48 blur-[100px]"></div>

          <div className="relative flex items-center justify-between mb-12 px-2">
            <div className="flex items-center gap-5">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl shadow-lg shadow-purple-50">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
                  Yearly Plan <span className="text-purple-600/80 font-semibold">{currentYear}</span>
                </h2>
                <p className="text-slate-500 font-medium mt-1 uppercase tracking-widest text-[9px] flex items-center gap-1.5 grayscale opacity-70">
                  <Zap size={11} className="text-amber-500 fill-amber-500" />
                  Nursery Special Calendar
                </p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-3 border border-slate-100 bg-slate-50/30 p-1.5 rounded-xl">
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-lg shadow-sm border border-slate-50">
                <div className="w-2.5 h-2.5 rounded-full bg-purple-500/80"></div>
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tight">Special Events Only</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-8">
            {months.map((month, index) => {
              const monthEvents = events.filter(event => {
                const eventDate = new Date(event.date);
                return eventDate.getMonth() === index &&
                  eventDate.getFullYear() === currentYear &&
                  event.type === 'special';
              }).sort((a, b) => new Date(a.date) - new Date(b.date));

              const monthColors = [
                'bg-indigo-500', 'bg-blue-500', 'bg-emerald-500', 'bg-orange-500',
                'bg-red-500', 'bg-cyan-500', 'bg-rose-500', 'bg-lime-500',
                'bg-violet-500', 'bg-amber-500', 'bg-sky-500', 'bg-fuchsia-500'
              ];

              return (
                <div key={month} className="group relative flex flex-col md:flex-row items-center gap-6 md:gap-12">
                  {/* Vertical Month Indicator (Refined Sticker style) */}
                  <div className="w-full md:w-48 shrink-0 relative">
                    <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-1 h-10 rounded-full bg-purple-50 group-hover:bg-purple-500 transition-colors duration-500"></div>
                    <div className="bg-purple-600/90 px-5 py-3 rounded-xl shadow-md flex items-center justify-center">
                      <span className="text-white font-bold text-xs tracking-widest uppercase italic font-medium">
                        ({index + 1}) {month}
                      </span>
                    </div>
                    <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 translate-x-full h-[1px] w-6 border-t border-dashed border-slate-200"></div>
                  </div>

                  {/* Horizontal Event Rail */}
                  <div className="w-full flex-1 min-h-[110px] relative">
                    <div className="flex gap-5 overflow-x-auto pb-4 custom-scrollbar px-1">
                      {monthEvents.length > 0 ? (
                        monthEvents.map((event, idx) => (
                          <div
                            key={idx}
                            onClick={() => navigate(`/event/${event.date}`, { state: { event } })}
                            className="min-w-[240px] group/item relative p-4 bg-slate-50/40 rounded-2xl border border-slate-100 hover:bg-white hover:border-indigo-100 hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col gap-2"
                          >
                            <div className="flex items-center gap-2">
                              <div className={`${monthColors[index % monthColors.length]} px-2 py-1 rounded-lg text-white shadow-sm ring-2 ring-white/50`}>
                                <span className="text-[10px] font-bold italic tracking-tighter">{new Date(event.date).getDate()}</span>
                              </div>
                              <div className="flex flex-col">
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">{month.slice(0, 3)}</p>
                                {event.time && <span className="text-[8px] font-semibold text-indigo-500/50 mt-0.5">🕒 {event.time}</span>}
                              </div>
                            </div>

                            <div className="mt-1">
                              <h4 className="text-[13px] font-bold text-slate-700 leading-snug group-hover/item:text-indigo-600 transition-colors line-clamp-2">
                                {event.title}
                              </h4>
                              {event.venue && (
                                <p className="text-[9px] font-semibold text-slate-400 mt-1 uppercase tracking-tight italic opacity-60">📍 {event.venue}</p>
                              )}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="flex items-center gap-3 py-3 px-6 bg-slate-50/20 border border-dashed border-slate-100 rounded-2xl opacity-30">
                          <Zap size={14} className="text-slate-300" />
                          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-300">Reserved</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default EventManagement;
