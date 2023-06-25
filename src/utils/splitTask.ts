import { Task } from './taskUtils';

/**
 * TODO (max): fill up
 * @param tasks 
 * @returns 
 */
export default function splitTask(tasks : Task[]) {

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

function getDayDifference(date1 : Date, date2 : Date) {
    const oneDay = 24 * 60 * 60 * 1000; // Number of milliseconds in a day
  
    // Convert the dates to milliseconds
    const time1 = date1.getTime();
    const time2 = date2.getTime();
  
    // Calculate the difference in days
    const diffDays = Math.abs((time1 - time2) / oneDay);
    return diffDays;
}