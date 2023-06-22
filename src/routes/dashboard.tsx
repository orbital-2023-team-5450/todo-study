import React, { useState, useEffect } from "react";
import { CssBaseline, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import LoadingScreen from "../components/LoadingScreen";
import fetchUserInfo from "../utils/fetchUserInfo";
import NavigationBar from "../components/navigation/NavigationBar";

/**
 * Represents the page accessed by URL / in React Router when logged in. Contains the
 * dashboard feature to be developed in // TODO: Study.
 * 
 * @returns A React component object representing the dashboard page.
 */
export default function Dashboard() {

    document.title = "Dashboard // TODO: Study";

    const [ userData, setUserData ] = useState({ user_id: "", user_name: "", first_name: "", last_name: "", avatar_url: "", theme: "", telegram_handle: "", created_at: "", });
    const [ loading, setLoading ] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchUserInfo(setUserData, loading, setLoading, navigate, true);
    }, [loading, navigate]);

    return loading ? (
            <LoadingScreen />
        ) : (
            <> 
                <CssBaseline />
                <NavigationBar title="Dashboard" />

                <Stack direction="column" gap={3} justifyContent="center" marginTop={5}>
                    <Typography variant="h3" component="h1" marginTop={5}>
                    { userData.user_name === null ? "" : `Welcome back ${userData.user_name}!`}
                    </Typography>
                </Stack>
            </>
        );
}