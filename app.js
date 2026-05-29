// Grab elements from the HTML
const input      = document.getElementById('task-input');
const addBtn     = document.getElementById('add-btn');
const taskList   = document.getElementById('task-list');
const countEl    = document.getElementById('count');
const clearBtn   = document.getElementById('clear-btn');
const filterBtns = document.querySelectorAll('.filter-btn');

// Our data — all tasks live here
let tasks = [];
let currentFilter = 'all';

// Add a new task
function addTask() {
  const text = input.value.trim();
  if (text === '') return;
  tasks.push({ id: Date.now(), text: text, done: false });
  input.value = '';
  render();
}

// Check/uncheck a task
function toggleTask(id) {
  const task = tasks.find(t => t.id === id);
  if (task) { task.done = !task.done; render(); }
}

// Delete a task
function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  render();
}

// Clear all completed tasks
function clearDone() {
  tasks = tasks.filter(t => t.done === false);
  render();
}

// Draw the list on screen
function render() {
  let visible = tasks;
  if (currentFilter === 'active') visible = tasks.filter(t => !t.done);
  if (currentFilter === 'done')   visible = tasks.filter(t => t.done);

  taskList.innerHTML = '';

  if (visible.length === 0) {
    taskList.innerHTML = '<p class="empty-msg">Nothing here yet!</p>';
  }

  visible.forEach(task => {
    const li = document.createElement('li');
    li.className = 'task-item' + (task.done ? ' done' : '');
    li.innerHTML = `
      <input type="checkbox" id="cb-${task.id}"
        ${task.done ? 'checked' : ''}
        onchange="toggleTask(${task.id})" />
      <label for="cb-${task.id}">${task.text}</label>
      <button class="delete-btn" onclick="deleteTask(${task.id})">×</button>
    `;
    taskList.appendChild(li);
  });

  const remaining = tasks.filter(t => !t.done).length;
  countEl.textContent = remaining + (remaining === 1 ? ' task left' : ' tasks left');
}

// Listen for button clicks and keypresses
addBtn.addEventListener('click', addTask);
input.addEventListener('keydown', e => { if (e.key === 'Enter') addTask(); });
clearBtn.addEventListener('click', clearDone);

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    render();
  });
});

// Start the app
render();
