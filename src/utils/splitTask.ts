import { Task, isExpired } from './taskUtils';

export function processTaskList(taskList : Task[], sort: string) {

    switch (sort) {

      case 'dsee':
        return taskList
          .filter((task) => task.dueDate !== null)
          .filter((task) => !isExpired(task))
          .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())

      case 'dsie':
        return taskList
          .filter((task) => task.dueDate !== null)
          .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())

      case 'exp':
        return taskList
          .filter((task) => task.dueDate !== null)
          .filter((task) => isExpired(task))
          .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())

      case 'ndd':
        return taskList
          .filter((task) => task.dueDate === null)
          
      case 'abc':
        // need to filter off untitled tasks so that tasks with an actual title shows up  
        return taskList.filter((task) => task.title !== "").sort((a, b) => a.title.localeCompare(b.title));

      case 'zyx':
        return taskList.sort((a, b) => b.title.localeCompare(a.title));

      default:
        return taskList;
    }
  }

export function sortTask(tasks : Task[], sort : string) {

    processTaskList(tasks, sort);
    return splitTask(tasks);
}

/**
 * A function that sorts the tasks based on the due date and assign to 3 lists according to their status.
 * 
 * @param tasks A list of tasks. 
 * @returns A tuple of 3 task lists. 
 */
export function splitTask(tasks : Task[]) {

    const now : Task[] = [];
    const nowComplete : Task[] = [];
    const later : Task[] = [];
    const laterComplete : Task[] = [];
    const noDue : Task[] = [];
    const expired : Task[] = [];
    let tdy = new Date();

    tasks.sort((a : Task, b : Task) => {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });
    
    tasks.map((task) => {

        if (new Date(task.dueDate) > tdy && getDayDifference(new Date(task.dueDate), tdy) <= 1){

            if (task.completed) {
                nowComplete.push(task);
            } else {
                now.push(task);
            }
        } else if (new Date(task.dueDate) > tdy && getDayDifference(new Date(task.dueDate), tdy) > 1) {
            
            if (task.completed) {
                laterComplete.push(task);
            } else {
                later.push(task);
            }
        } else if (task.dueDate === null) {
            noDue.push(task);
        } else {

            task.expired = true;
            expired.push(task);
        }
    });
    return [now.concat(nowComplete), later.concat(laterComplete).concat(noDue), expired];
}

/*
    Get the difference of 2 dates as day.
*/ 
export function getDayDifference(date1 : Date, date2 : Date) {
    const oneDay = 24 * 60 * 60 * 1000; // Number of milliseconds in a day
  
    // Convert the dates to milliseconds
    const time1 = date1.getTime();
    const time2 = date2.getTime();
  
    // Calculate the difference in days
    const diffDays = (time1 - time2) / oneDay;
    return diffDays;
}