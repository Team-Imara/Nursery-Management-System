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

function App() {
    return (
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
                
            </Routes>
        </Router>
    );
}

export default App;