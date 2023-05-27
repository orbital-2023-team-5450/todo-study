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

export default function Dashboard() {

    document.title = "Dashboard // TODO: Study";

    const handleLogoutClick = () => {
        supabase.auth.signOut();
    }

    const [ username, setUsername ] = useState("");
    const [ firstName, setFirstName ] = useState("");
    const [ lastName, setLastName ] = useState("");
    const [ avatar, setAvatar ] = useState("");
    const [ error, setError ] = useState(null);
    const [ loading, setLoading ] = useState(true);
    const navigate = useNavigate();
    const features : {feature: string, app: JSX.Element}[] = [{feature: "timer", app: <AvTimerIcon />},
                                                              {feature: "reminder", app: <NotificationsNoneIcon />}, 
                                                              {feature: "task", app: <FormatListBulletedIcon />}];

    const fetchInfo = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        const user_id : string = (user === null) ? "" : user.id;
          
        supabase.from('users').select().eq("user_id", user_id).then((result) => {
            if (result.data === null || result.data === undefined || result.error) {
                alert("Error retrieving data!");
            } else if (result.data[0] === null || result.data[0] === undefined) {
                // user has not created account yet but has been directed to dashboard
                navigate("/create-account");
            } else if (loading) {
                // user has created account. ensure images do not reload unless
                // the page has been refreshed.
                setLoading(false);
                setUsername(result.data[0].user_name);
                setFirstName(result.data[0].first_name);
                setLastName(result.data[0].last_name ?? "");
                setAvatar(supabase.storage.from('avatars').getPublicUrl(result.data[0].avatar_url).data.publicUrl);
            }
        });
    }

    useEffect(() => {
        fetchInfo();
    }, [setUsername, setError, fetchInfo]);

    return loading ? (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="100vh"
            >
                <CircularProgress size={120} />
            </Box>
        ) : (
            <> 
                <CssBaseline />
                <Bar nav={<Navsides features={features} />} 
                     acc={<AvatarView src={avatar} username={username} firstName={firstName} lastName={lastName} />}
                     signOut={<Button variant="contained" onClick={handleLogoutClick} disableElevation>Sign out</Button>}/>

                <Stack direction="column" gap={3} justifyContent="center" marginTop={5}>
                    <Typography variant="h3" component="h1" marginTop={5}>
                    { username === null ? "" : `Welcome back ${username}!`}
                    </Typography>
                </Stack>
            </>
        );
}