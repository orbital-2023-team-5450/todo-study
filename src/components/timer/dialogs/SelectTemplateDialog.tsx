import React, { useEffect, useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Stack, Typography, TextField, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import { FullWorkRestCycle, TimerSettings, fetchTimerSettings, fetchTimerTemplates, getTotalTimeFromCycles } from "../../../utils/timerUtils";
import TimerTemplateCard from "../TimerTemplateCard";
import supabase from "../../../supabase";
import SearchIcon from '@mui/icons-material/Search';
import SearchBar from "../../SearchBar";
import { createTextEventHandler } from "../../../utils/textInputUtils";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import InputTimerField from "../InputTimerField";
import ClearIcon from '@mui/icons-material/Clear';

export default function SelectTemplateDialog( { open, handleClose, onChange } : { open : boolean, handleClose : () => void, onChange : () => void }) {
    
  const [ settings, setSettings ] = useState<TimerSettings>({ 
    user_id: "",
    use_milliseconds: false,
    low_time_warning: true,
    timer_template_id: 1, });

  const [ templates, setTemplates ] = useState<FullWorkRestCycle[]>([]);
    
  const [ searchValue, setSearchValue ] = useState("");
  const [ minWorkFilter, setMinWorkFilter ] = useState<number>(0);
  const [ maxWorkFilter, setMaxWorkFilter ] = useState<number>(0);
  const [ minTotalFilter, setMinTotalFilter ] = useState<number>(0);
  const [ maxTotalFilter, setMaxTotalFilter ] = useState<number>(0);
  const [ reset1, setReset1 ] = useState<boolean>(false);
  const [ reset2, setReset2 ] = useState<boolean>(false);
  const [ reset3, setReset3 ] = useState<boolean>(false);
  const [ reset4, setReset4 ] = useState<boolean>(false);

  // if there are any validation errors in min/max (e.g. min > max).  
  const [ errorMinMax, setErrorMinMax ] = useState<number>(0);     

  const minMaxErrorMessages = [
    "", 
    "The minimum and maximum work time per cycle is invalid.", 
    "The minimum and maximum total time in timer session is invalid.", 
    "The minimum and maximum work time per cycle and total time in timer session are invalid."
  ];   

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

  const getMinMaxError = ( minGiven : number, maxGiven : number ) : number => {
    if (minGiven < 0 || maxGiven < 0) return 1;
    if (minGiven >= 0 && maxGiven === 0) return 0;
    if (minGiven > maxGiven) return 1;
    return 0;
  };

  const handleClearFilters = () => {
    setReset1(true);
    setReset2(true);
    setReset3(true);
    setReset4(true);
  }

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

  useEffect(() => {
    // indicates whether to show an error message.
    // this matches the enum values perfectly.
    const errorWork = getMinMaxError(minWorkFilter, maxWorkFilter);
    const errorTotal = getMinMaxError(minTotalFilter, maxTotalFilter);

    setErrorMinMax(errorTotal * 2 + errorWork);
  }, [minWorkFilter, maxWorkFilter, minTotalFilter, maxTotalFilter]);
  
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
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <SearchBar value={ searchValue } onChange={ handleSearchBarChange } onSubmit={ handleSearchBarSubmit } />
          </AccordionSummary>
          <AccordionDetails>
            <Stack gap={3} padding="0 .5em .5em .5em" component="form">
              <Stack direction="row" display="flex" justifyContent="space-between">
                <Typography>
                  To only filter based on minimum time, set the maximum time to 0.
                </Typography>
                <Button variant="contained" color="error" onClick={ handleClearFilters }>
                  <ClearIcon />
                  Clear filters
                </Button>
              </Stack>
              <InputTimerField title="Work per cycle (minimum)" setValue={ setMinWorkFilter } reset={ reset1 } setReset={ setReset1 } />
              <InputTimerField title="Work per cycle (maximum)" setValue={ setMaxWorkFilter } reset={ reset2 } setReset={ setReset2 } />
              <InputTimerField title="Total time in timer session (minimum)" setValue={ setMinTotalFilter } reset={ reset3 } setReset={ setReset3 } />
              <InputTimerField title="Total time in timer session (maximum)" setValue={ setMaxTotalFilter } reset={ reset4 } setReset={ setReset4 } />
              <Typography color="red">
                { minMaxErrorMessages[errorMinMax] }
              </Typography>
            </Stack>
          </AccordionDetails>
        </Accordion>
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