import { NavLink } from "react-router-dom";

export default function AdminSidebar() {
  const menuClass = ({ isActive }) =>
    `block px-6 py-3 transition ${
      isActive
        ? "bg-blue-700 text-white"
        : "text-blue-100 hover:bg-blue-800"
    }`;

  return (
    <aside className="w-64 min-h-screen bg-blue-900 shadow-lg">

      <div className="p-6 border-b border-blue-700">
        <h1 className="text-2xl font-bold text-white">
          Admission System
        </h1>

        <p className="text-blue-200 mt-1">
          Super Admin Panel
        </p>
      </div>

      <nav className="mt-5">

        <NavLink to="/admin" className={menuClass}>
          Dashboard
        </NavLink>

        <NavLink to="/admin/add-course" className={menuClass}>
          Add Course
        </NavLink>

        <NavLink to="/admin/manage-courses" className={menuClass}>
          Manage Courses
        </NavLink>

        <NavLink to="/admin/applications" className={menuClass}>
          Applications
        </NavLink>

        <NavLink to="/admin/users" className={menuClass}>
          Users
        </NavLink>

      </nav>

    </aside>
  );
}