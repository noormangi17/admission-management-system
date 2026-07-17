import Sidebar from "../../components/Student/StudentSidebar";
import Topbar from "../../components/Student/StudentTopbar";

export default function StudentDashboard() {
  return (
    <div className="flex min-h-screen bg-gray-100">

      <Sidebar />

      <div className="flex-1">

        <Topbar />

        <div className="p-8">

          <h1 className="text-4xl font-bold">
            Student Dashboard
          </h1>

          <p className="text-gray-500 mt-2">
            Welcome to Admission Management System
          </p>

        </div>

      </div>

    </div>
  );
}