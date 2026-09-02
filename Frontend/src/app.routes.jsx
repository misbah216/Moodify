import { createBrowserRouter, useNavigate } from "react-router";
import { useEffect } from "react";
import Register from "./features/auth/pages/Register.jsx";
import Login from "./features/auth/pages/Login.jsx";
import Protected from "./features/auth/components/Protected";
import Home from "./features/home/pages/Home";
import SavedNotes from "./features/home/pages/SavedNotes";
import SplashScreen from "./SplashScreen";

const SplashWrapper = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/register");
    }, 2500);
    return () => clearTimeout(timer);
  }, [navigate]);

  return <SplashScreen />;
};

export const router = createBrowserRouter([
  {
    path: "/",
    element: <SplashWrapper />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/home",
    element: (
      <Protected>
        <Home />
      </Protected>
    ),
  },
  {
    path: "/saved-notes",
    element: (
      <Protected>
        <SavedNotes />
      </Protected>
    ),
  },
]);