import React from 'react';
import './App.css';
import Login from './routes/login';
import { Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import { CssBaseline, createTheme, ThemeProvider, responsiveFontSizes } from '@mui/material';
import supabase from './supabase';
import { useState, useEffect } from 'react';
import Dashboard from './routes/dashboard';
import ErrorPage from './routes/errorpage';
import CreateAccount from './routes/createaccount';
import Timer from './routes/timer';
import Notes from './routes/notes'
import Tasks from './routes/tasks';
import ModifyAccount from './routes/modifyaccount';
import fetchUserInfo, { UserInfo } from './utils/fetchUserInfo';
import NotesPreview from './routes/notespreview';
import CanvasDownloader from './routes/canvasdownloader';

const defaultTheme = {
  palette: {
    background: {
      default: "#eee",
    }
  },
  typography: {
    fontFamily: ["Open Sans", "sans-serif"].join(","),
    subtitle2: {
      fontSize: "0.85rem",
      color: "gray",
    }
  },
  spacing: 4,
};

const lightTheme = createTheme(defaultTheme);
const darkTheme = createTheme({ ...defaultTheme, palette: { mode: 'dark' } });

const getTheme = ( theme : string ) => {
  return responsiveFontSizes((theme === 'dark') ? darkTheme : lightTheme);
}


function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [ loading, setLoading ] = useState(true);
  const [ updated, setUpdated ] = useState(false);
  const [ currentTheme, setCurrentTheme ] = useState(getTheme('default'));

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
        if (!location.pathname.startsWith("/preview")) {
          navigate("/login");
        }
      }
    });
    return () => {
      subscription.data.subscription.unsubscribe();
    };
  }, [setIsLoggedIn, navigate, location.pathname]);

  useEffect(() => {
    fetchUserInfo((data : UserInfo) => {}, loading, setLoading, navigate, true).then((result) => {
      if (result.data !== null && result.data !== undefined && result.data[0] !== null && result.data[0] !== undefined) {
        setCurrentTheme(getTheme(result.data[0].theme));
      }
    });
    setUpdated(false);
  }, [loading, navigate, updated]);

  return (
    <div className="App">
      <ThemeProvider theme={currentTheme}>
        <CssBaseline />
        <Routes>
          <Route path="/" element={ isLoggedIn ? <Dashboard /> : <Login /> } />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/create-account" element={<CreateAccount onUpdate={ () => setUpdated(true) } />} />
          <Route path="/account-settings" element={<ModifyAccount onUpdate={ () => setUpdated(true) } />} />
          <Route path="/timer" element={<Timer />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/notes/:id" element={<Notes />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/canvas-downloader" element={<CanvasDownloader />} />
          <Route path="/preview/:id" element={<NotesPreview />} />
          <Route path="*" element={<ErrorPage error="404 Not Found" errorDesc="The page requested could not be found." />} />
        </Routes> 
      </ThemeProvider>
    </div>
  );
}

export default App;
