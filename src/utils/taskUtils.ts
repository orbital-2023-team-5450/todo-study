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

