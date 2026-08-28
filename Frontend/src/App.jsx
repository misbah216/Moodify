import { useState, useEffect } from "react";
import { RouterProvider } from "react-router";
import { router } from "./app.routes";
import "./features/shared/styles/global.scss";
import { AuthProvider } from "./features/auth/auth.context";
import { SongContextProvider } from "./features/home/song.context";
import SplashScreen from "./SplashScreen"; 

function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return <SplashScreen />;
  }

  return (
    <AuthProvider>
      <SongContextProvider>
        <RouterProvider router={router} />
      </SongContextProvider>
    </AuthProvider>
  );
}

export default App;