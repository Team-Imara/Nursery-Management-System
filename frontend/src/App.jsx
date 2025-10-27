import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Teachers from './layout/Teachers.jsx';
import TeacherDetail from './layout/TeacherDetail.jsx';
import AddTeacher from './layout/AddTeacher.jsx';
import ManageLeaveRequests from './layout/ManageLeaveRequests.jsx';
import Dashboard from "./layout/Dashboard.jsx";
import LoginPage from "./layout/LoginPage.jsx";

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
            </Routes>
        </Router>
    );
}

export default App;