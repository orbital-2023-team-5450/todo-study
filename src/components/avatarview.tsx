import React, { useEffect, useState } from "react";
import { Avatar } from "@mui/material";
import supabase from "../supabase";
import { useNavigate } from "react-router-dom";

/**
 * Generates a dark colour, with each colour component from 0 to 100, based on the user's
 * username.
 * 
 * @returns A dark colour in hex code.
 */
const randomColor = (username : string) : string => {
    let color : string = "#";
    const components : number[] = [
        username.split('').map(char => char.charCodeAt(0)).reduce((x, y) => x + y, 0) % 60 + 40,
        Math.pow((username.length + username.charCodeAt(0)), 2) % 60 + 40,
        Math.pow((username.charCodeAt(username.length - 2) - username.length), 2) % 60 + 40,
    ];

    console.log(components);

    for (let i : number = 0; i < 3; i++) color += Math.floor(components[i]).toString(16).padStart(2, "0");
    return color;
}

/**
 * Generates the initials of the user based on first name and last name.
 * 
 * @param firstName The first name.
 * @param lastName The last name (optional).
 * @returns The name's initials to be generated.
 */
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
            console.log(result.error);
            if (result.data === null || result.data === undefined || result.error) {
                console.log("Error retrieving data! Error: " + JSON.stringify(result.error));
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
        <Avatar src={avatar} alt={`${username}'s avatar`} sx={{ width: 56, height: 56, bgcolor: randomColor(username) }}>
            {nameAcronym(firstName, lastName)}
        </Avatar>
    );
}