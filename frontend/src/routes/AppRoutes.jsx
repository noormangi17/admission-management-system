import { Routes, Route } from "react-router-dom";
import Home from "../pages/public/Home";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import StudentDashboard from "../pages/student/StudentDashboard";
import ProtectedRoute from "./ProtectedRoute";
import ApplyAdmission from "../pages/student/ApplyAdmission";
import AddCourse from "../pages/admin/AddCourse";
import AdminDashboard from "../pages/admin/AdminDashboard";
import ManageCourses from "../pages/admin/ManageCourses";
import EditCourse from "../pages/admin/EditCourse";
import ManageApplications from "../pages/admin/ManageApplications";
import ManageUsers from "../pages/admin/ManageUsers";
import MyProfile from "../pages/student/MyProfile";
import MyApplications from "../pages/student/MyApplications";
import Settings from "../pages/student/Settings";
function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
                path="/student"
                element={
                    <ProtectedRoute>
                        <StudentDashboard />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/apply"
                element={
                    <ProtectedRoute>
                        <ApplyAdmission />
                    </ProtectedRoute>
                }
            />
            <Route path="/admin/add-course" element={<AddCourse />} />
            <Route
                path="/admin"
                element={
                    <ProtectedRoute>
                        <AdminDashboard />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/admin/manage-courses"
                element={
                    <ProtectedRoute>
                        <ManageCourses />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/student/apply"
                element={
                    <ProtectedRoute>
                        <ApplyAdmission />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/admin/edit-course/:id"
                element={
                    <ProtectedRoute>
                        <EditCourse />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/admin/applications"
                element={
                    <ProtectedRoute>
                        <ManageApplications />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/admin/users"
                element={
                    <ProtectedRoute>
                        <ManageUsers />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/student/profile"
                element={
                    <ProtectedRoute>
                        <MyProfile />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/student/applications"
                element={
                    <ProtectedRoute>
                        <MyApplications />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/student/settings"
                element={
                    <ProtectedRoute>
                        <Settings />
                    </ProtectedRoute>
                }
            />
        </Routes>
    );
}

export default AppRoutes;