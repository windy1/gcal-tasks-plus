import { TaskList } from "@/data";

export default class {
    private readonly taskList: TaskList;

    constructor(taskList: TaskList) {
        this.taskList = taskList;
    }

    get() {
        return localStorage.getItem(this.getStorageKey());
    }

    save(orderedIds: string[]) {
        localStorage.setItem(this.getStorageKey(), JSON.stringify(orderedIds));
    }

    private getStorageKey() {
        return `task-order-${this.taskList.id}`;
    }
}
