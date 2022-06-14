const form = document.querySelector('#input_form');
const todoList = document.querySelector('#todo_list');
const todoInput = document.querySelector('#todo_input');
const search = document.querySelector('#search_input');

// handle submit
form.addEventListener('submit', addTodo);
let todos = JSON.parse(localStorage.getItem('todos')) || [];
MapTodo(todos);

function addTodo(e) {
    e.preventDefault();
    const todo = todoInput.value;
    todo ? todos.push(todo) : alert('Please enter a todo');
    saveTodo();
    MapTodo(todos);
    todoInput.value = '';
}

function saveTodo() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

function MapTodo(todos){
    todoList.innerHTML = '';
    for (let index = 0; index < todos.length; index++) {
        const todo = todos[index];
        const newTodo = document.createElement('li');
        newTodo.setAttribute('index', index);
        newTodo.className = 'list-group-item d-flex justify-content-between align-items-center';
        const newTodoText = document.createElement('span');
        newTodoText.className = 'todo_text';
        newTodoText.innerText = todo;
        const deletIcon = document.createElement('i');
        deletIcon.className = 'far fa-trash-alt delete';
        deletIcon.addEventListener('click', deleteTodo);
        newTodo.appendChild(newTodoText);
        newTodo.appendChild(deletIcon);  
        todoList.appendChild(newTodo);
    }
    
}

function deleteTodo(e) {
    const index = e.target.parentElement.getAttribute('index');
    todos.splice(index, 1);
    saveTodo();
    MapTodo(todos);
}

search.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    const filter_todos = todos.filter((todo) => {
        return todo.toLowerCase().includes(term);
    });
   term.length > 0 ? 
   MapTodo(filter_todos) : 
   MapTodo(todos);
})
