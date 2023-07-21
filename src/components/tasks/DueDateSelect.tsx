import { Typography, Stack } from "@mui/material";
import { LocalizationProvider, DateTimePicker, DateTimeValidationError } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { PickerChangeHandlerContext } from "@mui/x-date-pickers/internals/hooks/usePicker/usePickerValue.types";
import dayjs, { Dayjs } from "dayjs";
import React from "react";

export default function DueDateSelect({ searchDate, handleDate} :
                                      { searchDate : string | null, 
                                        handleDate : (value: Dayjs | null, 
                                                      content: PickerChangeHandlerContext<DateTimeValidationError>) => void,
                                      }) {

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={['DesktopDatePicker']} sx={{display: 'flex', flexGrow: '0.5'}}> 
                <DemoItem>
                    <DateTimePicker 
                        defaultValue={dayjs((new Date()))} 
                        value={dayjs(searchDate)} 
                        onChange={handleDate}
                        minDateTime={dayjs(new Date())}
                        format="DD/MM/YYYY hh:mm A"
                    />
                </DemoItem>
            </DemoContainer>
        </LocalizationProvider>
    );
}