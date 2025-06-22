import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { RoomInput } from "../components/homepage/RoomInput";

export default function Component() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname !== "/") {
      navigate("/", { replace: true });
    }
  }, [location.pathname, navigate]);

  return (
    <div className="mx-auto my-0 max-w-320 w-fit p-8 text-center">
      <RoomInput />
      <Link to="/host">
        <div className="inline-block mt-4 px-5 py-2 rounded-md bg-neutral-900 text-xl border border-transparent hover:border-cyan-400 cursor-pointer transition-colors duration-250">
          Host Game
        </div>
      </Link>
    </div>
  );
}
