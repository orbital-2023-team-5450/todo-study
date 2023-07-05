import React, { useEffect, useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Stack, Typography, TextField, Accordion, AccordionSummary, AccordionDetails, IconButton } from "@mui/material";
import { FullWorkRestCycle, TimerSettings, fetchTimerSettings, fetchTimerTemplates, getTotalTimeFromCycles } from "../../../utils/timerUtils";
import TimerTemplateCard from "../TimerTemplateCard";
import supabase from "../../../supabase";
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import SearchBar from "../../SearchBar";
import { createTextEventHandler } from "../../../utils/textInputUtils";
import SelectTemplateFilterDialog from "./SelectTemplateFilterDialog";


export default function SelectTemplateDialog( { open, handleClose, onChange } : { open : boolean, handleClose : () => void, onChange : () => void }) {
    
  const [ settings, setSettings ] = useState<TimerSettings>({ 
    user_id: "",
    use_milliseconds: false,
    low_time_warning: true,
    timer_template_id: 1, });

  const [ templates, setTemplates ] = useState<FullWorkRestCycle[]>([]);
    
  const [ searchValue, setSearchValue ] = useState("");

  const [ filterDialogOpen, setFilterDialogOpen ] = useState<boolean>(false);

  const [ minWorkFilter, setMinWorkFilter ] = useState<number>(0);
  const [ maxWorkFilter, setMaxWorkFilter ] = useState<number>(0);
  const [ minTotalFilter, setMinTotalFilter ] = useState<number>(0);
  const [ maxTotalFilter, setMaxTotalFilter ] = useState<number>(0);

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
  const handleSearchBarSubmit = ( event : React.FormEvent<HTMLFormElement> ) => {
    event.preventDefault();
  }

  const getProperMinMax = ( minGiven : number, maxGiven : number ) : number[] => {
    if (minGiven < 0 || maxGiven < 0) return [0, Infinity];
    if (minGiven >= 0 && maxGiven === 0) return [minGiven, Infinity];
    if (minGiven > maxGiven) return [0, Infinity];
    return [minGiven, maxGiven];
  };
  const timerFilterPredicate = (template : FullWorkRestCycle) => {
    
    // set minimum/maximum work and total based on user input.
    // some user input are invalid and has to be handled here.
    const [ minWork, maxWork ] = getProperMinMax(minWorkFilter, maxWorkFilter);
    const [ minTotal, maxTotal ] = getProperMinMax(minTotalFilter, maxTotalFilter);

    return (template.title.toLowerCase().includes(searchValue.toLowerCase()) ||
      template.description.toLowerCase().includes(searchValue.toLowerCase()) ||
      (searchValue.toLowerCase() === "default" && template.user_id === "649a8192-d12c-4459-943d-dbbd9f1bb4fa")) &&
      ( template.work >= minWork && template.work <= maxWork ) &&
      ( getTotalTimeFromCycles(template) >= minTotal && getTotalTimeFromCycles(template) <= maxTotal );
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
        <Stack direction="row" display="flex" spacing={3}>
          <SearchBar value={ searchValue } onChange={ handleSearchBarChange } onSubmit={ handleSearchBarSubmit } />
          <IconButton onClick={() => setFilterDialogOpen(true)}>
            <FilterAltIcon />
          </IconButton>
        </Stack>
        <SelectTemplateFilterDialog 
          minWork={minWorkFilter} setMinWork={setMinWorkFilter}
          maxWork={maxWorkFilter} setMaxWork={setMaxWorkFilter}
          minTotal={minTotalFilter} setMinTotal={setMinTotalFilter}
          maxTotal={maxTotalFilter} setMaxTotal={setMaxTotalFilter}
          open={filterDialogOpen} onClose={() => setFilterDialogOpen(false)} />
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