/**
 * A type that encapsulates a Task object, as represented in the 'tasks' table.
 */
export type Task = {id : number, title : string, description : string, dueDate : string, 
    type : string, completed: boolean, userId: number, expired: boolean, taskCollectionId: number};