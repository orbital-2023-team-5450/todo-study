/**
 * A type that encapsulates a Task object, as represented in the 'tasks' table.
 */
export type Task = {id : number, title : string, description : string, dueDate : Date, 
    type : number, completed: boolean, userId: string, expired: boolean, taskCollectionId: number};
