// account settings: for creation and editing of account settings
import React, { ChangeEventHandler } from 'react';
import { TextField, Stack, Typography, MenuItem, Button, Select, SelectChangeEvent } from '@mui/material';
import { useState } from 'react';
import supabase from '../supabase';
import Avatar from './avatar';
import { useNavigate } from 'react-router-dom';

const availableThemes : {value : string, label : string}[] = [
    {
        value: 'default',
        label: 'Light Mode',
    },
    {
        value: 'dark',
        label: 'Dark Mode',
    }
];

export default function AccountSettings({ title } : { title : string }) {
    
    const [ username, setUsername ] = useState("");
    const [ firstName, setFirstName ] = useState("");
    const [ lastName, setLastName ] = useState("");
    const [ todoTheme, setTodoTheme ] = useState("default");
    const [ avatarUrl, setAvatarUrl ] = useState("");
    const [ telegram, setTelegram ] = useState("");
    const [ telegramError, setTelegramError ] = useState(false);
    const [ usernameError, setUsernameError ] = useState("");
    const navigate = useNavigate();

    // text field change handlers

    const handleUsernameTextChange = (event : React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        setUsername(event.currentTarget.value);
    }

    const handleFirstNameTextChange = (event : React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        setFirstName(event.currentTarget.value);
    }

    const handleLastNameTextChange = (event : React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        setLastName(event.currentTarget.value);
    }

    const handleTelegramTextChange = (event : React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        const textBoxValue : string = event.currentTarget.value;
        setTelegram(textBoxValue);
        setTelegramError(!textBoxValue.startsWith("@") && textBoxValue !== "");
    }

    const handleThemeChange = (event : React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        setTodoTheme(event.target.value);
    }

    // button handlers

    const handleFormSubmit = (event : React.SyntheticEvent) => {
        event.preventDefault();

        supabase.from('users').select('user_name').eq('user_name', username).then((result) => {
            console.log(result);
            if (result.data === null || result.data === undefined || result.error) {
                setUsernameError("There was an error performing validation on the username.");
                alert("Cannot create account! Ensure form is filled up properly");
                return;
            } else if (result.data[0] !== null && result.data[0] !== undefined) {
                setUsernameError("The username has been taken.");
                alert("Cannot create account! Ensure form is filled up properly");
                return;
            } else if (telegramError) {
                alert("Cannot create account! Ensure form is filled up properly");
                return;
            }
        });

        const getUserID = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            const user_id : string = (user === null) ? "" : user.id;
            return user_id;
        }

        getUserID().then((id : string) => {
            const submitInfo = {
                "user_id": id,
                "user_name": username,
                "first_name": firstName,
                "last_name": lastName,
                "avatar_url": avatarUrl,
                "theme": todoTheme,
                "telegram_handle": telegram,
                "created_at": ((new Date()).toISOString()),
            };

            const insertion = async () => {
                const { error } = await supabase.from('users').insert(submitInfo);

                if (error !== null) {
                    alert("Error adding user: " + JSON.stringify(error));
                } else {
                    navigate("/dashboard");
                }
            }

            insertion();
        });

    }
    
    const handleLogoutClick = () => {
        supabase.auth.signOut();
    }
    
    return (
        <Stack gap={5} component="form" onSubmit={handleFormSubmit}>
            <Typography variant="h4" component="h1">{title}</Typography>
            <Typography variant="h6" component="h2">Name</Typography>
            <TextField
                required
                type="text"
                label="Username"
                variant="outlined"
                value={username}
                onChange={handleUsernameTextChange}
                error={usernameError !== ""}
                helperText={usernameError} />
            <Stack direction="row" gap={6}>
                <TextField required sx={{width:"95%"}} type="text" label="First Name" variant="outlined" value={firstName} onChange={handleFirstNameTextChange} />
                <TextField sx={{width:"95%"}} type="text" label="Last Name" variant="outlined" value={lastName} onChange={handleLastNameTextChange} />
            </Stack>
            <Typography variant="h6" component="h2">Theme</Typography>
            <TextField select defaultValue={todoTheme} helperText="Select your theme" value={todoTheme} onChange={handleThemeChange}>
                {availableThemes.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                        {option.label}
                    </MenuItem>
                ))}
            </TextField>
            <Typography variant="h6" component="h2">Avatar</Typography>
            <Avatar
                url={avatarUrl}
                size={150}
                onUpload = {(event, url) => {
                    setAvatarUrl(url);
                }}
            />
            <Typography variant="h6" component="h2">Telegram Integration</Typography>
            <TextField
                type="text"
                label="Telegram Handle"
                variant="outlined"
                value={telegram}
                onChange={handleTelegramTextChange}
                helperText={telegramError ? "Telegram handle must start with @ or left blank." : ""}
                error={telegramError} />
            <Stack direction="row" gap={6}>
                <Button variant="contained" size="large" type="submit">{ title }</Button>
                <Button variant="contained" size="large" onClick={handleLogoutClick}>Log out</Button>
            </Stack>
        </Stack>
    );
} 