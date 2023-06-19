import React, { useEffect, useState } from 'react';
import supabase from '../supabase';
import { Button, Stack, Typography } from "@mui/material";
import AvatarView from './AvatarView';

export default function AvatarForm({ url, onUpload, onRemoveUpload, avatarChanged = false } : { url: string, size : number, onUpload : ( event : React.ChangeEvent<HTMLInputElement> , url : string ) => void, onRemoveUpload : ( event : React.MouseEvent<HTMLButtonElement>) => void, avatarChanged? : boolean }) {
    const [avatarUrl, setAvatarUrl] = useState("");
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (url !== "") {
            downloadImage(url);
        }
    }, [url]);

    async function downloadImage(path : string) {
        try {
            const { data, error } = await supabase.storage.from('avatars').download(path);
            if (error) {
                throw error;
            }
            const url = URL.createObjectURL(data);
            setAvatarUrl(url);
        } catch (error : any) {
            // no image!
            console.log('Error downloading image: ' + error.message);
        }
    }

    async function uploadAvatar(event : React.ChangeEvent<HTMLInputElement>) {
        try {
            setUploading(true);

            if (!event.target.files || event.target.files.length === 0) {
                throw new Error('You must select an image to upload.');
            }

            const file = event.target.files[0];
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            let { error : uploadError } = await supabase.storage.from('avatars').upload(filePath, file);

            if (uploadError) {
                throw uploadError;
            }

            onUpload(event, filePath);
        } catch (error : any) {
            alert(error.message);
        } finally {
            setUploading(false);
        }
    }

    function removeAvatar(event : React.MouseEvent<HTMLButtonElement>) {
        onRemoveUpload(event);
        setAvatarUrl("");
    }

    return (<>
        <Stack gap={3} alignItems="center">
            {avatarUrl ? (
                <AvatarView src={avatarUrl} avatarChanged={avatarChanged} />
            ) : (
                <Typography>No avatar uploaded.</Typography>
            )}
            <Stack direction="row" gap={3}>
                <Button variant="contained" size="large" disabled={uploading}>
                    <label htmlFor="single">
                        {uploading ? 'Uploading ...' : 'Upload avatar...'}
                    </label>
                    <input style={{ visibility: 'hidden', position: 'absolute' }}
                        type="file"
                        id="single"
                        accept="image/*"
                        onChange={uploadAvatar}
                        disabled={uploading}
                    />
                </Button>
                <Button variant="contained" size="large" onClick={removeAvatar}>
                    Remove Avatar
                </Button>
            </Stack>
        </Stack></>
    );
}