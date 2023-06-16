import React, { useEffect, useState } from "react";
import { Card, Typography, Button, Grid, Box } from "@mui/material";
import { FullWorkRestCycle, TimerSettings, fetchTimerSettings, timerToString } from "../../utils/timerUtils";
import supabase from "../../supabase";
import { getUsernameFromId } from "../../utils/fetchUserInfo";
import LoadingScreen from "../loadingscreen";

export default function TimerTemplateCard({ template, onChange } : { template : FullWorkRestCycle, onChange : () => void }) {

    const [ settings, setSettings ] = useState<TimerSettings>({ 
        user_id: "",
        use_milliseconds: false,
        low_time_warning: true,
        timer_template_id: 1, });

    const [ name, setName ] = useState("");

    const [ loading, setLoading ] = useState(true);

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
        setLoading(false);
    }, [fetchTimerSettings, settings, template]); 

    return !loading ? (
        <Card sx={{"padding": 2}}>
            <Box component="div" display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h6" component="h1">{template.title}</Typography>
                { (settings.timer_template_id !== template.timer_template_id) ?
                    <Button onClick={() => select(template.timer_template_id)}>Select</Button> :
                    <Button disabled>Selected</Button> }
            </Box>
            <Typography variant="body1" component="p">
                {template.description}
            </Typography>
            <Typography variant="caption" component="p">{name === "brein62" ? "Default" : `by ${name}`} | Work: { timerToString(template.work, false, false) } &sdot; Rest: { timerToString(template.rest, false, false) } &sdot; Cycles: {template.cycles}</Typography>
        </Card> ) : <LoadingScreen />;
}