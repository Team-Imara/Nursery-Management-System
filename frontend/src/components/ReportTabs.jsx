import { TrendingUp, Calendar, Utensils, UserCheck, Users, FileText, Trophy, BarChart3 } from 'lucide-react';

const tabs = [
  { id: 'progress', label: 'Progress Reports', icon: <TrendingUp className="w-4 h-4" /> },
  { id: 'student-attendance', label: 'Student Attendance Report', icon: <Calendar className="w-4 h-4" /> },
  { id: 'meal', label: 'Meal Planning Report', icon: <Utensils className="w-4 h-4" /> },
  { id: 'teacher-attendance', label: 'Teacher Attendance & Leave Report', icon: <UserCheck className="w-4 h-4" /> },
  { id: 'teacher-class', label: 'Teacher-Class Allocation Report', icon: <Users className="w-4 h-4" /> },
  { id: 'student-tutor', label: 'Student & Tutor Details Report', icon: <FileText className="w-4 h-4" /> },
  { id: 'event', label: 'Event Summary Report', icon: <Trophy className="w-4 h-4" /> },
  { id: 'class-performance', label: 'Class Performance Summary', icon: <BarChart3 className="w-4 h-4" /> },
];

export default function ReportTabs({ activeTab, onTabChange }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex items-center gap-2 px-4 py-3 rounded-xl whitespace-nowrap transition-all ${
            activeTab === tab.id
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          {tab.icon}
          <span className="text-sm font-medium">{tab.label}</span>
        </button>
      ))}
    </div>
  );
}