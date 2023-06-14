import React, { useEffect, useState } from "react";
import { Card, Typography, Button } from "@mui/material";
import { FullWorkRestCycle, TimerSettings, fetchTimerSettings, timerToString } from "../utils/timerUtils";
import supabase from "../supabase";
import { getUsernameFromId } from "../utils/fetchUserInfo";

export default function TimerTemplateCard({ template, onChange } : { template : FullWorkRestCycle, onChange : () => void }) {

    const [ settings, setSettings ] = useState<TimerSettings>({ 
        user_id: "",
        use_milliseconds: false,
        low_time_warning: true,
        timer_template_id: 1, });

    const [ name, setName ] = useState("");

    async function select(id : number) {
        const submitInfo : TimerSettings = { ...settings, timer_template_id: id };

        const submitChange = async () => {
            const { error } = await supabase.from('users_timer_config').update(submitInfo).eq('user_id', settings.user_id);
            if (error !== null) {
                alert("Error updating timer settings: " + JSON.stringify(error));
            }
        };

        submitChange();
        onChange();
        fetchTimerSettings(setSettings);
    }

    useEffect(() => {
        fetchTimerSettings(setSettings);
        getUsernameFromId(template.user_id, setName);
    }, [fetchTimerSettings, template]); 

    return (
        <Card sx={{"padding": 2}}>
            <Typography variant="h6" component="h1">{template.title}</Typography>
            <Typography variant="body1" component="p">
                {template.description}
            </Typography>
            <Typography variant="caption" component="p">by {name}</Typography>
            <Typography variant="caption" component="p">ID: {template.timer_template_id} | Work: { timerToString(template.work, false, false) } | Rest: { timerToString(template.rest, false, false) } | Cycles: {template.cycles}</Typography>
            { (settings.timer_template_id !== template.timer_template_id) ?
                <Button onClick={() => select(template.timer_template_id)}>Select</Button> :
                <Button disabled>Selected</Button> }
        </Card>
    );
}