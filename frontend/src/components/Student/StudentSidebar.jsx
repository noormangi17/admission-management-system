import { Link } from "react-router-dom";

export default function Sidebar() {
    return (
        <div className="w-64 bg-blue-800 text-white min-h-screen">

            <div className="text-center py-8 text-2xl font-bold">
                AMS
            </div>

            <nav className="flex flex-col">
                <Link
                    to="/student/profile"
                    className="px-6 py-4 hover:bg-blue-700"
                >
                    My Profile
                </Link>

                <Link
                    to="/student/apply"
                    className="px-6 py-4 hover:bg-blue-700"
                >
                    Apply Admission
                </Link>

                <Link
                    to="/student/applications"
                    className="px-6 py-4 hover:bg-blue-700"
                >
                    My Applications
                </Link>

                <Link
                    to="/student/settings"
                    className="px-6 py-4 hover:bg-blue-700"
                >
                    Settings
                </Link>

            </nav>

        </div>
    );
}