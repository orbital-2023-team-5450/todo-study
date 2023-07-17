import React from 'react';
import { Task } from '../../../utils/taskUtils';
import { Stack, Box, Typography, IconButton, Tooltip } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { format } from 'date-fns';

/**
 * Displays an individual task.
 * @param {Object<Task>} props The props that can be passed in. There is only one prop,
 *                             task.
 * @param {Task} task Represents the individual Task to be displayed.
 * @returns A React component representing each task entry as displayed in the task app.
 */
export default function DashboardTaskEntry( { task } : { task : Task } ) {

    return (
        <Box width="100%" component="div" display="flex" justifyContent="space-between" alignItems="center">
          <Stack width="80%" justifyContent="center">
            <Typography sx={{textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }} fontWeight="bold" component="h1">
              { task.title }
            </Typography>
            <Typography sx={{textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }} component="h2">
              { task.description }
            </Typography>
            <Typography sx={{textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }} component="h2">
              { task.dueDate !== null ? format(new Date(task.dueDate), 'eee, dd MMM yyyy, hh:mm a') : 'No due date' }
            </Typography>
          </Stack>
        </Box>
    );
}