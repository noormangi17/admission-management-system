import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-blue-700 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        <h1 className="text-2xl font-bold">
          AMS
        </h1>

        <div className="flex gap-8 text-lg">

          <Link to="/" className="hover:text-yellow-300">
            Home
          </Link>

          <Link to="/courses" className="hover:text-yellow-300">
            Courses
          </Link>

          <Link to="/about" className="hover:text-yellow-300">
            About
          </Link>

          <Link to="/contact" className="hover:text-yellow-300">
  Contact
</Link>

        </div>

        <div className="flex gap-4">

          <Link
  to="/login"
  className="bg-white text-blue-700 px-5 py-2 rounded-lg font-semibold hover:bg-gray-200"
>
  Login
</Link>

         <Link
    to="/register"
    className="bg-yellow-400 text-black px-5 py-2 rounded-lg font-semibold hover:bg-yellow-300"
>
    Register
</Link>

        </div>

      </div>
    </nav>
  );
}

export default Navbar;