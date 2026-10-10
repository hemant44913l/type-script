type TaskStatus = "todo" | "in-progress" | "done";
type FilterStatus = "all" | TaskStatus;

interface Task {
  id: number;
  title: string;
  status: TaskStatus;
}

function getElement<T extends HTMLElement>(selector: string): T {
  const element = document.querySelector<T>(selector);

  if (!element) {
    throw new Error(`TypeTasks could not find ${selector}.`);
  }

  return element;
}

const titleInput = getElement<HTMLInputElement>("#title");
const addButton = getElement<HTMLButtonElement>("#add");
const chips = getElement<HTMLDivElement>("#chips");
const list = getElement<HTMLUListElement>("#list");

const statuses: FilterStatus[] = ["all", "todo", "in-progress", "done"];
let tasks: Task[] = [];
let activeStatus: FilterStatus = "all";

function addTask(title: string): void {
  tasks = [
    ...tasks,
    {
      id: Date.now(),
      title,
      status: "todo"
    }
  ];
}

function filterByStatus(): Task[] {
  if (activeStatus === "all") return tasks;
  return tasks.filter((task) => task.status === activeStatus);
}

function advanceTask(id: number): void {
  tasks = tasks.map((task) => {
    if (task.id !== id) return task;

    const nextStatus: TaskStatus = task.status === "todo"
      ? "in-progress"
      : task.status === "in-progress"
        ? "done"
        : "done";

    return { ...task, status: nextStatus };
  });
}

function deleteTask(id: number): void {
  tasks = tasks.filter((task) => task.id !== id);
}

function renderChips(): void {
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

function renderTasks(): void {
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

function render(): void {
  renderChips();
  renderTasks();
}

addButton.addEventListener("click", () => {
  const title = titleInput.value.trim();
  if (!title) return;

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
