import { useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../../services/api";
import { FaBell, FaRegEnvelope, FaExclamationCircle } from 'react-icons/fa';

export default function AdminNavbar() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const user = JSON.parse(localStorage.getItem("user"));

  const fetchNotifications = async () => {
    try {
      const res = await API.get("/notifications");
      if (res.data && res.data.success) {
        setNotifications(res.data.notifications || []);
        setUnreadCount(res.data.unreadCount || 0);
      }
    } catch (e) {}
  };

  useEffect(() => {
    fetchNotifications();
    const iv = setInterval(fetchNotifications, 20000);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    const onClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setOpen(false);
    };
    window.addEventListener("click", onClick);
    return () => window.removeEventListener("click", onClick);
  }, []);

  const markAsRead = async (id) => {
    try {
      await API.put(`/notifications/${id}/read`);
      setNotifications((prev) => prev.map((n) => (n._id === id ? { ...n, isRead: true } : n)));
      setUnreadCount((c) => Math.max(0, c - 1));
    } catch (e) {}
  };

  const markAllRead = async () => {
    try {
      await API.put(`/notifications/read-all`);
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (e) {}
  };

  return (
    <header className="bg-white shadow-md px-8 py-4 flex justify-between items-center">

      <div>
        <h2 className="text-2xl font-bold text-gray-800">Admin Dashboard</h2>
        <p className="text-sm text-gray-500">Welcome, {user?.name}</p>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative" ref={dropdownRef}>
          <button onClick={() => setOpen((v) => !v)} className="relative inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 text-gray-800 hover:bg-gray-200">
            {unreadCount > 0 && <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full">{unreadCount}</span>}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M12 2C9.243 2 7 4.243 7 7v3.586l-.707.707A1 1 0 006 12v1h12v-1a1 1 0 00-.293-.707L17 10.586V7c0-2.757-2.243-5-5-5z" />
              <path d="M19 13H5v2h14v-2zm-7 7c1.654 0 3-1.346 3-3h-6c0 1.654 1.346 3 3 3z" />
            </svg>
          </button>

          {open && (
            <div className="absolute right-0 mt-3 w-96 bg-white text-gray-800 rounded-xl shadow-lg overflow-hidden z-50">
              <div className="p-3 border-b flex items-center justify-between">
                <div className="flex items-center gap-3"><FaBell className="text-blue-600" /><strong>Notifications</strong></div>
                <button onClick={markAllRead} className="text-sm text-blue-600 hover:underline">Mark all read</button>
              </div>
              <div className="max-h-72 overflow-auto p-2">
                {notifications.length === 0 && <div className="p-4 text-sm text-gray-600">No notifications</div>}

                {notifications.filter(n => !n.isRead).length > 0 && (
                  <div className="mb-2">
                    <div className="text-xs text-gray-500 px-3 py-1">Unread</div>
                    {notifications.filter(n => !n.isRead).map(n => (
                      <div key={n._id} className="p-3 rounded-lg hover:bg-gray-50 cursor-pointer flex justify-between items-start">
                        <div className="flex gap-3">
                          <div className="mt-1 text-blue-600"><FaRegEnvelope /></div>
                          <div>
                            <div className="text-sm font-medium">{n.message}</div>
                            <div className="text-xs text-gray-500 mt-1">{timeAgo(n.createdAt)}</div>
                          </div>
                        </div>
                        <div><Link to="/admin/applications" onClick={() => setOpen(false)} className="text-blue-600 text-sm hover:underline">Open</Link></div>
                      </div>
                    ))}
                  </div>
                )}

                {notifications.filter(n => n.isRead).length > 0 && (
                  <div>
                    <div className="text-xs text-gray-500 px-3 py-1">Earlier</div>
                    {notifications.filter(n => n.isRead).map(n => (
                      <div key={n._id} className="p-3 rounded-lg hover:bg-gray-50 cursor-pointer flex justify-between items-start opacity-80">
                        <div className="flex gap-3">
                          <div className="mt-1 text-gray-500"><FaExclamationCircle /></div>
                          <div>
                            <div className="text-sm">{n.message}</div>
                            <div className="text-xs text-gray-500 mt-1">{timeAgo(n.createdAt)}</div>
                          </div>
                        </div>
                        <div><Link to="/admin/applications" onClick={() => setOpen(false)} className="text-blue-600 text-sm hover:underline">Open</Link></div>
                      </div>
                    ))}
                  </div>
                )}

              </div>
              <div className="p-2 text-center border-t"><Link to="/admin/applications" onClick={() => setOpen(false)} className="text-blue-700 hover:underline">View all</Link></div>
            </div>
          )}
        </div>

        <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg">Logout</button>
      </div>

    </header>
  );
}

// helper: relative time
function timeAgo(dateStr) {
  const d = new Date(dateStr);
  const diff = Math.floor((Date.now() - d.getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff/60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff/3600)}h ago`;
  return `${Math.floor(diff/86400)}d ago`;
}