import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Teachers from './layout/Teachers.jsx';
import TeacherDetail from './layout/TeacherDetail.jsx';
import AddTeacher from './layout/AddTeacher.jsx';
import ManageLeaveRequests from './layout/ManageLeaveRequests.jsx';
import Dashboard from "./layout/Dashboard.jsx";
import LoginPage from "./layout/LoginPage.jsx";
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