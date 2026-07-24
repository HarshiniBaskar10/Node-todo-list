// ==========================================
// 1. CONFIGURATION & DOM ELEMENTS
// ==========================================
const API_URL = 'http://localhost:3000/api/tasks';

const todoInput = document.getElementById('todo-input');
const addBtn = document.getElementById('add-btn');
const todoList = document.getElementById('todo-list');

// ==========================================
// 2. HELPER: BUILD A TASK ON THE SCREEN
// ==========================================
// This function takes a task object from the server and draws it on the webpage
const renderTaskToDOM = (task) => {
    const li = document.createElement('li');
    li.innerText = task.text;

    // If the database says it's already done, apply the CSS strikethrough
    if (task.completed) {
        li.classList.add('completed');
    }

    const deleteBtn = document.createElement('button');
    deleteBtn.innerText = 'X';
    deleteBtn.classList.add('delete-btn');

    // --- INTERACTIVITY: TOGGLE COMPLETE (HTTP PATCH) ---
    li.addEventListener('click', async () => {
        try {
            // Tell the backend to flip the boolean
            await fetch(`${API_URL}/${task.id}`, {
                method: 'PATCH'
            });
            // Update the screen if the server request succeeded
            li.classList.toggle('completed');
        } catch (error) {
            console.error('Error updating task:', error);
        }
    });

    // --- INTERACTIVITY: DELETE TASK (HTTP DELETE) ---
    deleteBtn.addEventListener('click', async (event) => {
        event.stopPropagation(); // Stop click from triggering the toggle above

        try {
            // Tell the backend to delete this specific ID
            await fetch(`${API_URL}/${task.id}`, {
                method: 'DELETE'
            });
            // Remove the element from the screen
            li.remove();
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    });

    // Attach button to LI, and LI to UL
    li.appendChild(deleteBtn);
    todoList.appendChild(li);
};

// ==========================================
// 3. READ: LOAD ALL TASKS ON PAGE LOAD (HTTP GET)
// ==========================================
const loadTasksFromServer = async () => {
    try {
        // Clear the current list just in case
        todoList.innerHTML = '';

        // Ask the Express server for the array of tasks
        const response = await fetch(API_URL);
        const tasks = await response.json();

        // Loop through the array and draw each task
        tasks.forEach(task => {
            renderTaskToDOM(task);
        });
    } catch (error) {
        console.error('Is your Express server running? Error:', error);
    }
};

// ==========================================
// 4. CREATE: SEND NEW TASK TO SERVER (HTTP POST)
// ==========================================
addBtn.addEventListener('click', async () => {
    const taskText = todoInput.value.trim();

    if (taskText === '') return;

    try {
        // Send the text to the backend as a JSON string
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text: taskText })
        });

        // The server replies with the newly created task object (with its new timestamp ID!)
        const savedTask = await response.json();

        // Draw the new task on the screen
        renderTaskToDOM(savedTask);

        // Clear the input box
        todoInput.value = '';
    } catch (error) {
        console.error('Error saving task:', error);
    }
});

// Extra Credit: Allow pressing 'Enter' to submit
todoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addBtn.click();
});

// ==========================================
// 5. INITIALIZE THE APP
// ==========================================
// Call this once as soon as the file loads!
loadTasksFromServer();