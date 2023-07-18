import React, { useEffect, useState } from "react";
import { Container, CssBaseline, Stack, Typography } from "@mui/material";
import NavigationBar from "../components/navigation/NavigationBar";
import LoadingScreen from "../components/LoadingScreen";
import { useNavigate } from "react-router-dom";
import fetchUserInfo from "../utils/fetchUserInfo";
import { fetchTimerSettings, TimerSettings, fetchTimerTemplateFromId, FullWorkRestCycle, getCycleFromTemplate, isValidPattern } from '../utils/timerUtils';
import TimerView from "../components/timer/TimerView";

/**
 * Represents the page accessed by URL /timer in React Router. Contains the timer
 * feature in // TODO: Study.
 * 
 * @returns A React component object representing the Timer page.
 */
export default function Timer() {

    document.title = "Study Timer // TODO: Study";

    const POMODORO = { timer_template_id: 1, title: "Pomodoro", description: "A timer using the Pomodoro technique for 4 cycles.", user_id: "", work: 1500000, rest: 300000, cycles: 4 };

    const [ userData, setUserData ] = useState({ user_id: "", user_name: "", first_name: "", last_name: "", avatar_url: "", theme: "", telegram_handle: "", created_at: "", });
    const [ timerSettings, setTimerSettings ] = useState<TimerSettings>({ user_id: "", use_milliseconds: false, low_time_warning: true, timer_template_id: 0});
    const [ pattern, setPattern ] = useState<FullWorkRestCycle>(POMODORO);
    const [ loading, setLoading ] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchUserInfo(setUserData, loading, setLoading, navigate, true);
    }, [loading, navigate]);

    useEffect(() => {
        fetchTimerSettings(setTimerSettings);
        fetchTimerTemplateFromId(timerSettings.timer_template_id, setPattern);
    }, [timerSettings]);

    return loading ? (
            <LoadingScreen />
        ) : (
            <>
                <CssBaseline />
                <NavigationBar title="Study Timer" />
                <Container maxWidth="sm">
                    <Stack component="main" direction="column" gap={5} justifyContent="center" marginTop={5}>
                        <Typography textAlign="center" variant="h3" component="h1">{pattern.title}</Typography>
                        <TimerView pattern={ isValidPattern(pattern) ? getCycleFromTemplate(pattern) : getCycleFromTemplate(POMODORO) } showMs={timerSettings.use_milliseconds} onChange={() => fetchTimerSettings(setTimerSettings)} />
                    </Stack>
                </Container>
            </>
        );
}