import { FaBell, FaClipboardList, FaCalendarAlt, FaEnvelopeOpenText } from "react-icons/fa";

const notifications = [
  {
    icon: <FaClipboardList size={28} className="text-blue-600" />,
    title: "Application Deadline",
    detail: "Submit your admission form before July 31 to avoid delay.",
    time: "2 hours ago",
  },
  {
    icon: <FaCalendarAlt size={28} className="text-green-600" />,
    title: "Interview Schedule",
    detail: "Campus interview slots are now available for selected students.",
    time: "1 day ago",
  },
  {
    icon: <FaEnvelopeOpenText size={28} className="text-orange-500" />,
    title: "Document Reminder",
    detail: "Upload marksheets and ID proof to complete your application.",
    time: "3 days ago",
  },
];

export default function Notifications() {
  return (
    <section id="notifications" className="py-24 bg-blue-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-start justify-between gap-6 mb-12">
          <div>
            <h2 className="text-4xl font-bold text-blue-900">Notifications</h2>
            <p className="text-gray-600 mt-3 max-w-2xl">
              Stay updated with the latest admission alerts, deadlines, and
              important announcements.
            </p>
          </div>
          <div className="rounded-3xl bg-white p-5 shadow-lg text-blue-800">
            <p className="text-sm uppercase tracking-[0.2em] font-semibold">
              New alerts
            </p>
            <p className="mt-2 text-3xl font-bold">3</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {notifications.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-3xl p-8 shadow-xl border border-blue-100 hover:-translate-y-1 transition"
            >
              <div className="mb-5">{item.icon}</div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                {item.title}
              </h3>
              <p className="text-gray-600 mb-5">{item.detail}</p>
              <p className="text-sm text-gray-500">{item.time}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
