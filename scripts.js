document.getElementById('addTaskBtn').addEventListener('click', function () {
    addTask();
});

document.getElementById('taskInput').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        addTask();
    }
});

document.getElementById('filterCategory').addEventListener('change', function () {
    filterTasks();
});

document.getElementById('filterPriority').addEventListener('change', function () {
    filterTasks();
});

document.getElementById('darkModeToggle').addEventListener('click', function () {
    document.body.classList.toggle('dark-mode');
    saveSettings();
});

function addTask() {
    const taskInput = document.getElementById('taskInput');
    const taskDueDate = document.getElementById('taskDueDate');
    const taskTime = document.getElementById('taskTime');
    const taskCategory = document.getElementById('taskCategory');
    const taskPriority = document.getElementById('taskPriority');

    const taskText = taskInput.value.trim();
    const dueDate = taskDueDate.value;
    const time = taskTime.value;
    const category = taskCategory.value;
    const priority = taskPriority.value;

    if (taskText !== '') {
        createTask(taskText, dueDate, time, category, priority);
        taskInput.value = '';
        taskDueDate.value = '';
        taskTime.value = '';
        taskCategory.value = 'work';
        taskPriority.value = 'low';
        saveTasks();
    }
}

function createTask(taskText, dueDate, time, category, priority) {
    const taskList = document.getElementById('taskList');

    const li = document.createElement('li');
    li.classList.add(priority, category);
    li.draggable = true;

    const taskContent = document.createElement('div');
    taskContent.className = 'task-content';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.addEventListener('change', function () {
        li.classList.toggle('completed');
        saveTasks();
    });

    const taskDetails = document.createElement('div');
    taskDetails.className = 'task-details';

    const taskName = document.createElement('span');
    taskName.textContent = taskText;

    const taskDueDateSpan = document.createElement('span');
    taskDueDateSpan.className = 'task-time';
    taskDueDateSpan.textContent = dueDate ? `Due: ${dueDate}` : '';

    const taskTimeSpan = document.createElement('span');
    taskTimeSpan.className = 'task-time';
    taskTimeSpan.textContent = time ? `Time: ${time}` : '';

    const taskCategorySpan = document.createElement('span');
    taskCategorySpan.className = `task-category ${category}`;
    taskCategorySpan.textContent = `Category: ${category}`;

    const taskPrioritySpan = document.createElement('span');
    taskPrioritySpan.className = `task-priority ${priority}`;
    taskPrioritySpan.textContent = `Priority: ${priority}`;

    taskDetails.appendChild(taskName);
    taskDetails.appendChild(taskDueDateSpan);
    taskDetails.appendChild(taskTimeSpan);
    taskDetails.appendChild(taskCategorySpan);
    taskDetails.appendChild(taskPrioritySpan);

    taskContent.appendChild(checkbox);
    taskContent.appendChild(taskDetails);

    const deleteBtn = document.createElement('button');
    deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
    deleteBtn.addEventListener('click', function () {
        taskList.removeChild(li);
        saveTasks();
    });

    li.appendChild(taskContent);
    li.appendChild(deleteBtn);
    taskList.appendChild(li);

    // Add drag-and-drop functionality
    li.addEventListener('dragstart', handleDragStart);
    li.addEventListener('dragover', handleDragOver);
    li.addEventListener('drop', handleDrop);
}

function filterTasks() {
    const filterCategory = document.getElementById('filterCategory').value;
    const filterPriority = document.getElementById('filterPriority').value;
    const tasks = document.querySelectorAll('#taskList li');

    tasks.forEach(task => {
        const categoryMatch = filterCategory === 'all' || task.classList.contains(filterCategory);
        const priorityMatch = filterPriority === 'all' || task.classList.contains(filterPriority);
        if (categoryMatch && priorityMatch) {
            task.style.display = 'flex';
        } else {
            task.style.display = 'none';
        }
    });
}

function saveTasks() {
    const tasks = [];
    document.querySelectorAll('#taskList li').forEach(task => {
        tasks.push({
            text: task.querySelector('.task-details span').textContent,
            dueDate: task.querySelector('.task-time').textContent[0].replace('Due: ', ''),
            time: task.querySelector('.task-time').textContent[1].replace('Time: ', ''),
            category: task.classList[1],
            priority: task.classList[0],
            completed: task.classList.contains('completed')
        });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => {
        createTask(task.text, task.dueDate, task.time, task.category, task.priority);
        const li = document.querySelector('#taskList li:last-child');
        if (task.completed) {
            li.classList.add('completed');
            li.querySelector('input[type="checkbox"]').checked = true;
        }
    });
}

function saveSettings() {
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDarkMode);
}

function loadSettings() {
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
    }
}

// Drag-and-drop functionality
let draggedItem = null;

function handleDragStart(e) {
    draggedItem = this;
    setTimeout(() => this.style.opacity = '0.4', 0);
}

function handleDragOver(e) {
    e.preventDefault();
    const afterElement = getDragAfterElement(this, e.clientY);
    const taskList = document.getElementById('taskList');
    if (afterElement == null) {
        taskList.appendChild(draggedItem);
    } else {
        taskList.insertBefore(draggedItem, afterElement);
    }
}

function handleDrop() {
    this.style.opacity = '1';
    saveTasks();
}

function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('li:not(.dragging)')];
    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

// Load tasks and settings when the page loads
window.addEventListener('load', () => {
    loadTasks();
    loadSettings();
});
