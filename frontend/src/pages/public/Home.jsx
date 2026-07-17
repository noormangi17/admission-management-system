import Navbar from "../../components/Student/StudentNavbar";
import Footer from "../../components/Student/StudentFooter";
import hero from "../../assets/hero.jpg";
import Stats from "../../components/common/Stats";
import WhyChooseUs from "../../components/common/WhyChooseUs";
function Home() {
  return (
    <>
      <Navbar />

      <section className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 min-h-screen flex items-center">

        <div className="max-w-7xl mx-auto px-8 grid md:grid-cols-2 gap-12 items-center">

          {/* Left Side */}

          <div>

            <h1 className="text-6xl font-extrabold text-white leading-tight">
              Admission
              <br />
              Management
              <br />
              System
            </h1>

            <p className="text-xl text-gray-200 mt-8">
              Modern Online Admission Portal for Universities.
              Apply online, track your admission status,
              and manage your academic journey easily.
            </p>

            <div className="mt-10 flex gap-5">

              <button className="bg-yellow-400 hover:bg-yellow-300 text-black px-8 py-4 rounded-xl font-bold text-lg">
                Apply Now
              </button>

              <button className="border-2 border-white text-white px-8 py-4 rounded-xl hover:bg-white hover:text-blue-700 transition">
                Learn More
              </button>

            </div>

          </div>

          {/* Right Side */}

          <div className="flex justify-center">

            <img
              src={hero}
              alt="Students"
              className="w-full max-w-lg rounded-3xl shadow-2xl"
            />

          </div>

        </div>

      </section>
    <Stats />
    <WhyChooseUs />
      <Footer />
    </>
  );
}

export default Home;