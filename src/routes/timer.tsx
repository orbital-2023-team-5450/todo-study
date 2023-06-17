import React, { useEffect, useState } from "react";
import { Container, CssBaseline, Stack, Typography } from "@mui/material";
import Bar from "../components/bar";
import LoadingScreen from "../components/loadingscreen";
import { useNavigate } from "react-router-dom";
import fetchUserInfo from "../utils/fetchUserInfo";
import { fetchTimerSettings, TimerSettings, fetchTimerTemplateFromId, FullWorkRestCycle, getCycleFromTemplate } from '../utils/timerUtils';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import RefreshIcon from '@mui/icons-material/Refresh';
import TimerView from "../components/timer/TimerView";

export default function Reminder() {

    document.title = "Study Timer // TODO Study";

    const [ userData, setUserData ] = useState({ user_id: "", user_name: "", first_name: "", last_name: "", avatar_url: "", theme: "", telegram_handle: "", created_at: "", });
    const [ timerSettings, setTimerSettings ] = useState<TimerSettings>({ user_id: "", use_milliseconds: false, low_time_warning: true, timer_template_id: 0});
    const [ error, setError ] = useState(null);
    const [ pattern, setPattern ] = useState<FullWorkRestCycle>({ timer_template_id: 1, title: "Pomodoro", description: "A timer using the Pomodoro technique for 4 cycles.", user_id: "", work: 1500000, rest: 300000, cycles: 4 });
    const [ loading, setLoading ] = useState(true);
    const navigate = useNavigate();
    const defaultPatterns = {
        pomodoro: {
            work: 25*60*1000,
            rest: 5*60*1000,
            cycles: 4,
        },
        "52/17 rule": {
            work: 52*60*1000,
            rest: 17*60*1000,
            cycles: 3,
        },
        "2h paper": {
            work: 2*60*60*1000,
            rest: 0,
            cycles: 1,
        },
        "1.5h paper": {
            work: 1.5*60*60*1000,
            rest: 0,
            cycles: 1,
        },
        "1h paper": {
            work: 60*60*1000,
            rest: 0,
            cycles: 1,
        },
        HIIT: {
            work: 45*1000,
            rest: 30*1000,
            cycles: 12,
        }
    }

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
                        <TimerView pattern={ getCycleFromTemplate(pattern) } showMs={timerSettings.use_milliseconds} onChange={() => fetchTimerSettings(setTimerSettings)} />
                    </Stack>
                </Container>
            </>
        );
}