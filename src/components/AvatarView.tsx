import React, { useEffect, useState } from "react";
import { Avatar } from "@mui/material";
import supabase from "../supabase";
import { randomColor, getInitials } from "../utils/avatarUtils";

export default function AvatarView( { src, avatarChanged = false } : { src? : string, avatarChanged? : boolean }) {

    const [ username, setUsername ] = useState("");
    const [ firstName, setFirstName ] = useState("");
    const [ lastName, setLastName ] = useState("");
    const [ avatar, setAvatar ] = useState("");

    const fetchInfo = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        const user_id : string = (user === null) ? "" : user.id;
          
        supabase.from('users').select().eq("user_id", user_id).then((result) => {
            if (result.data === null || result.data === undefined || result.error) {
                console.log("Error retrieving data! Error: " + JSON.stringify(result.error));
            } else if (result.data[0] === null || result.data[0] === undefined) {
                // user has not created account yet
                setAvatar(src ?? "");
                setUsername("newUser");
                setFirstName("New");
                setLastName("User");
            } else {
                // user has created account. ensure images do not reload unless
                // the page has been refreshed.
                setUsername(result.data[0].user_name);
                setFirstName(result.data[0].first_name);
                setLastName(result.data[0].last_name ?? "");
                if (avatarChanged) {
                    setAvatar(src ?? "");
                } else {
                    setAvatar(supabase.storage.from('avatars').getPublicUrl(result.data[0].avatar_url).data.publicUrl);
                }
            }
        });
    }

    useEffect(() => {
        fetchInfo();
    }, [setUsername, fetchInfo]);

    return (
        <Avatar src={avatar} alt={`${username}'s avatar`} sx={{ width: 56, height: 56, bgcolor: randomColor(username) }}>
            {getInitials(firstName, lastName)}
        </Avatar>
    );
}