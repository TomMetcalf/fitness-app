import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Signup from './pages/Signup';
import Login from './pages/Login';
import PasswordReset from './pages/PasswordReset';
import Navbar from './components/Navbar';
import { useAuthContext } from './hooks/useAuthContext';
import { createContext, useEffect, useState } from 'react';
import LightModeToggle from './components/LightModeToggle';

export const ThemeContext = createContext(null);

function App() {
  const { user } = useAuthContext();
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

    useEffect(() => {
      localStorage.setItem('theme', theme);
    }, [theme]);

  const toggleTheme = () => {
    setTheme((curr) => (curr === "light" ? "dark" : "light"))
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className="App" id={theme}>
        <BrowserRouter>
          <Navbar />
          <LightModeToggle toggleTheme={toggleTheme} theme={theme} />
          <div className="pages">
            <Routes>
              <Route
                path="/"
                element={
                  user ? <Home theme={theme} /> : <Navigate to="/login" />
                }
              />
              <Route
                path="/signup"
                element={!user ? <Signup /> : <Navigate to="/" />}
              />
              <Route
                path="/login"
                element={!user ? <Login /> : <Navigate to="/" />}
              />
              <Route path="/reset-password" element={<PasswordReset />} />
            </Routes>
          </div>
        </BrowserRouter>
      </div>
    </ThemeContext.Provider>
  );
}

export default App;
