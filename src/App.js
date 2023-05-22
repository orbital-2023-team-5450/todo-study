import './App.css';
import Login from './routes/login';
import Home from './routes/home';
import { createRoutesFromElements, createBrowserRouter, Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import { CssBaseline, createTheme } from '@mui/material';
import supabase from './supabase';
import { useState, useEffect } from 'react';

const theme = createTheme({
  palette: {
    background: {
      default: "#eee",
    }
  }
});

function App() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const subscription = supabase.auth.onAuthStateChange((event, session) => {
      if (session != null) {
        setIsLoggedIn(true);
        navigate("/home");
      } else {
        setIsLoggedIn(false);
        navigate("/login");
      }
    });
    return () => {
      subscription.data.subscription.unsubscribe();
    };
  }, [setIsLoggedIn, navigate]);

  return (
    <div className="App">
      <CssBaseline />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </div>
  );
}

export default App;
