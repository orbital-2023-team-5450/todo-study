import { Card, ListItemButton, Stack, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { DashboardTaskSettings } from './tasks/DashboardTaskSettingDialog';
import { Task, isExpired } from '../../utils/taskUtils';
import DashboardTaskEntry from './tasks/DashboardTaskEntry';
import supabase from '../../supabase';
import splitTask from '../../utils/splitTask';

export default function TasksPanel({ settings } : { settings : DashboardTaskSettings }) {

  const [ taskList, setTaskList ] = useState<Task[]>([]);

  const fetchTasks = async () => {

    const { data: { user } } = await supabase.auth.getUser();
    const user_id : string = (user === null) ? "" : user.id;

    supabase
      .from("tasks")
      .select()
      .eq("userId", user_id)
      .order("id")
      .then((result) => {
        if (result.data === null || result.data === undefined) {

        } else {
          setTaskList(result.data as Task[]);
        }  
      }
    );
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const processTaskList = () => {
    const { taskCount, sort } = settings;
    switch (sort) {
      case 'dsee':
        return taskList
          .filter((task) => task.dueDate !== null)
          .filter((task) => !isExpired(task))
          .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
          .slice(0, taskCount);
      case 'dsie':
        return taskList
          .filter((task) => task.dueDate !== null)
          .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
          .slice(0, taskCount);
      case 'exp':
        return taskList
          .filter((task) => task.dueDate !== null)
          .filter((task) => isExpired(task))
          .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
          .slice(0, taskCount);
      case 'ndd':
        return taskList
          .filter((task) => task.dueDate === null)
          .slice(0, taskCount);
      case 'abc':
        // need to filter off untitled tasks so that tasks with an actual title shows up  
        return taskList.filter((task) => task.title !== "").sort((a, b) => a.title.localeCompare(b.title)).slice(0, taskCount);
      case 'zyx':
        return taskList.sort((a, b) => b.title.localeCompare(a.title)).slice(0, taskCount);
      default:
        return taskList.slice(0, taskCount);
    }
  }

  const sortStr : Map<string, string> = new Map([
    [ "dsee", "Non-expired tasks (sorted by due date)" ],
    [ "dsie", "All tasks (sorted by due date)"],
    [ "exp", "Expired tasks (sorted by due date)" ],
    [ "ndd", "Tasks with no due date" ],
    [ "abc", "Tasks in alphabetical order" ],
    [ "zyx", "Tasks in reverse alphabetical order" ],
  ])

  return (    
    <Stack gap={3}>
      <Typography fontSize="1.1em" component="h2" textAlign="center">
        { sortStr.get(settings.sort) }
      </Typography>
      {
        (processTaskList().length !== 0) ? processTaskList().map(
          (task : Task) => {
            return (
              <Card key={task.id}>
                <ListItemButton href="/tasks">
                  <DashboardTaskEntry task={task} />
                </ListItemButton>
              </Card> 
            );
          }
        ) : (
          <Typography width="100%" textAlign="center">No task found.</Typography>
        )
      }
    </Stack>
  )
}