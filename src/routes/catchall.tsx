import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { Placeholder } from "../pages/Placeholder";

export default function Component() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname !== "/") {
      navigate("/", {
        replace: true,
      });
    }
  }, [location.pathname, navigate]);

  return <Placeholder />;
}
