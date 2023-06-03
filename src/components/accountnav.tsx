import React, { useState, useEffect } from "react";
import { Stack, Typography } from "@mui/material";
import supabase from "../supabase";
import AvatarView from "./avatarview";
import fetchUserInfo from "../utils/fetchUserInfo";


export default function AccountNav() {

    const [ userData, setUserData ] = useState({ user_id: "", user_name: "", first_name: "", last_name: "", 
                                                 avatar_url: "", theme: "", telegram_handle: "", created_at: "", });
    const [ error, setError ] = useState(null);
    const [ loading, setLoading ] = useState(true);
    const navigate = null;

    useEffect(() => {
        fetchUserInfo(setUserData, loading, setLoading, navigate, true);
    }, [fetchUserInfo]);

    return (
        <Stack gap={5} direction="row">
            <AvatarView />
            <Stack justifyContent="center">
                <Typography fontWeight="bold" variant="h5" fontSize={16} component="h1">
                    { userData.first_name + (( userData.last_name === "" ) ? "" : ` ${userData.last_name}`) }
                </Typography>
                <Typography variant="h6" fontSize={14} component="h2">
                    { userData.user_name }
                </Typography>
            </Stack>
        </Stack>
    );
}