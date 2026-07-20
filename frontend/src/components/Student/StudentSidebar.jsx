import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Sidebar() {
    const { logout, user } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="w-64 bg-blue-800 text-white min-h-screen">

            <div className="text-center py-8 text-2xl font-bold">AMS</div>

            <nav className="flex flex-col">
                <Link to="/student/profile" className="px-6 py-4 hover:bg-blue-700">My Profile</Link>
                <Link to="/student/apply" className="px-6 py-4 hover:bg-blue-700">Apply Admission</Link>
                <Link to="/student/applications" className="px-6 py-4 hover:bg-blue-700">My Applications</Link>
                <Link to="/student/settings" className="px-6 py-4 hover:bg-blue-700">Settings</Link>

                <div className="mt-auto px-6 py-4">
                    <button onClick={handleLogout} className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg">Logout</button>
                </div>
            </nav>

        </div>
    );
}