import { useAuth } from "../../context/AuthContext";

export default function Topbar() {
  const { user } = useAuth();

  return (
    <div className="bg-white shadow px-8 py-5 flex justify-between items-center">

      <h2 className="text-2xl font-bold">
        Dashboard
      </h2>

      <div>

        <span className="font-semibold">
          {user?.name}
        </span>

      </div>

    </div>
  );
}