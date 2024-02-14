export default class Task 
{
    /**
     * @readonly
     * @enum {number}
     */
    static propertyList = {
        "Name" : 0,
        "Description" : 1,
        "Date" : 2,
    };

    constructor(name, description, endTime) {
        this.name = name;
        this.description = description;
        this.endTime = endTime;

        this.isCompleted = false;
    }

    static fromJson(pasedObj) {
        const task = new Task(pasedObj.name, pasedObj.description, new Date(pasedObj.endTime));
        task.isCompleted = pasedObj.isCompleted;

        return task;
    };

    toJson() {
        return JSON.stringify(this);
    };

    /**
     * @param {propertyList} idProperty Take enum from Task class
     */
    setProperty(idProperty, value) {
        switch (idProperty) {
            case Task.propertyList.Name:
            {
                this.name = value ?? this.name;
                break;
            }

            case Task.propertyList.Description:
            {
                this.description = value ?? this.description;
                break;
            }

            case Task.propertyList.Date:
            {
                this.endTime = new Date(value) ?? this.endTime;
                break;
            }
        }
    }

    getEndTime() {
        return this.endTime.toISOString().slice(0, 19).replace('T', ' ');
    }

    completeTask() {
        this.isCompleted = !this.isCompleted;
    }

    taskHasExpired() {
        const now = new Date();

        return now > this.endTime;
    }
}