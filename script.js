
const STORAGE_KEY = "todoWebsiteTasks";

let tasks = [];

try {
    const savedTasks = JSON.parse(
        localStorage.getItem(STORAGE_KEY) || "[]"
    );

    tasks = Array.isArray(savedTasks) ? savedTasks : [];
} catch (error) {
    tasks = [];
}

let nextId = tasks.reduce(
    (maximum, task) => Math.max(maximum, Number(task.id) || 0),
    0
) + 1;

function saveTasks() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (error) {
        alert("Tasks could not be saved in this browser.");
    }
}

function renderTasks() {
    const list = document.getElementById("taskList");
    const summary = document.getElementById("taskSummary");

    const searchText = document
        .getElementById("searchInput")
        .value.trim().toLowerCase();

    const selectedPriority =
        document.getElementById("priorityFilter").value;

    const filteredTasks = tasks.filter(task => {
        const matchesName = (task.name || "")
            .toLowerCase()
            .includes(searchText);

        const matchesPriority =
            selectedPriority === "All" ||
            task.priority === selectedPriority;

        return matchesName && matchesPriority;
    });

    const completedCount = tasks.filter(
        task => task.status === "Completed"
    ).length;

    summary.textContent =
        `Total: ${tasks.length} | Completed: ${completedCount} | Pending: ${tasks.length - completedCount}`;

    list.innerHTML = "";

    if (filteredTasks.length === 0) {
        const message = document.createElement("p");
        message.className = "empty-message";
        message.textContent = tasks.length === 0
            ? "No tasks yet. Add your first task!"
            : "No matching tasks found.";

        list.appendChild(message);
        return;
    }

    filteredTasks.forEach(task => {
        const card = document.createElement("div");
        card.className = "task-card";

        if (task.status === "Completed") {
            card.classList.add("completed");
        }

        if (task.priority === "High") {
            card.classList.add("priority-high");
        } else if (task.priority === "Medium") {
            card.classList.add("priority-medium");
        } else {
            card.classList.add("priority-low");
        }

        const title = document.createElement("h3");
        title.textContent = task.name;

        const description = document.createElement("p");
        description.className = "task-description";
        description.textContent =
            task.description || "No description provided.";

        const details = document.createElement("div");
        details.className = "task-details";

        const priorityLine = document.createElement("div");
        priorityLine.textContent = `Priority: ${task.priority}`;

        const dueLine = document.createElement("div");
        dueLine.textContent = `Due: ${task.dueDate || "Not set"}`;

        const statusLine = document.createElement("div");
        statusLine.className = "status";
        statusLine.textContent = `Status: ${task.status}`;

        details.append(priorityLine, dueLine, statusLine);

        const actions = document.createElement("div");
        actions.className = "task-actions";

        const completeButton = document.createElement("button");
        completeButton.className = "complete-button";
        completeButton.textContent =
            task.status === "Completed"
                ? "Mark Pending"
                : "Mark Completed";

        completeButton.addEventListener("click", () => {
            task.status =
                task.status === "Completed"
                    ? "Pending"
                    : "Completed";

            saveTasks();
            renderTasks();
        });

        const deleteButton = document.createElement("button");
        deleteButton.className = "delete-button";
        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click", () => {
            const confirmed = confirm(
                `Delete the task "${task.name}"?`
            );

            if (!confirmed) return;

            tasks = tasks.filter(item => item.id !== task.id);
            saveTasks();
            renderTasks();
        });

        actions.append(completeButton, deleteButton);
        card.append(title, description, details, actions);
        list.appendChild(card);
    });
}

document.getElementById("taskForm").addEventListener("submit", event => {
    event.preventDefault();

    const name = document
        .getElementById("taskName")
        .value.trim();

    const description = document
        .getElementById("description")
        .value.trim();

    const priority = document.getElementById("priority").value;
    const dueDate = document.getElementById("dueDate").value;

    if (!name || !dueDate) {
        alert("Please enter a task name and due date.");
        return;
    }

    tasks.push({
        id: nextId++,
        name: name,
        description: description,
        priority: priority,
        dueDate: dueDate,
        status: "Pending"
    });

    saveTasks();
    event.target.reset();

    document.getElementById("priority").value = "Medium";

    renderTasks();
});

document.getElementById("searchInput")
    .addEventListener("input", renderTasks);

document.getElementById("priorityFilter")
    .addEventListener("change", renderTasks);

renderTasks();
