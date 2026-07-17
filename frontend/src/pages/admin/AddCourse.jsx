import { useState } from "react";
import API from "../../services/api";
import AdminLayout from "../../components/admin/AdminLayout";

export default function AddCourse() {
  const [formData, setFormData] = useState({
    courseName: "",
    duration: "",
    totalSeats: "",
    eligibility: "",
    fee: "",
    description: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const res = await API.post("/courses", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Course added successfully!");

      setFormData({
        courseName: "",
        duration: "",
        totalSeats: "",
        eligibility: "",
        fee: "",
        description: "",
      });

      console.log(res.data);
    } catch (err) {
      console.error(err);

      alert(err.response?.data?.message || "Failed to add course");
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow-lg p-8"
        >
          <h1 className="text-3xl font-bold text-blue-700 mb-8">
            Add New Course
          </h1>

          <div className="grid md:grid-cols-2 gap-6">

            <div>
              <label className="block mb-2 font-semibold">
                Course Name
              </label>

              <input
                type="text"
                name="courseName"
                value={formData.courseName}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-3"
                placeholder="BS Computer Science"
                required
              />
            </div>

            <div>
              <label className="block mb-2 font-semibold">
                Duration
              </label>

              <input
                type="text"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-3"
                placeholder="4 Years"
                required
              />
            </div>

            <div>
              <label className="block mb-2 font-semibold">
                Total Seats
              </label>

              <input
                type="number"
                name="totalSeats"
                value={formData.totalSeats}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-3"
                placeholder="100"
                required
              />
            </div>

            <div>
              <label className="block mb-2 font-semibold">
                Fee
              </label>

              <input
                type="number"
                name="fee"
                value={formData.fee}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-3"
                placeholder="120000"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block mb-2 font-semibold">
                Eligibility
              </label>

              <input
                type="text"
                name="eligibility"
                value={formData.eligibility}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-3"
                placeholder="Intermediate / FSC / ICS"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block mb-2 font-semibold">
                Description
              </label>

              <textarea
                rows="5"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-3"
                placeholder="Course Description..."
                required
              />
            </div>

          </div>

          <div className="mt-8">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold"
            >
              Add Course
            </button>
          </div>

        </form>

      </div>
    </AdminLayout>
  );
}