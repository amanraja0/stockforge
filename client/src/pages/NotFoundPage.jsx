import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-center items-center px-6">
      <h1 className="text-7xl md:text-8xl font-black text-blue-500 leading-none">
        404
      </h1>

      <p className="text-xl md:text-2xl mt-4 text-slate-300">Page not found</p>

      <Link
        to="/dashboard"
        className="mt-8 bg-blue-600 hover:bg-blue-700 transition px-6 py-3 rounded-lg font-semibold"
      >
        Back to Dashboard
      </Link>
    </div>
  );
};

export default NotFoundPage;
