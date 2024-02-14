import Task from "./task.js";
import fs from "fs";

export default class Tasks {
    /** 
     * @type {Task[]} 
    */
    static #tasks = this.#getTasksFromFile('./data.json');

    static getTasks() {
        if (this.#tasks.length == 0)
            throw new Error("U don't have any tasks yet");

        const header = this.#getHeader();

        return { tasks: this.#tasks, header};
    }

    static saveTasks() {
        if (this.#tasks.length == 0)
            return;

        const pathSaveFile = "./data.json";
        
        if (!fs.existsSync(pathSaveFile))
            fs.writeFileSync(pathSaveFile, "");
        
        const data = `[${this.#tasks.map(el => el.toJson()).toString()}]`;

        fs.writeFileSync(pathSaveFile, data);
    }

    static removeTask(idTask) {
        this.#tasks.splice(idTask, 1);
    }

    static addTask(task) {
        this.#tasks.push(task);
    }

    static #getTasksFromFile(path) {        
        if (!fs.existsSync(path)) {
            fs.writeFileSync(path, "");

            return [];
        }

        const data = fs.readFileSync(path, { encoding: 'utf8', flag: 'r' });
        
        if (data == "")
            return [];
        
        const result = [];
        const objectsTasks = JSON.parse(data);

        for (let i = 0; i < objectsTasks.length; i++) {
            const parsedTask = Task.fromJson(objectsTasks[i]);
            
            result.push(parsedTask);
        }

        return result;
    }

    static #getHeader() {
        let [maxLengthName, maxLengthDescription, maxLengthDate] = [0, 0, 0];

        for (let i = 0; i < this.#tasks.length; i++) {
            const task = this.#tasks[i];

            const [taskNameLength, taskDescriptionLength, taskDateLength] = [task.name.toString().length, task.description.toString().length, task.getEndTime().toString().length];
            
            if (taskNameLength > maxLengthName)
                maxLengthName = taskNameLength;
            
            if (taskDescriptionLength > maxLengthDescription)
                maxLengthDescription = taskDescriptionLength;
            
            if (taskDateLength > maxLengthDate)
                maxLengthDate = taskDateLength;
        }

        let header = "";

        maxLengthName += 4;
        maxLengthDescription += 10;
        maxLengthDate += 4;

        header += "ID".padEnd(6, " ");
        header += "| Name".padEnd(maxLengthName, " ");
        header += "│ Description".padEnd(maxLengthDescription, " ")
        header += "│ Date Expires".padEnd(maxLengthDate, " ");
        header += "│ Completed";

        return { context: header, maxLengthName, maxLengthDescription, maxLengthDate };
    }
}