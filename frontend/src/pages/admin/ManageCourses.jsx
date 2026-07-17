import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import AdminLayout from "../../components/admin/AdminLayout";

export default function ManageCourses() {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await API.get("/courses");
      setCourses(res.data.courses || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this course?"
    );

    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");

      await API.delete(`/courses/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Course deleted successfully!");

      fetchCourses();
    } catch (err) {
      console.error(err);
      alert(
        err.response?.data?.message || "Failed to delete course"
      );
    }
  };

  return (
    <AdminLayout>
      <div className="bg-white rounded-xl shadow-lg p-6">

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-blue-700">
            Manage Courses
          </h1>

          <button
            onClick={() => navigate("/admin/add-course")}
            className="bg-blue-700 hover:bg-blue-800 text-white px-5 py-2 rounded-lg"
          >
            + Add Course
          </button>
        </div>

        <div className="overflow-x-auto">

          <table className="w-full border-collapse">

            <thead>

              <tr className="bg-blue-700 text-white">

                <th className="p-3 text-left">Course</th>
                <th className="p-3 text-left">Duration</th>
                <th className="p-3 text-left">Fee</th>
                <th className="p-3 text-left">Seats</th>
                <th className="p-3 text-left">Available</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-center">Actions</th>

              </tr>

            </thead>

            <tbody>

              {courses.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="text-center py-6 text-gray-500"
                  >
                    No courses found.
                  </td>
                </tr>
              ) : (
                courses.map((course) => (
                  <tr
                    key={course._id}
                    className="border-b hover:bg-gray-100"
                  >

                    <td className="p-3">
                      {course.courseName}
                    </td>

                    <td className="p-3">
                      {course.duration}
                    </td>

                    <td className="p-3">
                      Rs. {course.fee}
                    </td>

                    <td className="p-3">
                      {course.totalSeats}
                    </td>

                    <td className="p-3">
                      {course.availableSeats}
                    </td>

                    <td className="p-3">
                      {course.isActive ? (
                        <span className="text-green-600 font-semibold">
                          Active
                        </span>
                      ) : (
                        <span className="text-red-600 font-semibold">
                          Inactive
                        </span>
                      )}
                    </td>

                    <td className="p-3 text-center">

                      <button
                        onClick={() =>
                          navigate(`/admin/edit-course/${course._id}`)
                        }
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded mr-2"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() =>
                          handleDelete(course._id)
                        }
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                      >
                        Delete
                      </button>

                    </td>

                  </tr>
                ))
              )}

            </tbody>

          </table>

        </div>

      </div>
    </AdminLayout>
  );
}