import { useEffect, useState } from "react";
import API from "../../services/api";
import StudentLayout from "../../components/Student/StudentLayout";

export default function MyProfile() {

  const [loading, setLoading] = useState(true);

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {

    try {

      const res = await API.get("/auth/me");

      setProfile({
        name: res.data.user.name || "",
        email: res.data.user.email || "",
        phone: res.data.user.phone || "",
        address: res.data.user.address || "",
      });

    } catch (err) {

      console.error(err);

      alert("Unable to load profile.");

    } finally {

      setLoading(false);

    }

  };

  const handleChange = (e) => {

    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });

  };

  const updateProfile = async () => {

    try {

      await API.put("/auth/profile", profile);

      alert("Profile Updated Successfully");

    } catch (err) {

      console.error(err);

      alert("Unable to update profile.");

    }

  };

  return (

    <StudentLayout>

      <div className="p-6">

        <h1 className="text-3xl font-bold mb-6">

          My Profile

        </h1>

        {loading ? (

          <p>Loading...</p>

        ) : (          <div className="bg-white rounded-xl shadow-lg p-8">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <div>

                <label className="block mb-2 font-medium">
                  Full Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={profile.name}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

              </div>

              <div>

                <label className="block mb-2 font-medium">
                  Email Address
                </label>

                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  disabled
                  className="w-full border rounded-lg px-4 py-3 bg-gray-100"
                />

              </div>

              <div>

                <label className="block mb-2 font-medium">
                  Phone Number
                </label>

                <input
                  type="text"
                  name="phone"
                  value={profile.phone}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

              </div>

              <div>

                <label className="block mb-2 font-medium">
                  Address
                </label>

                <input
                  type="text"
                  name="address"
                  value={profile.address}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

              </div>

            </div>

            <div className="mt-8 flex justify-end">

              <button
                onClick={updateProfile}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
              >
                Update Profile
              </button>

            </div>

          </div>
                  )}

      </div>

    </StudentLayout>

  );

}