import React from 'react';
import './App.css';
import Login from './routes/login';
import { Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import { CssBaseline, createTheme, ThemeProvider } from '@mui/material';
import supabase from './supabase';
import { useState, useEffect } from 'react';
import Dashboard from './routes/dashboard';
import ErrorPage from './routes/errorpage';
import CreateAccount from './routes/createaccount';
import Timer from './routes/timer';
import Notes from './routes/notes'
import Tasks from './routes/tasks';
import ModifyAccount from './routes/modifyaccount';

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
    const subscription = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session != null) {
        setIsLoggedIn(true);
        if (location.pathname === "/" || location.pathname === "/login") {

          const { data: { user } } = await supabase.auth.getUser();
          const user_id : string = (user === null) ? "" : user.id;
            
          supabase.from('users').select().eq("user_id", user_id).then((result) => {
            if (result.error) {
              alert("Failed to redirect!");
            } else if (result.data.length === 0) {
              navigate("/create-account");
            } else {
              navigate("/dashboard");
            }
          });
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
          <Route path="/create-account" element={<CreateAccount />} />
          <Route path="/account-settings" element={<ModifyAccount />} />
          <Route path="/timer" element={<Timer />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="*" element={<ErrorPage error="404 Not Found" errorDesc="The page requested could not be found." />} />
        </Routes> 
      </ThemeProvider>
    </div>
  );
}

export default App;
