import Tasks from "./tasks.js";
import Task from "./task.js";
import promptSync from 'prompt-sync';

const inputPrompt = promptSync();

class Menu 
{
    static listPages = {
        "ShowTasks" : 0,
        "CreateTask" : 1,
        "DeleteTask" : 2,
        "EditTask" : 3,
        "CompleteTask" : 4,
        "Exit" : 9,
    };

    static selectMenu(clear = true) {
        if (clear)
            this.#clearConsole();
        
        console.log(" 0 - Show Tasks \n 1 - Create Task \n 2 - Delete Task \n 3 - Edit Task \n 4 - Complete Task \n 9 - Exit\n");

        const ans = inputPrompt("Select number: ");
        
        if (typeof(parseInt(ans)) === "number")
            this.goToPage(parseInt(ans));
    }

    static goToPage(id) {
        const selectedPage = id;

        switch (selectedPage) {
            case this.listPages.ShowTasks: 
            {
                this.#showTasks();
                break;
            }

            case this.listPages.CreateTask: 
            {
                this.#createTask();
                break;
            }
            
            case this.listPages.DeleteTask: 
            {
                this.#deleteTask();
                break;
            }

            case this.listPages.EditTask: 
            {
                this.#editTask();
                break;
            }

            case this.listPages.CompleteTask: 
            {
                this.#completeTask();
                break;
            }

            // Exit
            case this.listPages.Exit: 
            {
                Tasks.saveTasks();
                return;
            }

            default: {
                this.selectMenu(true);
            }
        }
    } 

    static #clearConsole() {
        console.clear();
    }

    static #showTasks(menuInput = true) {
        let data;

        try {
            data = Tasks.getTasks();
        } 
        catch (e) {
            console.log("".padStart(40, "─"));
            console.log(e.message);
            console.log("".padStart(40, "─"));

            const ans = inputPrompt("Do you want to create first task (y/n)? ");
            
            if (ans == "y")
                return this.goToPage(this.listPages.CreateTask);
            
            return this.selectMenu();
        }

        console.log("┌", "".padStart(data.header.context.length, "─"), "┐");
        console.log("│",             data.header.context,              "│");
        console.log("├", "".padStart(data.header.context.length, "─"), "┤");

        for (let i = 0; i < data.tasks.length; i++) {
            const task = data.tasks[i];

            const id = i.toString().padEnd(5, " ");
            const name = "| " + task.name.padEnd(data.header.maxLengthName - 3, " ");
            const description = "| " + task.description.padEnd(data.header.maxLengthDescription - 3, " ");
            const time = "| " + task.getEndTime().padEnd(data.header.maxLengthDate - 3, " ");
            const completed = ("| " + (task.isCompleted ? "✅" : "❌")) + "".padEnd(7, " ");

            console.log("│", id, name, description, time, completed, "│");
        }

        console.log("└", "".padStart(data.header.context.length, "─"), "┘");

        if (menuInput)
            this.selectMenu(false);
    }

    static #createTask() {
        this.#clearConsole();

        const nameTask = inputPrompt("Enter name task: ");
        const descriptionTask = inputPrompt("Enter description task: ");
        const dateTask = inputPrompt("Enter date when task will expire (2022-11-20 19:22:01): ");

        Tasks.addTask(new Task(nameTask, descriptionTask, new Date(dateTask)));

        console.log("Task added");

        const showTasks = inputPrompt("Show tasks(y/n)? ");

        Tasks.saveTasks();

        if (showTasks == "y")
            this.goToPage(this.listPages.ShowTasks);
        else
            this.selectMenu();
    }

    static #deleteTask() {
        this.#clearConsole();

        this.#showTasks(false);
        
        const tasks = Tasks.getTasks().tasks;
        let id;

        while(true) {
            id = inputPrompt("Enter id task: ");
            
            const parsedId = parseInt(id);

            if (!isNaN(parsedId) && parsedId >= 0 && parsedId < tasks.length)
                break;
        }
        
        Tasks.removeTask(parseInt(id));

        this.#showTasks(true);
    }

    static #editTask() {
        this.#clearConsole();

        this.#showTasks(false);
        
        console.log();
        console.log("".padStart(30, "─"));

        const tasks = Tasks.getTasks().tasks;

        let id;

        while(true) {
            id = inputPrompt("Enter id task: ");
            
            const parsedId = parseInt(id);

            if (!isNaN(parsedId) && parsedId >= 0 && parsedId < tasks.length)
                break;
        }

        let property;

        console.log(" 0 - Name \n 1 - Description \n 2 - Date \n");

        while(true) {
            property = inputPrompt("Enter what do you want to edit: ");
            
            const parsedProperty = parseInt(property);

            if (!isNaN(parsedProperty) && parsedProperty >= 0 && parsedProperty <= 2)
                break;
        }

        const newData = inputPrompt("Enter new data: ");

        const selectedTask = tasks[parseInt(id)];
        selectedTask.setProperty(parseInt(property), newData);

        this.#showTasks(true);
    }

    static #completeTask() {
        this.#clearConsole();

        this.#showTasks(false);

        const tasks = Tasks.getTasks().tasks;
        let id;

        while(true) {
            id = inputPrompt("Enter id task: ");
            
            const parsedId = parseInt(id);

            if (!isNaN(parsedId) && parsedId >= 0 && parsedId < tasks.length)
                break;
        }
        
        const selectedTask = tasks[parseInt(id)];
        selectedTask.completeTask();

        this.#showTasks(true);
    }
}

Menu.selectMenu();