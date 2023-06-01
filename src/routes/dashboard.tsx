import React, { useState, useEffect } from "react";
import { Avatar, Box, Button, CircularProgress, CssBaseline, Stack, Typography } from "@mui/material";
import supabase from "../supabase";
import { Link, useNavigate } from "react-router-dom";
import Navsides from "../components/navsides";
import AvatarView from "../components/avatarview";
import Bar from "../components/bar";
import AvTimerIcon from '@mui/icons-material/AvTimer';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import LoadingScreen from "../components/loadingscreen";
import fetchUserInfo from "../utils/fetchUserInfo";

export default function Dashboard() {

    document.title = "Dashboard // TODO: Study";

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
                <Bar title="Dashboard" />

                <Stack direction="column" gap={3} justifyContent="center" marginTop={5}>
                    <Typography variant="h3" component="h1" marginTop={5}>
                    { userData.user_name === null ? "" : `Welcome back ${userData.user_name}!`}
                    </Typography>
                </Stack>
            </>
        );
}