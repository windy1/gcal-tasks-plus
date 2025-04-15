export default {
    TaskLists: () => "/",
    Tasks: (taskListId: string | null = null) =>
        `/tasks/${taskListId ? taskListId : ":taskListId"}`,
};
