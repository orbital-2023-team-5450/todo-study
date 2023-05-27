import React from "react";
import { Avatar } from "@mui/material";

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

export default function AvatarView({ src, username, firstName, lastName} : { src : string, username : string, firstName : string, lastName: string }) {
    return (
        <Avatar src={src} alt={`${username}'s avatar`} sx={{ width: 56, height: 56, bgcolor: randomColor }}>
            {nameAcronym(firstName, lastName)}
        </Avatar>
    );
}