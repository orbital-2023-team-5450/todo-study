import React, { useEffect, useState } from "react";
import { Avatar } from "@mui/material";
import supabase from "../supabase";
import { useNavigate } from "react-router-dom";

const randomColor = () : string => {
    let color : string = "#";
    for (let i : number = 0; i < 6; i++) color += Math.floor(Math.random() * 10);
    return color;
}

const nameAcronym = (firstName : string, lastName? : string) : string => {
    if (lastName && lastName != "") {
        return firstName.charAt(0) + lastName.charAt(0);
    } else {
        return firstName.charAt(0);
    }
}

export default function AvatarView( { src } : { src? : string }) {

    const [ username, setUsername ] = useState("");
    const [ firstName, setFirstName ] = useState("");
    const [ lastName, setLastName ] = useState("");
    const [ avatar, setAvatar ] = useState("");
    const [ loading, setLoading ] = useState(true);
    const navigate = useNavigate();

    const fetchInfo = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        const user_id : string = (user === null) ? "" : user.id;
          
        supabase.from('users').select().eq("user_id", user_id).then((result) => {
            if (result.data === null || result.data === undefined || result.error) {
                alert("Error retrieving data!");
            } else if (result.data[0] === null || result.data[0] === undefined) {
                // user has not created account yet
                setLoading(false);
                setAvatar(src ?? "");
                setUsername("newUser");
                setFirstName("New");
                setLastName("User");
            } else if (loading) {
                // user has created account. ensure images do not reload unless
                // the page has been refreshed.
                setLoading(false);
                setUsername(result.data[0].user_name);
                setFirstName(result.data[0].first_name);
                setLastName(result.data[0].last_name ?? "");
                console.log(supabase.storage.from('avatars').getPublicUrl(result.data[0].avatar_url))
                setAvatar(supabase.storage.from('avatars').getPublicUrl(result.data[0].avatar_url).data.publicUrl);
            }
        });
    }

    useEffect(() => {
        fetchInfo();
    }, [setUsername, fetchInfo]);

    return (
        <Avatar src={avatar} alt={`${username}'s avatar`} sx={{ width: 56, height: 56, bgcolor: randomColor }}>
            {nameAcronym(firstName, lastName)}
        </Avatar>
    );
}