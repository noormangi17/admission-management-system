import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import API from "../../services/api";

export default function ApplicationForm() {
    const [formData, setFormData] = useState({
        // Personal Information
        fullName: "",
        fatherName: "",
        motherName: "",
        dob: "",
        gender: "",
        email: "",
        phone: "",
        address: "",

        // Academic Information
        previousQualification: "",
        percentage: "",
        passingYear: "",
        instituteName: "",

        // Course
        courseApplied: "",

        // Documents
        profilePhoto: null,
        marksheet10: null,
        marksheet12: null,
        idProof: null,
    });
const [courses, setCourses] = useState([]);
    const handleChange = (e) => {
        const { name, value, files } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: files ? files[0] : value,
        }));
    };
useEffect(() => {
  fetchCourses();
}, []);

const fetchCourses = async () => {
  try {
    const res = await API.get("/courses");

    console.log("Courses Response:", res.data);

    if (res.data.success) {
      setCourses(res.data.courses);
    }
  } catch (err) {
    console.log(err);
  }
};
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem("token");

            const data = new FormData();

            // Personal Information
            data.append("fullName", formData.fullName);
            data.append("fatherName", formData.fatherName);
            data.append("motherName", formData.motherName);
            data.append("dob", formData.dob);
            data.append("gender", formData.gender);
            data.append("email", formData.email);
            data.append("phone", formData.phone);
            data.append("address", formData.address);

            // Academic Information
            data.append("previousQualification", formData.previousQualification);
            data.append("percentage", formData.percentage);
            data.append("passingYear", formData.passingYear);
            data.append("instituteName", formData.instituteName);

            // Course
            data.append("courseApplied", formData.courseApplied);

            // Files
            if (formData.profilePhoto)
                data.append("profilePhoto", formData.profilePhoto);

            if (formData.marksheet10)
                data.append("marksheet10", formData.marksheet10);

            if (formData.marksheet12)
                data.append("marksheet12", formData.marksheet12);

            if (formData.idProof)
                data.append("idProof", formData.idProof);

            await API.post("/applications", data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            Swal.fire({
                icon: "success",
                title: "Application Submitted",
                text: "Application submitted successfully.",
            });

        } catch (err) {
            console.log(err);

            Swal.fire({
                icon: "error",
                title: "Submission Failed",
                text:
                    err.response?.data?.message ||
                    "Something went wrong.",
            });
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="bg-white shadow-lg rounded-2xl p-8">

                <h1 className="text-3xl font-bold text-blue-700 mb-8">
                    Admission Form
                </h1>
                {/* ================= PERSONAL INFORMATION ================= */}

                <h2 className="text-2xl font-bold text-blue-700 mb-6">
                    Personal Information
                </h2>

                <div className="grid md:grid-cols-2 gap-6">

                    <div>
                        <label className="block font-semibold mb-2">
                            Full Name
                        </label>

                        <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            placeholder="Enter Full Name"
                            className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                    </div>

                    <div>
                        <label className="block font-semibold mb-2">
                            Father Name
                        </label>

                        <input
                            type="text"
                            name="fatherName"
                            value={formData.fatherName}
                            onChange={handleChange}
                            placeholder="Enter Father Name"
                            className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                    </div>

                    <div>
                        <label className="block font-semibold mb-2">
                            Mother Name
                        </label>

                        <input
                            type="text"
                            name="motherName"
                            value={formData.motherName}
                            onChange={handleChange}
                            placeholder="Enter Mother Name"
                            className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                    </div>

                    <div>
                        <label className="block font-semibold mb-2">
                            Date of Birth
                        </label>

                        <input
                            type="date"
                            name="dob"
                            value={formData.dob}
                            onChange={handleChange}
                            className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                    </div>

                    <div>
                        <label className="block font-semibold mb-2">
                            Gender
                        </label>

                        <select
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
                        >
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                    </div>

                    <div>
                        <label className="block font-semibold mb-2">
                            Email
                        </label>

                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter Email"
                            className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                    </div>

                    <div>
                        <label className="block font-semibold mb-2">
                            Phone Number
                        </label>

                        <input
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="03XXXXXXXXX"
                            className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block font-semibold mb-2">
                            Address
                        </label>

                        <textarea
                            rows="4"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            placeholder="Enter Complete Address"
                            className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                    </div>

                </div>

                <hr className="my-10" />
                {/* ================= ACADEMIC INFORMATION ================= */}

                <h2 className="text-2xl font-bold text-blue-700 mb-6">
                    Academic Information
                </h2>

                <div className="grid md:grid-cols-2 gap-6">

                    <div>
                        <label className="block font-semibold mb-2">
                            Previous Qualification
                        </label>

                        <input
                            type="text"
                            name="previousQualification"
                            value={formData.previousQualification}
                            onChange={handleChange}
                            placeholder="FSc / ICS / Intermediate"
                            className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                    </div>

                    <div>
                        <label className="block font-semibold mb-2">
                            Percentage
                        </label>

                        <input
                            type="number"
                            name="percentage"
                            value={formData.percentage}
                            onChange={handleChange}
                            placeholder="85"
                            min="0"
                            max="100"
                            className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                    </div>

                    <div>
                        <label className="block font-semibold mb-2">
                            Passing Year
                        </label>

                        <input
                            type="number"
                            name="passingYear"
                            value={formData.passingYear}
                            onChange={handleChange}
                            placeholder="2025"
                            className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                    </div>

                    <div>
                        <label className="block font-semibold mb-2">
                            Institute Name
                        </label>

                        <input
                            type="text"
                            name="instituteName"
                            value={formData.instituteName}
                            onChange={handleChange}
                            placeholder="Enter Institute Name"
                            className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                    </div>

                </div>

                <hr className="my-10" />
                {/* ================= COURSE SELECTION ================= */}

                <h2 className="text-2xl font-bold text-blue-700 mb-6">
                    Course Selection
                </h2>

                <div className="mb-8">

                    <label className="block font-semibold mb-2">
                        Select Course
                    </label>

                    <select
                        name="courseApplied"
                        value={formData.courseApplied}
                        onChange={handleChange}
                        className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    >
                       <option value="">Select Course</option>

{courses.map((course) => (
  <option
    key={course._id}
    value={course._id}
  >
    {course.courseName}
  </option>
))}

                    </select>

                </div>

                <hr className="my-10" />

                {/* ================= DOCUMENT UPLOAD ================= */}

                <h2 className="text-2xl font-bold text-blue-700 mb-6">
                    Upload Documents
                </h2>

                <div className="grid md:grid-cols-2 gap-6">

                    <div>
                        <label className="block font-semibold mb-2">
                            Profile Photo
                        </label>

                        <input
                            type="file"
                            name="profilePhoto"
                            accept=".jpg,.jpeg,.png"
                            onChange={handleChange}
                            className="w-full border rounded-lg px-3 py-2"
                        />
                    </div>

                    <div>
                        <label className="block font-semibold mb-2">
                            10th Marksheet
                        </label>

                        <input
                            type="file"
                            name="marksheet10"
                            accept=".jpg,.jpeg,.png,.pdf"
                            onChange={handleChange}
                            className="w-full border rounded-lg px-3 py-2"
                        />
                    </div>

                    <div>
                        <label className="block font-semibold mb-2">
                            12th Marksheet
                        </label>

                        <input
                            type="file"
                            name="marksheet12"
                            accept=".jpg,.jpeg,.png,.pdf"
                            onChange={handleChange}
                            className="w-full border rounded-lg px-3 py-2"
                        />
                    </div>

                    <div>
                        <label className="block font-semibold mb-2">
                            ID Proof
                        </label>

                        <input
                            type="file"
                            name="idProof"
                            accept=".jpg,.jpeg,.png,.pdf"
                            onChange={handleChange}
                            className="w-full border rounded-lg px-3 py-2"
                        />
                    </div>

                </div>

                <hr className="my-10" />
                <div className="flex justify-end mt-10">

                    <button
                        type="submit"
                        className="bg-blue-700 hover:bg-blue-800 text-white px-10 py-3 rounded-lg font-semibold transition"
                    >
                        Submit Application
                    </button>

                </div>
            </div>
        </form>
    );
}