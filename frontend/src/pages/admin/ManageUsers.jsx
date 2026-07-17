import { useEffect, useState } from "react";
import API from "../../services/api";
import AdminLayout from "../../components/admin/AdminLayout";

export default function ManageUsers() {

  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [roleFilter, setRoleFilter] = useState("");

  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {

    let data = [...users];

    if (search) {

      const value = search.toLowerCase();

      data = data.filter(
        user =>
          user.name?.toLowerCase().includes(value) ||
          user.email?.toLowerCase().includes(value)
      );

    }

    if (roleFilter) {

      data = data.filter(
        user => user.role === roleFilter
      );

    }

    setFilteredUsers(data);

  }, [search, roleFilter, users]);

  const fetchUsers = async () => {

    try {

      setLoading(true);

      const res = await API.get("/users");

      setUsers(res.data.users);

      setFilteredUsers(res.data.users);

    } catch (err) {

      console.error(err);

      alert("Unable to load users.");

    } finally {

      setLoading(false);

    }

  };

  const deleteUser = async (id) => {

    if (!window.confirm("Delete this user?")) return;

    try {

      await API.delete(`/users/${id}`);

      fetchUsers();

    } catch (err) {

      console.error(err);

      alert("Unable to delete user.");

    }

  };

  const saveUser = async () => {

    try {

      await API.put(`/users/${editingUser._id}`, {

        name: editingUser.name,

        phone: editingUser.phone,

        role: editingUser.role,

        isActive: editingUser.isActive,

      });

      setEditingUser(null);

      fetchUsers();

      alert("User updated successfully.");

    } catch (err) {

      console.error(err);

      alert("Unable to update user.");

    }

  };

  const activeBadge = (status) => {

    return status ? (

      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
        Active
      </span>

    ) : (

      <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm">
        Inactive
      </span>

    );

  };

  return (

    <AdminLayout>

      <div className="p-6">

        <div className="flex justify-between items-center mb-6">

          <h1 className="text-3xl font-bold">
            Manage Users
          </h1>

        </div>

        <div className="bg-white rounded-lg shadow p-4 mb-6">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border rounded-lg px-4 py-2 outline-none"
            />

            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="border rounded-lg px-4 py-2"
            >

              <option value="">All Roles</option>

              <option value="student">Student</option>

              <option value="officer">Admission Officer</option>

              <option value="superadmin">Super Admin</option>

            </select>

          </div>

        </div>
                <div className="bg-white rounded-lg shadow overflow-x-auto">

          <table className="w-full">

            <thead className="bg-gray-100">

              <tr>

                <th className="text-left p-4">Name</th>

                <th className="text-left p-4">Email</th>

                <th className="text-left p-4">Role</th>

                <th className="text-left p-4">Status</th>

                <th className="text-center p-4">Actions</th>

              </tr>

            </thead>

            <tbody>

              {loading ? (

                <tr>

                  <td
                    colSpan="5"
                    className="text-center py-8"
                  >
                    Loading Users...
                  </td>

                </tr>

              ) : filteredUsers.length === 0 ? (

                <tr>

                  <td
                    colSpan="5"
                    className="text-center py-8"
                  >
                    No Users Found
                  </td>

                </tr>

              ) : (

                filteredUsers.map((user) => (

                  <tr
                    key={user._id}
                    className="border-t hover:bg-gray-50"
                  >

                    <td className="p-4 font-medium">
                      {user.name}
                    </td>

                    <td className="p-4">
                      {user.email}
                    </td>

                    <td className="p-4 capitalize">
                      {user.role}
                    </td>

                    <td className="p-4">
                      {activeBadge(user.isActive)}
                    </td>

                    <td className="p-4 text-center space-x-2">

                      <button
                        onClick={() => setEditingUser(user)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => deleteUser(user._id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
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
                {/* Edit User Modal */}

        {editingUser && (

          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6">

              <h2 className="text-2xl font-bold mb-6">
                Edit User
              </h2>

              <div className="space-y-4">

                <div>

                  <label className="block mb-2 font-medium">
                    Name
                  </label>

                  <input
                    type="text"
                    value={editingUser.name}
                    onChange={(e) =>
                      setEditingUser({
                        ...editingUser,
                        name: e.target.value,
                      })
                    }
                    className="w-full border rounded-lg px-4 py-2"
                  />

                </div>

                <div>

                  <label className="block mb-2 font-medium">
                    Phone
                  </label>

                  <input
                    type="text"
                    value={editingUser.phone || ""}
                    onChange={(e) =>
                      setEditingUser({
                        ...editingUser,
                        phone: e.target.value,
                      })
                    }
                    className="w-full border rounded-lg px-4 py-2"
                  />

                </div>

                <div>

                  <label className="block mb-2 font-medium">
                    Role
                  </label>

                  <select
                    value={editingUser.role}
                    onChange={(e) =>
                      setEditingUser({
                        ...editingUser,
                        role: e.target.value,
                      })
                    }
                    className="w-full border rounded-lg px-4 py-2"
                  >

                    <option value="student">
                      Student
                    </option>

                    <option value="officer">
                      Admission Officer
                    </option>

                    <option value="superadmin">
                      Super Admin
                    </option>

                  </select>

                </div>

                <div className="flex items-center gap-3">

                  <input
                    type="checkbox"
                    checked={editingUser.isActive}
                    onChange={(e) =>
                      setEditingUser({
                        ...editingUser,
                        isActive: e.target.checked,
                      })
                    }
                  />

                  <span>Active Account</span>

                </div>

              </div>

              <div className="flex justify-end gap-3 mt-8">

                <button
                  onClick={() => setEditingUser(null)}
                  className="px-5 py-2 rounded bg-gray-300 hover:bg-gray-400"
                >
                  Cancel
                </button>

                <button
                  onClick={saveUser}
                  className="px-5 py-2 rounded bg-green-600 hover:bg-green-700 text-white"
                >
                  Save Changes
                </button>

              </div>

            </div>

          </div>

        )}
              </div>

    </AdminLayout>

  );

}