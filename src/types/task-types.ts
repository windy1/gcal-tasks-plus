/**
 * Represents the title of a Task object.
 */
export type TaskTitle = string;

/**
 * Represents the description of a Task object.
 */
export type TaskId = string;

/**
 * Represents the save-state of the Task order in local storage.
 */
export enum SaveState {
    /**
     * The tasks are not yet available to re-order.
     */
    NotReady = "not-ready",
    /**
     * The tasks have been fetched, but they have not been re-ordered by the order in local storage.
     */
    Unloaded = "unloaded",
    /**
     * The tasks are up-to-date and have had their order saved in local storage.
     */
    Saved = "saved",
    /**
     * The tasks have been re-ordered, but the new order has not yet been saved in local storage.
     */
    NotSaved = "not-saved",
}
