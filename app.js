"use strict";
function getElement(selector) {
    const element = document.querySelector(selector);
    if (!element) {
        throw new Error(`TypeTasks could not find ${selector}.`);
    }
    return element;
}
const titleInput = getElement("#title");
const addButton = getElement("#add");
const chips = getElement("#chips");
const list = getElement("#list");
const statuses = ["all", "todo", "in-progress", "done"];
let tasks = [];
let activeStatus = "all";
function addTask(title) {
    tasks = [
        ...tasks,
        {
            id: Date.now(),
            title,
            status: "todo"
        }
    ];
}
function filterByStatus() {
    if (activeStatus === "all")
        return tasks;
    return tasks.filter((task) => task.status === activeStatus);
}
function advanceTask(id) {
    tasks = tasks.map((task) => {
        if (task.id !== id)
            return task;
        const nextStatus = task.status === "todo"
            ? "in-progress"
            : task.status === "in-progress"
                ? "done"
                : "done";
        return { ...task, status: nextStatus };
    });
}
function deleteTask(id) {
    tasks = tasks.filter((task) => task.id !== id);
}
function renderChips() {
    chips.innerHTML = "";
    statuses.forEach((status) => {
        const button = document.createElement("button");
        button.className = `chip${status === activeStatus ? " active" : ""}`;
        button.textContent = status;
        button.addEventListener("click", () => {
            activeStatus = status;
            render();
        });
        chips.appendChild(button);
    });
}
function renderTasks() {
    list.innerHTML = "";
    filterByStatus().forEach((task) => {
        const item = document.createElement("li");
        item.className = "task";
        const title = document.createElement("span");
        title.className = "task-title";
        title.textContent = task.title;
        const badge = document.createElement("span");
        badge.className = "task-badge";
        badge.textContent = task.status;
        const nextButton = document.createElement("button");
        nextButton.className = "btn-sm";
        nextButton.textContent = "Next";
        nextButton.disabled = task.status === "done";
        nextButton.addEventListener("click", () => {
            advanceTask(task.id);
            render();
        });
        const deleteButton = document.createElement("button");
        deleteButton.className = "btn-sm";
        deleteButton.textContent = "Delete";
        deleteButton.addEventListener("click", () => {
            deleteTask(task.id);
            render();
        });
        item.append(title, badge, nextButton, deleteButton);
        list.appendChild(item);
    });
}
function render() {
    renderChips();
    renderTasks();
}
addButton.addEventListener("click", () => {
    const title = titleInput.value.trim();
    if (!title)
        return;
    addTask(title);
    titleInput.value = "";
    titleInput.focus();
    render();
});
titleInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        addButton.click();
    }
});
render();
