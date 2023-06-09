// account settings: for creation and editing of account settings
import React, { ChangeEventHandler, useEffect } from 'react';
import { TextField, Stack, Typography, MenuItem, Button, Select, SelectChangeEvent } from '@mui/material';
import { useState } from 'react';
import supabase from '../supabase';
import AvatarForm from './AvatarForm';
import { useNavigate } from 'react-router-dom';
import LoadingScreen from './loadingscreen';

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

export default function AccountSettings({ insert } : { insert : boolean }) {
    
    const [ username, setUsername ] = useState("");
    const [ origUsername, setOrigUsername ] = useState("");
    const [ firstName, setFirstName ] = useState("");
    const [ lastName, setLastName ] = useState("");
    const [ todoTheme, setTodoTheme ] = useState("default");
    const [ avatarUrl, setAvatarUrl ] = useState("");
    const [ origAvatarUrl, setOrigAvatarUrl ] = useState("");
    const [ avatarChanged, setAvatarChanged ] = useState(false);
    const [ telegram, setTelegram ] = useState("");
    const [ telegramError, setTelegramError ] = useState(false);
    const [ usernameError, setUsernameError ] = useState("");
    const [ loading, setLoading ] = useState(true);
    const navigate = useNavigate();
    const title = insert ? "Create account" : "Update account settings";

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
            } else if (loading) {
                // user has created account. ensure images do not reload unless
                // the page has been refreshed.
                setLoading(false);
                setUsername(result.data[0].user_name);
                setOrigUsername(result.data[0].user_name);
                setFirstName(result.data[0].first_name);
                setLastName(result.data[0].last_name ?? "");
                setTelegram(result.data[0].telegram_handle ?? "");
                setTodoTheme(result.data[0].theme);
                setOrigAvatarUrl(result.data[0].avatar_url);
                if (!avatarChanged) setAvatarUrl(result.data[0].avatar_url);
            }
        });
    }

    useEffect(() => {
        fetchInfo();
    }, [fetchInfo]);

    const handleFormSubmit = (event : React.SyntheticEvent) => {
        event.preventDefault();

        supabase.from('users').select('user_id, user_name').eq('user_name', username).then((result) => {
            const word : string = (insert) ? "create" : "update";
            if (result.data === null || result.data === undefined || result.error) {
                setUsernameError("There was an error performing validation on the username.");
                alert(`Cannot ${word} account! Ensure form is filled up properly`);
                return;
            } else if (insert && result.data[0] !== null && result.data[0] !== undefined) {
                setUsernameError("The username has been taken.");
                alert(`Cannot ${word} account! Ensure form is filled up properly`);
                return;
            } else if (!insert && result.data[0] !== undefined && result.data[0].user_name !== origUsername) {
                setUsernameError("The username has been taken.");
                alert(`Cannot ${word} account! Ensure form is filled up properly`);
                return;
            } else if (telegramError) {
                alert(`Cannot ${word} account! Ensure form is filled up properly`);
                return;
            } else {
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

                    const upsertion = async () => {
                        console.log(submitInfo);
                        if (insert) {
                            const { error } = await supabase.from('users').insert(submitInfo);
                            if (error !== null) {
                                alert("Error adding user: " + JSON.stringify(error));
                            } else {
                                navigate("/dashboard");
                            }
                        } else {
                            const { error } = await supabase.from('users').update(submitInfo).eq('user_id', id);
                            if (error !== null) {
                                alert("Error updating user: " + JSON.stringify(error));
                            } else {
                                navigate("/dashboard");
                            }
                        }
                    }

                    upsertion();
                });
            }
        });

    }

    const handleDashboardClick = () => { navigate("/dashboard") }
    
    const handleLogoutClick = () => { supabase.auth.signOut(); }

    return ( loading ? <LoadingScreen /> :
        <Stack gap={5} component="form" onSubmit={handleFormSubmit}>
            <Typography variant="h4" component="h1">{ insert ? "Create New Account" : "Update Account Settings"}</Typography>
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
            <AvatarForm
                url={avatarUrl}
                size={150}
                avatarChanged={avatarChanged}
                onUpload = {(event, url) => {
                    setAvatarChanged(true);
                    setAvatarUrl(url);
                }}
                onRemoveUpload={(event) => {
                    setAvatarUrl("");
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
                <Button variant="contained" size="medium" type="submit">{ title }</Button>
                { !insert && <Button variant="contained" size="medium" onClick={handleDashboardClick}>Back to Dashboard</Button> }
                <Button variant="contained" size="medium" onClick={handleLogoutClick}>Log out</Button>
            </Stack>
        </Stack>
    );
} 