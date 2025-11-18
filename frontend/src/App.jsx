import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Teachers from './layout/Teachers.jsx';
import TeacherDetail from './layout/TeacherDetail.jsx';
import AddTeacher from './layout/AddTeacher.jsx';
import ManageLeaveRequests from './layout/ManageLeaveRequests.jsx';
import Dashboard from "./layout/Dashboard.jsx";
import LoginPage from "./layout/LoginPage.jsx";
import Students from './layout/Students.jsx';
import StudentDetail from './layout/StudentDetail.jsx';
import AddStudent from './layout/AddStudent.jsx';
import SendMessage from './components/SendMessage.jsx';
import EventManagement from './layout/EventManagement';
import EventDetail from './layout/EventDetail.jsx';
import MealPlan from "./layout/MealPlan.jsx";
import StudentHealth from "./layout/StudentHealth.jsx";
import DailyMeal from "./layout/DailyMeal.jsx";
import { AppProvider } from './context/AppContext';
import Reports from './layout/Report.jsx';

function App() {
    return (
        <AppProvider>
        <Router>
            <Routes>
                <Route path="/" element={<LoginPage />} />
                 <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/teachers" element={<Teachers />} />
                <Route path="/teacher/:id" element={<TeacherDetail />} />
                <Route path="/add-teacher" element={<AddTeacher />} />
                <Route path="/manage-leave-requests" element={<ManageLeaveRequests />} />
                <Route path="/students" element={<Students />} />
                {/* <Route path="/student/:id" element={<StudentDetail />} /> */}
                <Route path="/students/detail" element={<StudentDetail />} />
                <Route path="/add-student" element={<AddStudent />} />
                <Route path="/send-message" element={<SendMessage />} />
                <Route path="/event-management" element={<EventManagement />} />
                <Route path="/event/:date" element={<EventDetail />} />

                <Route path="/meal-plan" element={<MealPlan/>} />
                <Route path="/student-health" element={<StudentHealth/>} />
                <Route path="/daily-meal" element={<DailyMeal/>} />
                <Route path="/reports" element={<Reports/>} />
            </Routes>
        </Router>
        </AppProvider>
    );
}

export default App;