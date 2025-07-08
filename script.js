const form = document.getElementById('todo-form');
const input = document.getElementById('new-task');
const list = document.getElementById('todo-list');
const filterButtons = document.querySelectorAll('.filters button');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let filter = 'all';

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTasks() {
  list.innerHTML = '';
  const visibleTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
  });

  visibleTasks.forEach((task, index) => {
    const li = document.createElement('li');
    li.className = task.completed ? 'completed' : '';
    li.innerHTML = `
      <span>${task.text}</span>
      <div class="actions">
        <button onclick="toggleTask(${index})">${task.completed ? '↩️' : '✅'}</button>
        <button onclick="editTask(${index})">✏️</button>
        <button onclick="deleteTask(${index})">🗑️</button>
      </div>
    `;
    list.appendChild(li);
  });

  updateProgressBar();
}

function addTask(text) {
  if (tasks.some(task => task.text.toLowerCase() === text.toLowerCase())) {
    alert("Task already exists!");
    return;
  }
  tasks.push({ text, completed: false });
  saveTasks();
  renderTasks();
}

function toggleTask(index) {
  const filteredIndex = getFilteredIndexes()[index];
  tasks[filteredIndex].completed = !tasks[filteredIndex].completed;
  saveTasks();
  renderTasks();
}

function deleteTask(index) {
  const filteredIndex = getFilteredIndexes()[index];
  tasks.splice(filteredIndex, 1);
  saveTasks();
  renderTasks();
}

function editTask(index) {
  const filteredIndex = getFilteredIndexes()[index];
  const newText = prompt("Edit task:", tasks[filteredIndex].text);
  if (newText !== null && newText.trim() !== '') {
    if (tasks.some((task, i) => i !== filteredIndex && task.text.toLowerCase() === newText.toLowerCase())) {
      alert("Task already exists!");
      return;
    }
    tasks[filteredIndex].text = newText.trim();
    saveTasks();
    renderTasks();
  }
}

function getFilteredIndexes() {
  return tasks.map((task, i) => ({ task, i }))
    .filter(({ task }) => {
      if (filter === 'all') return true;
      if (filter === 'active') return !task.completed;
      if (filter === 'completed') return task.completed;
    }).map(({ i }) => i);
}

function updateProgressBar() {
  const total = tasks.length;
  const completed = tasks.filter(task => task.completed).length;
  const percent = total === 0 ? 0 : (completed / total) * 100;
  document.getElementById('progress-bar').style.width = percent + '%';
}

form.addEventListener('submit', e => {
  e.preventDefault();
  const text = input.value.trim();
  if (text !== '') {
    addTask(text);
    input.value = '';
  }
});

filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    filterButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    filter = btn.getAttribute('data-filter');
    renderTasks();
  });
});

renderTasks();
