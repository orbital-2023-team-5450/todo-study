import React from 'react';
import { Button, Dialog, DialogContent, DialogTitle, Stack, TextField, Typography, } from '@mui/material';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { DateTimePicker, DateTimeValidationError, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { PickerChangeHandlerContext } from '@mui/x-date-pickers/internals/hooks/usePicker/usePickerValue.types';
import ClearIcon from '@mui/icons-material/Clear';
import { getDayDifference } from "../../utils/splitTask";

export default function FilterDialog({ filterOpen, filterClose, searchDateFrom, searchDateTill, setSearchDateFrom, setSearchDateTill } : 
                                     { filterOpen : boolean, filterClose : (arg : boolean) => void, 
                                        setSearchDateFrom : (arg : string) => void, setSearchDateTill: (arg : string) => void,
                                        searchDateFrom : string, searchDateTill : string}) {

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
        if (!checkDateDifference(new Date(searchDateFrom), new Date(searchDateTill))) {
            alert("The start date should not be later than the end date!")
        } else {
            filterClose(true);
        }
    }

    const handleClearFilter = (event : React.MouseEvent<HTMLElement>) => {

        event.preventDefault();
        setSearchDateFrom("");
        setSearchDateTill("");
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
                    
                    <Stack direction='row'>
                        <Typography sx={{marginBottom: '5px', flexGrow: '0.5'}}>
                            From
                        </Typography>
                        <Typography sx={{marginBottom: '5px'}}>
                            To
                        </Typography>
                    </Stack>
                    
                    <Stack direction='row'>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DemoContainer components={['DesktopDatePicker']} sx={{display: 'flex', flexGrow: '0.5'}}> 
                                    <DemoItem>
                                        <DateTimePicker 
                                            defaultValue={dayjs((new Date()))} 
                                            value={dayjs(searchDateFrom)} 
                                            onChange={handleDateFrom}
                                            minDateTime={dayjs(new Date())}
                                            format="DD/MM/YYYY"
                                        />
                                    </DemoItem>
                                </DemoContainer>
                        </LocalizationProvider>

                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DemoContainer components={['DesktopDatePicker']} sx={{display: 'flex'}}> 
                                    <DemoItem>
                                        <DateTimePicker 
                                            defaultValue={dayjs((new Date()))} 
                                            value={dayjs(searchDateTill)} 
                                            onChange={handleDateTill}
                                            minDateTime={dayjs(new Date())}
                                            format="DD/MM/YYYY"
                                        />
                                    </DemoItem>
                                </DemoContainer>
                        </LocalizationProvider>
                    </Stack>

                    {!checkDateDifference(new Date(searchDateFrom), new Date(searchDateTill)) && 
                        <Typography> The start date should not be later than the end date! </Typography>}

                    <Button onClick={handleFilterOk} sx={{position: 'relative'}}> ok </Button>
                </Stack>
            </DialogContent>
        </Dialog>
    );
}