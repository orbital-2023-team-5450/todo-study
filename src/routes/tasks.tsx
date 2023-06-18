import React, { useEffect, useState } from "react";
import { CssBaseline, Stack } from "@mui/material";
import NavigationBar from "../components/navigation/NavigationBar";
import LoadingScreen from "../components/LoadingScreen";
import { useNavigate } from "react-router-dom";
import fetchUserInfo from "../utils/fetchUserInfo";
import TaskScreen from "../components/tasks/TaskScreen";

export default function Tasks() {

    document.title = "Tasks // TODO Study";

    const [ userData, setUserData ] = useState({ user_id: "", user_name: "", first_name: "", last_name: "", avatar_url: "", theme: "", telegram_handle: "", created_at: "", });
    const [ loading, setLoading ] = useState(true);
    
    const navigate = useNavigate();

    useEffect(() => {
        fetchUserInfo(setUserData, loading, setLoading, navigate, true);
    }, [loading, navigate]);

    return loading ? (
            <LoadingScreen />
        ) : (
            <Stack direction="column">
                <CssBaseline />
                <NavigationBar title="Tasks" />
                <TaskScreen />
            </Stack>
        );
}