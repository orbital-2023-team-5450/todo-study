import React, { useEffect, useState } from "react";
import { Card, Typography, Button, Box, CircularProgress } from "@mui/material";
import { FullWorkRestCycle, TimerSettings, fetchTimerSettings } from "../../utils/timerUtils";
import supabase from "../../supabase";
import { getUsernameFromId } from "../../utils/fetchUserInfo";
import TemplateTextDisplay from "./TemplateTextDisplay";

export default function TimerTemplateCard({ template, onChange, onDelete } : { template : FullWorkRestCycle, onChange : () => void, onDelete : () => void }) {

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

    async function deleteTemplate(id : number) {
        const deleteChange = async () => {
            const { error } = await supabase.from('timer_templates').delete().eq('timer_template_id', id);
            if (error !== null) {
                alert("Error deleting timer template: " + JSON.stringify(error));
            }
        }

        deleteChange();
        onDelete();
    }

    useEffect(() => {
        fetchTimerSettings(setSettings)
            .then(() => getUsernameFromId(template.user_id, setName))
            .then(() => setLoading(false))
    }, [settings, template]); 

    return !loading ? (
        <Card sx={{"padding": 2}}>
            <Box component="div" display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h6" component="h1">{template.title}</Typography>
                <Box>
                    {
                        (settings.user_id === template.user_id && settings.timer_template_id !== template.timer_template_id) ?
                        <Button onClick={() => deleteTemplate(template.timer_template_id)}>Delete</Button> :
                        <></>
                    }
                    { (settings.timer_template_id !== template.timer_template_id) ?
                        <Button onClick={() => select(template.timer_template_id)}>Select</Button> :
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