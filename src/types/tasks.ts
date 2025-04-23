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
    NotReady = "not-ready",
    Unloaded = "unloaded",
    Saved = "saved",
    NotSaved = "not-saved",
}
