import React, { useEffect, useState } from "react";
import { Container, CssBaseline, Snackbar, Stack, Typography } from "@mui/material";
import Bar from "../components/bar";
import LoadingScreen from "../components/loadingscreen";
import { useNavigate } from "react-router-dom";
import fetchUserInfo from "../utils/fetchUserInfo";
import { fetchTimerSettings, TimerSettings, fetchTimerTemplateFromId, FullWorkRestCycle, getCycleFromTemplate, getCycleLength, isValidPattern } from '../utils/timerUtils';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import RefreshIcon from '@mui/icons-material/Refresh';
import TimerView from "../components/timer/TimerView";

export default function Timer() {

    document.title = "Study Timer // TODO Study";

    const POMODORO = { timer_template_id: 1, title: "Pomodoro", description: "A timer using the Pomodoro technique for 4 cycles.", user_id: "", work: 1500000, rest: 300000, cycles: 4 };

    const [ userData, setUserData ] = useState({ user_id: "", user_name: "", first_name: "", last_name: "", avatar_url: "", theme: "", telegram_handle: "", created_at: "", });
    const [ timerSettings, setTimerSettings ] = useState<TimerSettings>({ user_id: "", use_milliseconds: false, low_time_warning: true, timer_template_id: 0});
    const [ error, setError ] = useState(null);
    const [ pattern, setPattern ] = useState<FullWorkRestCycle>(POMODORO);
    const [ loading, setLoading ] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchUserInfo(setUserData, loading, setLoading, navigate, true);
        fetchTimerSettings(setTimerSettings);
        fetchTimerTemplateFromId(timerSettings.timer_template_id, setPattern);
    }, [fetchUserInfo, fetchTimerSettings, fetchTimerTemplateFromId, timerSettings]);

    return loading ? (
            <LoadingScreen />
        ) : (
            <>
                <CssBaseline />
                <Bar title="Study Timer" />
                <Container maxWidth="sm">
                    <Stack component="main" direction="column" gap={5} justifyContent="center" marginTop={5}>
                        <Typography variant="h3" component="h1">{pattern.title}</Typography>
                        <TimerView pattern={ isValidPattern(pattern) ? getCycleFromTemplate(pattern) : getCycleFromTemplate(POMODORO) } showMs={timerSettings.use_milliseconds} onChange={() => fetchTimerSettings(setTimerSettings)} />
                    </Stack>
                </Container>
            </>
        );
}