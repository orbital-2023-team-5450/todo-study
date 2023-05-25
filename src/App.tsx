import React from 'react';
import './App.css';
import Login from './routes/login';
import { createRoutesFromElements, createBrowserRouter, Route, Routes, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { CssBaseline, createTheme, ThemeProvider } from '@mui/material';
import supabase from './supabase';
import { useState, useEffect } from 'react';
import Dashboard from './routes/dashboard';
import ErrorPage from './routes/errorpage';

const theme = createTheme({
  palette: {
    background: {
      default: "#eee",
    }
  },
  typography: {
    fontFamily: ["Open Sans", "sans-serif"].join(","),
  },
  spacing: 4
});

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const subscription = supabase.auth.onAuthStateChange((event, session) => {
      if (session != null) {
        setIsLoggedIn(true);
        if (location.pathname === "/" || location.pathname === "/login") {
          navigate("/dashboard");
        }
      } else {
        setIsLoggedIn(false);
        navigate("/login");
      }
    });
    return () => {
      subscription.data.subscription.unsubscribe();
    };
  }, [setIsLoggedIn, navigate, location.pathname]);

  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Routes>
          <Route path="/" element={ isLoggedIn ? <Dashboard /> : <Login /> } />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="*" element={<ErrorPage error="404 Not Found" errorDesc="The page requested could not be found." />} />
        </Routes>
      </ThemeProvider>
    </div>
  );
}

export default App;
