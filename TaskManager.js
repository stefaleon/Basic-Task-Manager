import TaskList from "./TaskList.js";
import TaskItem from "./TaskItem.js";

class TaskManager {
	constructor() {
		const savedData = localStorage.getItem("taskManager");
		this.lists = savedData ? JSON.parse(savedData).lists : [];
	}

	initialize() {		
		if (!(localStorage.getItem("taskManager"))) {			
			this.lists = [
				{
					name: "Pending",
					items: [{text: "Task 1"}, {text: "Task 2"}],
				},
				{
					name: "On Hold",
					items: [],
				},
				{
					name: "Doing",
					items: [],
				},
			];			
			this.saveToLocalStorage();
		}		
	}

	addList(listName) {
		const list = new TaskList(listName);
		this.lists.push(list);
		this.saveToLocalStorage();
	}

	removeList(index) {
		this.lists.splice(index, 1);
		this.saveToLocalStorage();
	}

	addItem(listIndex, itemText) {
		const item = new TaskItem(itemText);
		this.lists[listIndex].items.push(item);
		this.saveToLocalStorage();
	}

	removeItem(listIndex, itemIndex) {
		this.lists[listIndex].items.splice(itemIndex, 1);
		this.saveToLocalStorage();
	}

	saveToLocalStorage() {
		const data = { lists: this.lists };
		localStorage.setItem("taskManager", JSON.stringify(data));
	}
}

export default TaskManager;
