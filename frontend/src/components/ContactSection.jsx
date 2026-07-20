import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaClock,
} from "react-icons/fa";

export default function ContactSection() {
  return (
    <section id="contact" className="bg-gray-50 py-16 px-6">
      <div className="max-w-7xl mx-auto">

        {/* Heading */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-blue-900">
            Contact Us
          </h2>

          <p className="text-gray-600 mt-3">
            Have questions about admissions? Our team is ready to help you.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10">

          {/* Left Side */}
          <div className="bg-white shadow-lg rounded-xl p-8">

            <h3 className="text-2xl font-bold text-blue-800 mb-6">
              Admission Office
            </h3>

            <div className="space-y-6">

              <div className="flex items-start gap-4">
                <FaMapMarkerAlt className="text-blue-700 text-xl mt-1" />
                <div>
                  <h4 className="font-semibold">Address</h4>
                  <p className="text-gray-600">
                    Sukkur IBA University <br />
                    Airport Road, Sukkur <br />
                    Sindh, Pakistan
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <FaPhoneAlt className="text-blue-700 text-xl mt-1" />
                <div>
                  <h4 className="font-semibold">Phone</h4>
                  <p className="text-gray-600">
                    +92-71-5644000
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <FaEnvelope className="text-blue-700 text-xl mt-1" />
                <div>
                  <h4 className="font-semibold">Email</h4>
                  <p className="text-gray-600">
                    admissions@university.edu.pk
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <FaClock className="text-blue-700 text-xl mt-1" />
                <div>
                  <h4 className="font-semibold">Office Hours</h4>
                  <p className="text-gray-600">
                    Monday - Friday
                  </p>
                  <p className="text-gray-600">
                    09:00 AM - 05:00 PM
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* Right Side */}
          <div className="bg-white shadow-lg rounded-xl p-8">

            <h3 className="text-2xl font-bold text-blue-800 mb-6">
              Send us a Message
            </h3>

            <form className="space-y-5">

              <input
                type="text"
                placeholder="Full Name"
                className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />

              <input
                type="email"
                placeholder="Email Address"
                className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />

              <input
                type="text"
                placeholder="Subject"
                className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />

              <textarea
                rows="5"
                placeholder="Write your message..."
                className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
              ></textarea>

              <button
                type="submit"
                className="w-full bg-blue-700 hover:bg-blue-800 text-white py-3 rounded-lg font-semibold transition"
              >
                Send Message
              </button>

            </form>

          </div>

        </div>

        {/* Google Map */}
        <div className="mt-12 bg-white rounded-xl shadow-lg overflow-hidden">

          <iframe
            title="Google Map"
            src="https://www.google.com/maps?q=Sukkur%20IBA%20University&output=embed"
            width="100%"
            height="420"
            loading="lazy"
            className="border-0"
          ></iframe>

        </div>

      </div>
    </section>
  );
}