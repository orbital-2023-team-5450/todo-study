import React, { useState } from 'react';
import { Box, Button, Dialog, DialogContent, DialogTitle, FormControl, FormControlLabel, FormGroup, 
            InputLabel, MenuItem, Select, SelectChangeEvent, Stack, Switch, TextField, Typography, } from '@mui/material';
import { DateTimePicker, DateTimeValidationError, LocalizationProvider } from '@mui/x-date-pickers';
import dayjs, { Dayjs } from 'dayjs';
import { PickerChangeHandlerContext } from '@mui/x-date-pickers/internals/hooks/usePicker/usePickerValue.types';
import ClearIcon from '@mui/icons-material/Clear';
import { getDayDifference } from "../../../utils/splitTask";
import SortTaskFilter from '../SortTaskFilter';
import DueDateSelect from '../DueDateSelect';

export default function FilterDialog({ filterOpen, filterClose, searchDateFrom, searchDateTill, setSearchDateFrom, 
                                       setSearchDateTill, searchType, setSearchType, switchDueDate, setSwitchDueDate,
                                       switchIncludeTask, setSwitchIncludeTask } : 
                                     { filterOpen : boolean, filterClose : (arg : boolean) => void, 
                                        setSearchDateFrom : (arg : string) => void, setSearchDateTill: (arg : string) => void,
                                        searchDateFrom : string, searchDateTill : string, searchType: string, 
                                        setSearchType: (arg : string) => void, switchDueDate : boolean, 
                                        setSwitchDueDate : (arg : boolean) => void, switchIncludeTask : boolean, 
                                        setSwitchIncludeTask : (arg : boolean) => void}) {
    
    const handleDateFrom = (value: Dayjs | null, content: PickerChangeHandlerContext<DateTimeValidationError>) => {  

        if (value === null || content.validationError !== null) {
        } else {
            setSearchDateFrom(value.toISOString());
        }
    }

    const handleDateTill = (value: Dayjs | null, content: PickerChangeHandlerContext<DateTimeValidationError>) => {  

        if (value === null || content.validationError !== null) {
        } else {
            setSearchDateTill(value.toISOString());
        }
    }

    const checkDateDifference = (date1 : Date, date2 : Date) : boolean => {

        const difference = getDayDifference(date1, date2);
        if (difference > 0) {
            return false;
        } else {
            return true;
        }
    }

    const handleFilterOk = (event : React.MouseEvent<HTMLElement>) => {

        event.preventDefault();
        if (switchDueDate && !checkDateDifference(new Date(searchDateFrom), new Date(searchDateTill))) {
            alert("The start date should not be later than the end date!")
        } else {
            filterClose(true);
        }
    }

    const handleClearFilter = (event : React.MouseEvent<HTMLElement>) => {

        event.preventDefault();
        setSearchDateFrom("");
        setSearchDateTill("");
        setSearchType("none");
        setSwitchDueDate(true);
        setSwitchIncludeTask(true);
    }

    const handleChangeSelect = (event: SelectChangeEvent) => {
        setSearchType(event.target.value);
    }

    const handleSwitch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSwitchDueDate(event.target.checked);
    }

    const handleSwitch2 = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSwitchIncludeTask(event.target.checked);
    }
    
    return (
        <Dialog open={filterOpen} onClose={filterClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                <Stack direction='row'>
                    <Typography variant='h4' flexGrow= '0.9'> Filter by... </Typography>
                    <Button variant="contained" color="error" onClick={handleClearFilter}>
                        <Stack direction="row" spacing={1}>
                            <ClearIcon />
                            <Typography variant="button">Clear filters</Typography>
                        </Stack>
                    </Button>
                </Stack>
            </DialogTitle>
            <DialogContent>
                <Stack direction="column">

                    <Typography sx={{marginBottom: '1vh'}} variant='h6'>
                        Due Date of the task 
                    </Typography>
                    
                    <FormControl component="fieldset" variant="standard">
                        <FormGroup>
                            <FormControlLabel
                                control={<Switch checked={ switchDueDate } onChange={ handleSwitch } />}
                                label="With due date"
                            />
                        </FormGroup>

                        <FormGroup>
                            <FormControlLabel
                                control={<Switch checked={ switchIncludeTask } onChange={ handleSwitch2 } />}
                                label="With expired and completed tasks"
                            />
                        </FormGroup>
                    </FormControl>
                    
                    {switchDueDate 
                        ? <>
                            <Stack direction='row'>
                                <Typography sx={{marginBottom: '5px', flexGrow: '0.5'}}>
                                    From
                                </Typography>
                                <Typography sx={{marginBottom: '5px'}}>
                                    To
                                </Typography>
                            </Stack>

                            <Stack direction='row' sx={{marginBottom: '5vh'}}>
                                <DueDateSelect
                                    searchDate={searchDateFrom}
                                    handleDate={handleDateFrom}
                                />

                                <DueDateSelect
                                    searchDate={searchDateTill}
                                    handleDate={handleDateTill}
                                />
                            </Stack> 
                            </>
                        : <></>}

                    {!checkDateDifference(new Date(searchDateFrom), new Date(searchDateTill)) && 
                        <Typography> The start date should not be later than the end date! </Typography>}

                    <Typography sx={{marginBottom: '1vh'}} variant='h6'>
                        Label of the task... 
                    </Typography>

                    <SortTaskFilter searchType={searchType} handleChangeSelect={handleChangeSelect} />

                    <Button onClick={handleFilterOk} sx={{justifyContent: 'right', marginTop: '1vh'}}> ok </Button>
                </Stack>
            </DialogContent>
        </Dialog>
    );
}