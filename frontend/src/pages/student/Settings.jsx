import { useState } from "react";
import API from "../../services/api";
import StudentLayout from "../../components/Student/StudentLayout";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function Settings() {

  const { logout } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });


  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

  };


  const changePassword = async () => {

    if (
      !formData.currentPassword ||
      !formData.newPassword ||
      !formData.confirmPassword
    ) {

      Swal.fire(
        "Missing Fields",
        "Please fill all fields",
        "warning"
      );

      return;

    }


    if (formData.newPassword !== formData.confirmPassword) {

      Swal.fire(
        "Password Error",
        "New passwords do not match",
        "error"
      );

      return;

    }


    try {

      await API.post(
        "/auth/change-password",
        {
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        }
      );


      Swal.fire(
        "Success",
        "Password changed successfully",
        "success"
      );


      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });


    } catch (error) {

      Swal.fire(
        "Error",
        error.response?.data?.message ||
        "Unable to change password",
        "error"
      );

    }

  };


  const handleLogout = () => {

    logout();

    navigate("/login");

  };


  return (

    <StudentLayout>

      <div className="bg-white shadow-xl rounded-xl p-8 max-w-2xl">

        <h1 className="text-3xl font-bold mb-2">
          Settings
        </h1>

        <p className="text-gray-500 mb-8">
          Manage your account settings
        </p>


        <div className="space-y-5">


          <div>

            <label className="font-semibold">
              Current Password
            </label>

            <input
              type="password"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              className="w-full mt-2 border rounded-lg px-4 py-3"
            />

          </div>


          <div>

            <label className="font-semibold">
              New Password
            </label>

            <input
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              className="w-full mt-2 border rounded-lg px-4 py-3"
            />

          </div>


          <div>

            <label className="font-semibold">
              Confirm New Password
            </label>

            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full mt-2 border rounded-lg px-4 py-3"
            />

          </div>


          <button
            onClick={changePassword}
            className="bg-blue-700 text-white px-6 py-3 rounded-lg hover:bg-blue-800"
          >
            Change Password
          </button>


        </div>


        <hr className="my-8"/>


        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700"
        >
          Logout
        </button>


      </div>


    </StudentLayout>

  );

}