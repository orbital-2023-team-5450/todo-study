import React, { useState, useEffect } from "react";
import { Stack, Typography } from "@mui/material";
import AvatarView from "../AvatarView";
import fetchUserInfo from "../../utils/fetchUserInfo";

export default function AccountNav() {

    const [ userData, setUserData ] = useState({ user_id: "", user_name: "", first_name: "", last_name: "", 
                                                 avatar_url: "", theme: "", telegram_handle: "", created_at: "", });
    const [ loading, setLoading ] = useState(true);
    const navigate = null;

    useEffect(() => {
        fetchUserInfo(setUserData, loading, setLoading, navigate, true).then((result) => {
            setLoading(false);
        });
    }, [loading, navigate]);

    return (
        <Stack gap={5} direction="row">
            <AvatarView />
            <Stack justifyContent="center">
                <Typography fontWeight="bold" fontSize="1.2rem" component="h1">
                    { userData.first_name + (( userData.last_name === "" ) ? "" : ` ${userData.last_name}`) }
                </Typography>
                <Typography component="h2">
                    { userData.user_name }
                </Typography>
            </Stack>
        </Stack>
    );
}