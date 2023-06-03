import React, { useEffect, useState } from "react";
import { CssBaseline, Typography, Stack, Box, Container } from "@mui/material";
import Bar from "../components/bar";
import AvatarView from "../components/avatarview";
import LoadingScreen from "../components/loadingscreen";
import { useNavigate } from "react-router-dom";
import fetchUserInfo from "../utils/fetchUserInfo";
import TaskManager from "../components/taskmanager";

export default function Tasks() {

    document.title = "Tasks // TODO Study";

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
            <Stack direction="column">
                <CssBaseline />
                <Bar title="Tasks" />


                <Stack direction="row" flexGrow={1} marginTop={5}>
                    <CssBaseline />
                    <Container maxWidth="sm">
                        <Box sx={{ bgcolor: '#cff8fc', height: '85vh', borderRadius: '16px', '&:hover': {backgroundColor: 'primary.main', 
                                                                                    opacity: [0.9, 0.8, 0.7],} }}> 
                            <Typography variant="h2"> dk wat to put yet</Typography>
                        </Box>
                    </Container>
                    <Container maxWidth="sm">
                        <Box sx={{ bgcolor: '#cfe8fc', height: '85vh', borderRadius: '16px', '&:hover': {backgroundColor: 'primary.main', 
                                                                                    opacity: [0.9, 0.8, 0.7],} }}> 
                            <TaskManager taskType={"Due soon"}/>
                        </Box>
                    </Container>
                    <Container maxWidth="sm">
                        <Box sx={{ bgcolor: '#cfe8ff', height: '85vh', borderRadius: '16px', '&:hover': {backgroundColor: 'primary.main', 
                                                                                    opacity: [0.9, 0.8, 0.7],} }}> 
                        <TaskManager taskType={"Future assignment"}/>
                        </Box>
                    </Container>
                </Stack>
            </Stack>
        );
}