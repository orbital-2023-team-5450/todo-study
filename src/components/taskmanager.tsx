import { Stack, Typography } from "@mui/material";
import React, { useState } from "react";
import EmptyState from "./emptystate";
import TaskList from "./tasklist";

export default function TaskManager({ taskType } : { taskType : String}) {

    const [tasks, setTasks] = useState(["todo-list"]);

    return (
        <Stack direction="column">
            <Typography variant="h4" component="h3" marginTop={5}> {taskType} </Typography>
            {tasks.length === 0 ? <EmptyState /> : <TaskList tasks={tasks} /> }
        </Stack>
        
    );
}