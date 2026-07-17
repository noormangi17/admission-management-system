import { useEffect, useState } from "react";
import API from "../../services/api";
import AdminLayout from "../../components/admin/AdminLayout";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalStudents: 0,
    totalApplications: 0,
    totalOfficers: 0,
  });

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const res = await API.get("/dashboard/stats");
      setStats(res.data.stats);
    } catch (err) {
      console.error("Dashboard Error:", err);

      if (err.response) {
        console.log("Response:", err.response.data);
      }
    }
  };

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-gray-500">Total Courses</h2>
          <p className="text-4xl font-bold text-blue-700 mt-2">
            {stats.totalCourses}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-gray-500">Applications</h2>
          <p className="text-4xl font-bold text-green-600 mt-2">
            {stats.totalApplications}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-gray-500">Students</h2>
          <p className="text-4xl font-bold text-purple-600 mt-2">
            {stats.totalStudents}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-gray-500">Officers</h2>
          <p className="text-4xl font-bold text-red-600 mt-2">
            {stats.totalOfficers}
          </p>
        </div>

      </div>
    </AdminLayout>
  );
}