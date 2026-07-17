import { FaUserGraduate, FaUniversity, FaChalkboardTeacher, FaAward } from "react-icons/fa";

function Stats() {
  const stats = [
    {
      icon: <FaUserGraduate size={40} />,
      number: "25K+",
      title: "Students",
    },
    {
      icon: <FaUniversity size={40} />,
      number: "100+",
      title: "Departments",
    },
    {
      icon: <FaChalkboardTeacher size={40} />,
      number: "500+",
      title: "Faculty Members",
    },
    {
      icon: <FaAward size={40} />,
      number: "98%",
      title: "Success Rate",
    },
  ];

  return (
    <section className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-6">

        <h2 className="text-4xl font-bold text-center text-gray-800">
          Our Achievements
        </h2>

        <p className="text-center text-gray-500 mt-3 mb-14">
          Trusted by thousands of students every year.
        </p>

        <div className="grid md:grid-cols-4 gap-8">

          {stats.map((item, index) => (
            <div
              key={index}
              className="bg-blue-50 rounded-2xl shadow-lg p-8 text-center hover:-translate-y-2 transition duration-300"
            >
              <div className="text-blue-700 flex justify-center mb-5">
                {item.icon}
              </div>

              <h3 className="text-4xl font-bold text-gray-800">
                {item.number}
              </h3>

              <p className="mt-3 text-gray-600">
                {item.title}
              </p>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
}

export default Stats;