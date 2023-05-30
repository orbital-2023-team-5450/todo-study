import React, { useEffect, useState } from "react";
import { CssBaseline, Typography } from "@mui/material";
import Bar from "../components/bar";
import AvatarView from "../components/avatarview";
import LoadingScreen from "../components/loadingscreen";
import supabase from "../supabase";
import { useNavigate } from "react-router-dom";

export default function Tasks() {

    document.title = "Tasks // TODO Study";

    const [ username, setUsername ] = useState("");
    const [ firstName, setFirstName ] = useState("");
    const [ lastName, setLastName ] = useState("");
    const [ avatar, setAvatar ] = useState("");
    const [ error, setError ] = useState(null);
    const [ loading, setLoading ] = useState(true);
    const navigate = useNavigate();

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
            <LoadingScreen />
        ) : (
            <>
                <CssBaseline />
                <Bar title="Tasks" />
                <Typography><strong>To be implemented:</strong> This is a task.</Typography>
            </>
        );
}