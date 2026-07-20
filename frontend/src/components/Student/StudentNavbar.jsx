import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { FaBell, FaRegEnvelope, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

function Navbar() {
  const { user, logout } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const fetchNotifications = async () => {
    try {
      const res = await API.get("/notifications");
      if (res.data && res.data.success) {
        setNotifications(res.data.notifications || []);
        setUnreadCount(res.data.unreadCount || 0);
      }
    } catch (e) {
      // ignore silently
    }
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
    } catch (e) {
      // ignore
    }
  };

  const markAllRead = async () => {
    try {
      await API.put(`/notifications/read-all`);
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (e) {}
  };

  return (
    <nav className="bg-blue-700 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        <h1 className="text-2xl font-bold">AMS</h1>

        <div className="flex gap-8 text-lg">
          <a href="#home" className="hover:text-yellow-300">Home</a>
          <a href="#notifications" className="hover:text-yellow-300">Notifications</a>
          <a href="#features" className="hover:text-yellow-300">Features</a>
          <a href="#contact" className="hover:text-yellow-300">Contact</a>
        </div>

        <div className="flex gap-4 items-center">
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="relative inline-flex items-center justify-center w-11 h-11 rounded-full bg-white text-blue-700 shadow-sm hover:bg-gray-100 transition"
              aria-label="Notifications"
            >
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
                  {unreadCount}
                </span>
              )}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M12 2C9.243 2 7 4.243 7 7v3.586l-.707.707A1 1 0 006 12v1h12v-1a1 1 0 00-.293-.707L17 10.586V7c0-2.757-2.243-5-5-5z" />
                <path d="M19 13H5v2h14v-2zm-7 7c1.654 0 3-1.346 3-3h-6c0 1.654 1.346 3 3 3z" />
              </svg>
            </button>

            {open && (
              <div className="absolute right-0 mt-3 w-96 bg-white text-gray-800 rounded-xl shadow-lg overflow-hidden z-50">
                <div className="p-3 border-b flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FaBell className="text-blue-600" />
                    <strong>Notifications</strong>
                  </div>
                  <button onClick={markAllRead} className="text-sm text-blue-600 hover:underline">Mark all read</button>
                </div>
                <div className="max-h-72 overflow-auto p-2">
                  {notifications.length === 0 && <div className="p-4 text-sm text-gray-600">No notifications</div>}

                  {/* Unread group */}
                  {notifications.filter(n => !n.isRead).length > 0 && (
                    <div className="mb-2">
                      <div className="text-xs text-gray-500 px-3 py-1">Unread</div>
                      {notifications.filter(n => !n.isRead).map((n) => (
                        <div key={n._id} className={`p-3 rounded-lg hover:bg-gray-50 cursor-pointer flex justify-between items-start ${n.isRead ? 'opacity-70' : 'bg-white'}`}>
                          <div className="flex gap-3">
                            <div className="mt-1 text-blue-600">
                              {n.type === 'status_change' ? <FaCheckCircle /> : n.type === 'application_submitted' ? <FaRegEnvelope /> : <FaExclamationCircle />}
                            </div>
                            <div onClick={() => markAsRead(n._id)}>
                              <div className="text-sm font-medium">{n.message}</div>
                              <div className="text-xs text-gray-500 mt-1">{timeAgo(n.createdAt)}</div>
                            </div>
                          </div>
                          <div>
                            <Link to={getNotificationLink(n)} onClick={() => setOpen(false)} className="text-blue-600 text-sm hover:underline">Open</Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Earlier group */}
                  {notifications.filter(n => n.isRead).length > 0 && (
                    <div>
                      <div className="text-xs text-gray-500 px-3 py-1">Earlier</div>
                      {notifications.filter(n => n.isRead).map((n) => (
                        <div key={n._id} className="p-3 rounded-lg hover:bg-gray-50 cursor-pointer flex justify-between items-start opacity-80">
                          <div className="flex gap-3">
                            <div className="mt-1 text-gray-500">
                              {n.type === 'status_change' ? <FaCheckCircle /> : n.type === 'application_submitted' ? <FaRegEnvelope /> : <FaExclamationCircle />}
                            </div>
                            <div>
                              <div className="text-sm">{n.message}</div>
                              <div className="text-xs text-gray-500 mt-1">{timeAgo(n.createdAt)}</div>
                            </div>
                          </div>
                          <div>
                            <Link to={getNotificationLink(n)} onClick={() => setOpen(false)} className="text-blue-600 text-sm hover:underline">Open</Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                </div>
                <div className="p-2 text-center border-t">
                  <Link to={user ? (user.role === 'student' ? '/student/applications' : '/admin/applications') : '/login'} onClick={() => setOpen(false)} className="text-blue-700 hover:underline">View all</Link>
                </div>
              </div>
            )}
          </div>

          {user ? (
            <>
              <div className="text-sm">{user.name}</div>
              <button onClick={logout} className="bg-white text-blue-700 px-3 py-2 rounded-lg font-semibold hover:bg-gray-200">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="bg-white text-blue-700 px-5 py-2 rounded-lg font-semibold hover:bg-gray-200">Login</Link>
              <Link to="/register" className="bg-yellow-400 text-black px-5 py-2 rounded-lg font-semibold hover:bg-yellow-300">Register</Link>
            </>
          )}

        </div>

      </div>
    </nav>
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

function getNotificationLink(n) {
  if (!n) return '/';
  if (n.type === 'status_change') return '/student/applications';
  if (n.type === 'application_submitted') return '/student/applications';
  return '/';
}

export default Navbar;