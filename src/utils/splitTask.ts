type Task = {id : number, title : string, description : string, 
    dueDate : Date, type : number, completed: boolean, 
    userId: number, expired: boolean, deadline: string,
    taskCollectionId: number};

export default function splitTask(tasks : Task[]) {

    const now : Task[] = [];
    const later : Task[] = [];
    const expired : Task[] = [];
    let tdy = new Date();

    tasks.sort((a : Task, b : Task) => {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });
    
    tasks.map((task) => {

        if (new Date(task.dueDate) > tdy && getDayDifference(new Date(task.dueDate), tdy) <= 1){
            now.push(task);
        } else if (new Date(task.dueDate) > tdy && getDayDifference(new Date(task.dueDate), tdy) > 1) {
            later.push(task);
        } else {
            expired.push(task);
        }
    });
    return [now, later, expired];
}

function getDayDifference(date1 : Date, date2 : Date) {
    const oneDay = 24 * 60 * 60 * 1000; // Number of milliseconds in a day
  
    // Convert the dates to milliseconds
    const time1 = date1.getTime();
    const time2 = date2.getTime();
  
    // Calculate the difference in days
    const diffDays = Math.round(Math.abs((time1 - time2) / oneDay));
    return diffDays;
}