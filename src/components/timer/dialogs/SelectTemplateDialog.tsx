import React, { useEffect, useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Stack, Typography, TextField } from "@mui/material";
import { FullWorkRestCycle, TimerSettings, fetchTimerSettings, fetchTimerTemplates } from "../../../utils/timerUtils";
import TimerTemplateCard from "../TimerTemplateCard";
import supabase from "../../../supabase";
import SearchIcon from '@mui/icons-material/Search';
import SearchBar from "../../SearchBar";
import { createTextEventHandler } from "../../../utils/textInputUtils";

export default function SelectTemplateDialog( { open, handleClose, onChange } : { open : boolean, handleClose : () => void, onChange : () => void }) {
    
  const [ settings, setSettings ] = useState<TimerSettings>({ 
    user_id: "",
    use_milliseconds: false,
    low_time_warning: true,
    timer_template_id: 1, });

  const [ templates, setTemplates ] = useState<FullWorkRestCycle[]>([]);
    
  const [ searchValue, setSearchValue ] = useState("");

  // check whether the timer has been updated (deleted/created)
  const [ updated, setUpdated ] = useState(true);
  
  useEffect(() => {
    fetchTimerSettings(setSettings)
      .then(() => setUpdated(false));
  }, [updated]); 

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

    setUpdated(true);
    deleteChange();
  }

  const handleSearchBarChange = createTextEventHandler(setSearchValue);

  const timerFilterPredicate = (template : FullWorkRestCycle) => {
    return (template.title.toLowerCase().startsWith(searchValue.toLowerCase()) ||
      template.description.toLowerCase().startsWith(searchValue.toLowerCase()) ||
      (searchValue.toLowerCase() === "default" && template.user_id === "649a8192-d12c-4459-943d-dbbd9f1bb4fa"));
  }

  useEffect(() => {
    fetchTimerTemplates(setTemplates);
  }, [open, updated]);
  
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="select-template-dialog-title"
      aria-describedby="select-template-dialog-description"
      maxWidth="md"
      fullWidth
    >
      <DialogTitle id="select-template-dialog-title">
        Select a timer template
        <Typography component="p" marginBottom="0.5em">Note that it will take a short while for the timer to update once the timer template is selected.</Typography>
        <SearchBar value={ searchValue } onChange={ handleSearchBarChange } />
      </DialogTitle>
      <DialogContent>
        <Stack gap={3}>
          {
            templates.filter(timerFilterPredicate)
              .map((template) => <TimerTemplateCard settings={settings} template={template} onSelect={() => select(template.timer_template_id)} onDelete={() => deleteTemplate(template.timer_template_id)} />)
          }
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} autoFocus>OK</Button>
      </DialogActions>
    </Dialog>
  );
}