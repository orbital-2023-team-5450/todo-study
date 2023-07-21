import { Task, isExpired } from './taskUtils';

export function processTaskList(taskList : Task[], sort: string) {

    switch (sort) {

      case 'dsee':
        return taskList.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

      case 'type': //watch out 
        return taskList
          .filter((task) => task.dueDate !== null)
          .filter((task) => isExpired(task))
          .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
          
      case 'abc': 
        return taskList.sort((a, b) => a.title.localeCompare(b.title));

      case 'zyx':
        return taskList.sort((a, b) => b.title.localeCompare(a.title));

      default:
        return taskList;
    }
  }

export function sortTask(tasks : Task[], sort : string) {

    processTaskList(tasks, sort);
    return splitTask(tasks, sort === 'dsee');
}

/**
 * A function that sorts the tasks based on the due date and assign to 4 lists according to their status.
 * 
 * @param tasks A list of tasks. 
 * @returns A tuple of 4 task lists. 
 */
export function splitTask(tasks : Task[], append : boolean) {

    const now : Task[] = [];
    const later : Task[] = [];
    const none : Task[] = []
    const expired : Task[] = [];
    const completed : Task[] = [];
    let tdy = new Date();
    
    tasks.map((task) => {
        if (task.completed) {
          completed.push(task); 
        } else if (task.dueDate === null) {
          
          if (append) {
            none.push(task);              
          } else {
            later.push(task);
          }
        } else if (new Date(task.dueDate) > tdy && getDayDifference(new Date(task.dueDate), tdy) <= 1){
          now.push(task);
        } else if (new Date(task.dueDate) > tdy && getDayDifference(new Date(task.dueDate), tdy) > 1) {
          later.push(task);
        } else {
          task.expired = true;
          expired.push(task);
        } 
    });
    return [now, append ? later.concat(none) : later, expired, completed];
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