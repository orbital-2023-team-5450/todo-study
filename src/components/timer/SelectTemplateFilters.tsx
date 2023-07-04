import React, { useEffect, useState } from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Stack, Typography, Button, FormControl, FormGroup, FormControlLabel, Switch, Divider } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import InputTimerField from "./InputTimerField";
import ClearIcon from '@mui/icons-material/Clear';

export function SelectTemplateFilters({ minWork, setMinWork, maxWork, setMaxWork, minTotal, setMinTotal, maxTotal, setMaxTotal } : { minWork : number, setMinWork : (arg : number) => void, maxWork : number, setMaxWork : (arg : number) => void, minTotal : number, setMinTotal : (arg : number) => void, maxTotal : number, setMaxTotal : (arg : number) => void }) {

  const [ reset1, setReset1 ] = useState<boolean>(false);
  const [ reset2, setReset2 ] = useState<boolean>(false);
  const [ reset3, setReset3 ] = useState<boolean>(false);
  const [ reset4, setReset4 ] = useState<boolean>(false);

  const [ switchState, setSwitchState ] = useState({
    work: false,
    total: false,
  });

  // if there are any validation errors in min/max (e.g. min > max).  
  const [ errorMinMax, setErrorMinMax ] = useState<number>(0);

  const handleClearFilters = () => {
    setReset1(true);
    setReset2(true);
    setReset3(true);
    setReset4(true);
  }     

  const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSwitchState({
      ...switchState,
      [event.target.name]: event.target.checked,
    });
    
    switch (event.target.name) {
      case 'work':
        setReset2(event.target.checked);
        break;
      case 'total':
        setReset4(event.target.checked);
        break;
    }
  };

  const minMaxErrorMessages = [
    "", 
    "The minimum and maximum work time per cycle is invalid.", 
    "The minimum and maximum total time in timer session is invalid.", 
    "The minimum and maximum work time per cycle and total time in timer session are invalid."
  ];   

  const getMinMaxError = ( minGiven : number, maxGiven : number ) : number => {
    if (minGiven < 0 || maxGiven < 0) return 1;
    if (minGiven >= 0 && maxGiven === 0) return 0;
    if (minGiven > maxGiven) return 1;
    return 0;
  };


  useEffect(() => {
    // indicates whether to show an error message.
    // this matches the enum values perfectly.
    const errorWork = getMinMaxError(minWork, maxWork);
    const errorTotal = getMinMaxError(minTotal, maxTotal);

    setErrorMinMax(errorTotal * 2 + errorWork);
  }, [minWork, maxWork, minTotal, maxTotal]);

  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        Filter by...
      </AccordionSummary>
      <AccordionDetails>
        <Stack gap={3} padding="0 .5em .5em .5em" component="form">
          <Stack direction="row" display="flex" justifyContent="space-between">
            <FormControl component="fieldset" variant="standard">
              <FormGroup>
                <FormControlLabel
                  control={<Switch checked={ switchState.work } onChange={ handleSwitchChange } name="work" />}
                  label="Filter based on minimum work per cycle only"
                />
                <FormControlLabel
                  control={<Switch checked={ switchState.total } onChange={ handleSwitchChange } name="total" />}
                  label="Filter based on minimum total time in timer session only"
                />
              </FormGroup>
            </FormControl>
            
            <Button variant="contained" color="error" onClick={ handleClearFilters }>
              <ClearIcon />
              Clear filters
            </Button>
          </Stack>
          <Divider />
          <InputTimerField title="Minimum work per cycle" setValue={ setMinWork } reset={ reset1 } setReset={ setReset1 } />
          <InputTimerField title="Maximum work per cycle" setValue={ setMaxWork } reset={ reset2 } setReset={ setReset2 } disabled={ switchState.work } />
          <Divider />
          <InputTimerField title="Minimum total time in timer session" setValue={ setMinTotal } reset={ reset3 } setReset={ setReset3 } />
          <InputTimerField title="Maximum total time in timer session" setValue={ setMaxTotal } reset={ reset4 } setReset={ setReset4 } disabled={ switchState.total } />
          <Typography color="red">
            { minMaxErrorMessages[errorMinMax] }
          </Typography>
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
}