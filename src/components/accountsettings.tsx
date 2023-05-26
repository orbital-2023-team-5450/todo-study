// account settings: for creation and editing of account settings
import React, { ChangeEventHandler } from 'react';
import { TextField, Stack, Typography, MenuItem, Button, Select, SelectChangeEvent } from '@mui/material';
import { useState } from 'react';
import supabase from '../supabase';
import { todo } from 'node:test';

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
    const [ telegram, setTelegram ] = useState("");
    
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
        setTelegram(event.currentTarget.value);
    }

    const handleThemeChange = (event : React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        setTodoTheme(event.target.value);
    }

    // button handlers

    const handleFormSubmit = (event : React.SyntheticEvent) => {
        event.preventDefault();
        const getUserID = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            const user_id : string = (user === null) ? "" : user.id;
            return user_id;
        }

        getUserID().then((id : string) => {
            const submitInfo = {
                user_id: id,
                user_name: username,
                first_name: firstName,
                last_name: lastName,
                avatar_url: null,
                theme: todoTheme,
                telegram_handle: telegram,
                created_at: ((new Date()).toISOString()),
            };

            alert(JSON.stringify(submitInfo));
            
            const insertion = async () => {
                const { error } = await supabase.from('users').insert(submitInfo);
                if (error !== null) {
                    alert("Error adding user: " + JSON.stringify(error));
                }
            }

            insertion();

            alert(JSON.stringify(submitInfo));
        });

    }
    
    const handleLogoutClick = () => {
        supabase.auth.signOut();
    }
    
    return (
        <Stack gap={5} component="form" onSubmit={handleFormSubmit}>
            <Typography variant="h4" component="h1">{title}</Typography>
            <TextField required type="text" label="Username" variant="outlined" value={username} onChange={handleUsernameTextChange} />
            <Stack direction="row" gap={6}>
                <TextField required sx={{width:"95%"}} type="text" label="First Name" variant="outlined" value={firstName} onChange={handleFirstNameTextChange} />
                <TextField sx={{width:"95%"}} type="text" label="Last Name" variant="outlined" value={lastName} onChange={handleLastNameTextChange} />
            </Stack>
            <TextField select defaultValue={todoTheme} helperText="Select your theme" value={todoTheme} onChange={handleThemeChange}>
                {availableThemes.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                        {option.label}
                    </MenuItem>
                ))}
            </TextField>
            <TextField type="text" label="Telegram Handle" variant="outlined" value={telegram} onChange={handleTelegramTextChange} />
            <Stack direction="row" gap={6}>
                <Button variant="contained" size="large" type="submit">{ title }</Button>
                <Button variant="contained" size="large" onClick={handleLogoutClick}>Log out</Button>
            </Stack>
        </Stack>
    );
} 