import React, { useEffect, useState } from "react";
import { CssBaseline, Typography } from "@mui/material";
import Bar from "../components/bar";
import AvatarView from "../components/avatarview";
import LoadingScreen from "../components/loadingscreen";
import supabase from "../supabase";
import { useNavigate } from "react-router-dom";
import fetchUserInfo from "../utils/fetchUserInfo";

export default function Reminders() {

    document.title = "Reminders // TODO Study";

    const [ userData, setUserData ] = useState({ user_id: "", user_name: "", first_name: "", last_name: "", avatar_url: "", theme: "", telegram_handle: "", created_at: "", });
    const [ error, setError ] = useState(null);
    const [ loading, setLoading ] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchUserInfo(setUserData, loading, setLoading, navigate, true);
    }, [fetchUserInfo]);

    return loading ? (
            <LoadingScreen />
        ) : (
            <>
                <CssBaseline />
                <Bar title="Reminders" />
                <Typography><strong>To be implemented:</strong> This is a reminder.</Typography>
            </>
        );
}