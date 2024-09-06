// Select DOM elements
const form = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');

// Load tasks from localStorage when the page loads
document.addEventListener('DOMContentLoaded', loadTasksFromStorage);

// Add event listener for form submission
form.addEventListener('submit', function(event) {
  event.preventDefault();
  addTask(todoInput.value);
  todoInput.value = ''; // Clear input field
});

// Function to add task
function addTask(taskText) {
  if (taskText.trim()) {
    const li = document.createElement('li');
    li.classList.add('fade-in'); // Add animation

    // Create task content
    li.innerHTML = `
      <span>${taskText}</span>
      <div class="actions">
        <button class="edit-btn" onclick="editTask(this)">Edit</button>
        <button onclick="deleteTask(this)">Delete</button>
      </div>
    `;

    // Add event listener to mark task as complete
    li.addEventListener('click', function() {
      li.classList.toggle('completed');
      updateTaskStatusInStorage(taskText);
    });

    todoList.appendChild(li);

    // Save the task to localStorage
    saveTaskToStorage(taskText);
  }
}

// Function to delete task with animation
function deleteTask(button) {
  const li = button.parentElement.parentElement;
  const taskText = li.firstChild.textContent;

  li.classList.add('fade-out'); // Add fade-out animation

  // Remove the task after animation completes
  setTimeout(() => {
    li.remove();
    removeTaskFromStorage(taskText); // Remove from localStorage
  }, 500);
}

// Function to edit task
function editTask(button) {
  const li = button.parentElement.parentElement;
  const oldTask = li.firstElementChild.textContent;
  const newTask = prompt("Edit your task", oldTask);

  if (newTask.trim()) {
    li.firstElementChild.textContent = newTask;
    updateTaskInStorage(oldTask, newTask);
  }
}

// Function to load tasks from localStorage
function loadTasksFromStorage() {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

  tasks.forEach(task => {
    const li = document.createElement('li');
    li.classList.add('fade-in');
    li.innerHTML = `
      <span>${task.name}</span>
      <div class="actions">
        <button class="edit-btn" onclick="editTask(this)">Edit</button>
        <button onclick="deleteTask(this)">Delete</button>
      </div>
    `;
    if (task.completed) {
      li.classList.add('completed');
    }
    li.addEventListener('click', function() {
      li.classList.toggle('completed');
      updateTaskStatusInStorage(task.name);
    });
    todoList.appendChild(li);
  });
}

// Function to save task to localStorage
function saveTaskToStorage(taskText) {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks.push({ name: taskText, completed: false });
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Function to update task status in localStorage (completed or not)
function updateTaskStatusInStorage(taskText) {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks.forEach(task => {
    if (task.name === taskText) {
      task.completed = !task.completed;
    }
  });
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Function to remove task from localStorage
function removeTaskFromStorage(taskText) {
  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks = tasks.filter(task => task.name !== taskText);
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Function to update task in localStorage (edit task)
function updateTaskInStorage(oldTask, newTask) {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks.forEach(task => {
    if (task.name === oldTask) {
      task.name = newTask;
    }
  });
  localStorage.setItem('tasks', JSON.stringify(tasks));
}
// Function to filter tasks
function filterTasks(status) {
  const tasks = document.querySelectorAll('li');
  tasks.forEach(task => {
    switch (status) {
      case 'all':
        task.style.display = 'flex';
        break;
      case 'completed':
        task.style.display = task.classList.contains('completed') ? 'flex' : 'none';
        break;
      case 'pending':
        task.style.display = !task.classList.contains('completed') ? 'flex' : 'none';
        break;
    }
  });
}

// Function to clear all tasks
function clearAllTasks() {
  while (todoList.firstChild) {
    todoList.removeChild(todoList.firstChild);
  }
  localStorage.removeItem('tasks'); // Clear tasks from localStorage
}

