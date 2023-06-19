import React, { useEffect, useState } from "react";
import { CssBaseline, Typography } from "@mui/material";
import NavigationBar from "../components/navigation/NavigationBar";
import LoadingScreen from "../components/LoadingScreen";
import { useNavigate } from "react-router-dom";
import fetchUserInfo from "../utils/fetchUserInfo";

export default function Notes() {

    document.title = "Notes // TODO Study";

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
                <NavigationBar title="Notes" />
                <Typography><strong>To be implemented:</strong> This is a reminder.</Typography>
            </>
        );
}