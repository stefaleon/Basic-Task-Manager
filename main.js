import TaskManager from "./TaskManager.js";

const taskManager = new TaskManager();
const addListButton = document.getElementById("addList");
const listsContainer = document.getElementById("listsContainer");

addListButton.addEventListener("click", () => {
	const listName = prompt("Enter list name:");
	if (listName) {
		taskManager.addList(listName);
		render();
	}
});

function render() {
	listsContainer.innerHTML = "";
	taskManager.lists.forEach((list, listIndex) => {
		const listDiv = document.createElement("div");
		listDiv.className = "list";
		listDiv.innerHTML = `<h1>${list.name}</h1>`;

		listDiv.addEventListener("dragover", (event) => {
			event.preventDefault();
		});

		listDiv.addEventListener("drop", (event) => {
			event.preventDefault();
			console.log(event.dataTransfer.getData("text/plain"))
			const sourceData = event.dataTransfer.getData("text/plain").split("-");			
			const sourceListIndex = parseInt(sourceData[0]);
			const sourceItemIndex = parseInt(sourceData[1]);			
			const targetListIndex = listIndex;
			const dropPosition = getDropPosition(event.clientY, listDiv);

			if (sourceListIndex === targetListIndex) {
				const [item] = taskManager.lists[sourceListIndex].items.splice(sourceItemIndex, 1);
				taskManager.lists[targetListIndex].items.splice(dropPosition, 0, item);
				taskManager.saveToLocalStorage();
				render();
			} else {
				const [item] = taskManager.lists[sourceListIndex].items.splice(sourceItemIndex, 1);
				taskManager.lists[targetListIndex].items.splice(dropPosition, 0, item);
				taskManager.saveToLocalStorage();
				render();
			}
		});

		list.items.forEach((item, itemIndex) => {
			const itemDiv = document.createElement("div");
			itemDiv.className = "item";
			itemDiv.innerText = item.text;

			const removeButton = document.createElement("button");
			removeButton.className = "remove-button";
			removeButton.innerText = "✕";
			removeButton.addEventListener("click", (event) => {
				event.stopPropagation();
				const confirmDelete = confirm("Are you sure you want to remove this task?");
				if (confirmDelete) {
					taskManager.removeItem(listIndex, itemIndex);
					render();
				}
			});

			itemDiv.appendChild(removeButton);

			itemDiv.addEventListener("click", () => {
				const newText = prompt("Edit item:", item.text);
				if (newText) {
					item.text = newText;
					render();
				}
			});

			itemDiv.draggable = true;

			itemDiv.addEventListener("dragstart", (event) => {
				event.dataTransfer.setData("text/plain", `${listIndex}-${itemIndex}`);
			});

			listDiv.appendChild(itemDiv);
		});

		const addTaskButton = document.createElement("button");
		addTaskButton.innerText = "+";
		addTaskButton.className = "add-task-button"
		addTaskButton.addEventListener("click", () => {
			const taskText = prompt("Enter task:");
			if (taskText) {
				taskManager.addItem(listIndex, taskText);
				render();
			}
		});

		const removeListButton = document.createElement("button");
		removeListButton.innerText = "✕";
		removeListButton.className = "remove-list-button"
		removeListButton.addEventListener("click", () => {
			const confirmDelete = confirm("Are you sure you want to remove this list?");
			if (confirmDelete) {
				taskManager.removeList(listIndex);
				render();
			}
		});

		listDiv.appendChild(addTaskButton);
		listDiv.appendChild(removeListButton);

		listsContainer.appendChild(listDiv);
	});
}

function getDropPosition(y, listDiv) {
	const items = Array.from(listDiv.getElementsByClassName("item"));
	for (let i = 0; i < items.length; i++) {
		const rect = items[i].getBoundingClientRect();
		if (y < rect.top + rect.height / 2) {
			return i;
		}
	}
	return items.length;
}

taskManager.initialize();
render();
