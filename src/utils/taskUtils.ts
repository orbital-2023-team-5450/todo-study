import supabase from "../supabase";

/**
 * A type that encapsulates a Task object, as represented in the 'tasks' table.
 */
export type Task = {id : number, title : string, description : string, dueDate : Date, 
    type : string, completed: boolean, userId: string, expired: boolean, taskCollectionId: number};

/**
 * Checks whether a task is expired.
 * @param task The task to check the expiration status of.
 * @returns True if task is expired (relative to current time); false otherwise.
 */
export const isExpired = (task : Task) => { 
    return task.dueDate !== null && new Date(task.dueDate).getTime() < Date.now(); 
};

/* 
    Handle the change of status of completed of the task in the database.
*/
export function handleTaskChange(id : number, taskList : Task[], fetchTasks : () => void) {
      
    const task = taskList.find((task : Task) => task.id === id);
    if (task === undefined) {
        alert("There is no such task. It might not exist or it is deleted");
    } else {
        supabase.from("tasks").update({ completed: !task.completed }).eq("id", id)
            .then((result) => {
              if (result.error !== null) {
                alert("Failed to update task!");
              } else {
                fetchTasks();
              }
        });
    }  
};

 /* 
    Handle the deletion of the task in the database.
*/
export function handleTaskDelete(id : number, fetchTasks : () => void) {

    console.log("Deleted")
    supabase.from("tasks").delete().eq("id", id)
        .then((result) => {
            if (result.error) {
                alert("Failed to delete task!");
            } else {
                fetchTasks();
              }
        });
}; 

