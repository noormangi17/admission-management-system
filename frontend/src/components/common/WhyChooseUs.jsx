import { FaLaptop, FaUserShield, FaClock, FaGraduationCap } from "react-icons/fa";

const features = [
  {
    icon: <FaLaptop size={36} />,
    title: "Online Admission",
    description: "Apply for admission anytime from anywhere."
  },
  {
    icon: <FaUserShield size={36} />,
    title: "Secure Portal",
    description: "Your personal and academic data is fully protected."
  },
  {
    icon: <FaClock size={36} />,
    title: "Fast Processing",
    description: "Track your application status in real time."
  },
  {
    icon: <FaGraduationCap size={36} />,
    title: "Quality Education",
    description: "Experienced faculty with modern learning methods."
  }
];

export default function WhyChooseUs() {
  return (
    <section id="features" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800">
            Why Choose Our University?
          </h2>

          <p className="text-gray-500 mt-4">
            Everything you need for a smooth admission experience.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">

          {features.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl hover:-translate-y-2 transition duration-300"
            >
              <div className="text-blue-700 mb-5">
                {item.icon}
              </div>

              <h3 className="text-xl font-bold mb-3">
                {item.title}
              </h3>

              <p className="text-gray-600">
                {item.description}
              </p>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
}