import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Teachers from './layout/Teachers.jsx';
import TeacherDetail from './layout/TeacherDetail.jsx';
import AddTeacher from './layout/AddTeacher.jsx';
import ManageLeaveRequests from './layout/ManageLeaveRequests.jsx';
import Dashboard from "./layout/Dashboard.jsx";
import LoginPage from "./layout/LoginPage.jsx";
import ProfilePage from './layout/ProfilePage';
import SettingsPage from './layout/SettingsPage';
import ClassManagement from './layout/ClassManagement.jsx';
import AddNewClass from './layout/AddNewClass.jsx';
import ViewTimetable from './layout/ViewTimetable.jsx';
import Students from './layout/Students.jsx';
import StudentDetail from './layout/StudentDetail.jsx';
import AddStudent from './layout/AddStudent.jsx';
import SendMessage from './components/SendMessage.jsx';
import EventManagement from './layout/EventManagement';
import EventDetail from './layout/EventDetail.jsx';
import MealPlan from "./layout/MealPlan.jsx";
import StudentHealth from "./layout/StudentHealth.jsx";
import DailyMeal from "./layout/DailyMeal.jsx";
import Report from './layout/Report.jsx';
import { AppProvider } from './context/AppContext';


import { SettingsProvider } from './context/SettingsContext';

function App() {
    return (
        <AppProvider>
            <SettingsProvider>
                <Router>
                    <Routes>
                        <Route path="/" element={<LoginPage />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/teachers" element={<Teachers />} />
                        <Route path="/teacher/:id" element={<TeacherDetail />} />
                        <Route path="/add-teacher" element={<AddTeacher />} />
                        <Route path="/manage-leave-requests" element={<ManageLeaveRequests />} />
                        <Route path="/profile" element={<ProfilePage />} />
                        <Route path="/settings" element={<SettingsPage />} />
                        <Route path="/class-management" element={<ClassManagement />} />
                        <Route path="/AddNewClass" element={<AddNewClass />} />
                        <Route path="/ViewTimetable" element={<ViewTimetable />} />
                        <Route path="/reports" element={<Report />} />
                        <Route path="/students" element={<Students />} />
                        {/* <Route path="/student/:id" element={<StudentDetail />} /> */}
                        <Route path="/students/detail" element={<StudentDetail />} />
                        <Route path="/add-student" element={<AddStudent />} />
                        <Route path="/send-message" element={<SendMessage />} />
                        <Route path="/event-management" element={<EventManagement />} />
                        <Route path="/event/:date" element={<EventDetail />} />

                        <Route path="/meal-plan" element={<MealPlan />} />
                        <Route path="/student-health" element={<StudentHealth />} />
                        <Route path="/daily-meal" element={<DailyMeal />} />

                    </Routes>
                </Router>
            </SettingsProvider>
        </AppProvider>
    );
}

export default App;