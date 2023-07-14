import React, { useEffect, useState } from "react";
import { Card, Typography, Button, Box, CircularProgress } from "@mui/material";
import { FullWorkRestCycle, TimerSettings } from "../../utils/timerUtils";
import { getUsernameFromId } from "../../utils/fetchUserInfo";
import TemplateTextDisplay from "./TemplateTextDisplay";

export default function TimerTemplateCard({ settings, template, onSelect, onDelete } : { settings : TimerSettings, template : FullWorkRestCycle, onSelect : () => void, onDelete : () => void }) {

    const [ name, setName ] = useState("");
    const [ loading, setLoading ] = useState(true);

    useEffect(() => {
        getUsernameFromId(template.user_id, setName).then(() => setLoading(false));
    }, [loading])

    return !loading ? (
        <Card sx={{"padding": 2}}>
            <Box component="div" display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h6" component="h1">{template.title}</Typography>
                <Box>
                    {
                        (settings.user_id === template.user_id && settings.timer_template_id !== template.timer_template_id) ?
                        <Button onClick={onDelete}>Delete</Button> :
                        <></>
                    }
                    { (settings.timer_template_id !== template.timer_template_id) ?
                        <Button onClick={onSelect}>Select</Button> :
                        <Button disabled>Selected</Button> }
                </Box>
            </Box>
            <Typography variant="body1" component="p">
                {template.description}
            </Typography>
            <Typography variant="caption" component="p">{name === "brein62" ? "Default" : `by ${name}`} | <TemplateTextDisplay template={template} /></Typography>
        </Card>
    ) : (
        <Card sx={{"padding" : 5}}>
            <Box component="div" display="flex" justifyContent="center">
                <CircularProgress size={40} />
            </Box>
        </Card>
    );
}