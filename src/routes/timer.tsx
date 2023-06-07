import React, { useEffect, useState } from "react";
import { Button, Container, CssBaseline, Stack, Typography } from "@mui/material";
import Bar from "../components/bar";
import AvatarView from "../components/avatarview";
import LoadingScreen from "../components/loadingscreen";
import supabase from "../supabase";
import { useNavigate } from "react-router-dom";
import fetchUserInfo from "../utils/fetchUserInfo";
import { timerToString } from '../utils/timerUtils';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useTimer } from "../hooks/useTimer";
import TimerView from "../components/TimerView";

export default function Reminder() {

    document.title = "Study Timer // TODO Study";

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
                <Bar title="Study Timer" />
                <Container maxWidth="sm">
                    <Stack component="main" direction="column" gap={5} justifyContent="center" marginTop={5}>
                        <Typography variant="h3" component="h1">Hello world!</Typography>
                        <TimerView pattern={ { work: 3000, rest: 1500, cycles: 2 }} showMs={true} />
                    </Stack>
                </Container>
            </>
        );
}