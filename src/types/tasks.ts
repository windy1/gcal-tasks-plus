export type TaskTitle = string;

export type TaskId = string;

export enum SaveState {
    NotReady = "not-ready",
    Unloaded = "unloaded",
    Saved = "saved",
    NotSaved = "not-saved",
}
