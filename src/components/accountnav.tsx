import React, { useState, useEffect } from "react";
import { Stack, Typography } from "@mui/material";
import supabase from "../supabase";
import AvatarView from "./avatarview";


export default function AccountNav() {

    const [ username, setUsername ] = useState("");
    const [ firstName, setFirstName ] = useState("");
    const [ lastName, setLastName ] = useState("");

    const fetchInfo = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        const user_id : string = (user === null) ? "" : user.id;
          
        supabase.from('users').select().eq("user_id", user_id).then((result) => {
            if (result.data === null || result.data === undefined || result.error) {
                alert("Error retrieving data!");
            } else if (result.data[0] === null || result.data[0] === undefined) {
                // user has not created account yet
            } else {
                // user has created account. ensure images do not reload unless
                // the page has been refreshed.
                setUsername(result.data[0].user_name);
                setFirstName(result.data[0].first_name);
                setLastName(result.data[0].last_name ?? "");
            }
        });
    }

    useEffect(() => {
        fetchInfo();
    }, [fetchInfo]);

    return (
        <Stack gap={5} direction="row">
            <AvatarView />
            <Stack justifyContent="center">
                <Typography fontWeight="bold" variant="h5" fontSize={16} component="h1">
                    { firstName + (( lastName === "" ) ? "" : ` ${lastName}`) }
                </Typography>
                <Typography variant="h6" fontSize={14} component="h2">
                    { username }
                </Typography>
            </Stack>
        </Stack>
    );
}