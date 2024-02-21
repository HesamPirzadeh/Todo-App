const taskInput = document.querySelector("#task-input");
const dateInput = document.querySelector("#date-input");
const addButton = document.querySelector("#add-button");
const editButton = document.querySelector("#edit-button");
const alertMessage = document.getElementById("alert-messege");
const tbody = document.querySelector("tbody");
const deleteButtonn = document.querySelector("#delete-all-btn");
const todoFilter = document.querySelectorAll(".fliter-todos");

// when we get localstorage if we reload it will gives us null
let todos = JSON.parse(localStorage.getItem("todos")) || [];

const idGenerator = () => {
  return Math.round(
    Math.random() * Math.random() * Math.pow(15, 10)
  ).toString();
};

const saveToStorage = () => {
  localStorage.setItem("todos", JSON.stringify(todos));
};

const showAlert = (message, type) => {
  // important dont show repeatitavie alert
  alertMessage.innerHTML = "";
  const p = document.createElement("p");
  p.innerText = message;
  p.classList.add(`alert`);
  p.classList.add(`alert-${type}`);
  alertMessage.append(p);

  setTimeout(() => {
    p.style.display = "none";
  }, 2000);
};

const displayTodo = (data) => {
  const todoList = data ? data : todos;
  // means remve repetative show in foreach
  tbody.innerHTML = "";
  if (!todoList.length) {
    tbody.innerHTML = "<tr><td colspan='4'>No task</td></tr>";
    return;
    // return means if this code excuted end function
  }

  todoList.forEach((item) => {
    // means every time show every todos in local storage
    tbody.innerHTML += `
           <tr>
           <td>${item.task}</td>
           <td>${item.date || "No Date"}</td>
           <td>${item.completed ? "compelted" : "pending"}</td>
           <td>
              <button onclick="editHandler('${item.id}')">edit</button>
              <button onclick= "doHandler('${item.id}')">
              ${item.completed ? "Undo" : "Do"}
                   </button>
              <button onclick= "deleteOne('${item.id}')">delete</button>
           </td>
           </tr>
          `;
  });
};

const deleteHandler = () => {
  // must save null array in local again and display it empty in web
  if (todos.length) {
    todos = [];
    saveToStorage();
    displayTodo();
    showAlert("all todos cleared succefully ", "success");
  } else {
    showAlert("No Task to clear", "error");
  }
};

const addHandler = () => {
  // important get value without parentElement
  const task = taskInput.value;
  const date = dateInput.value;
  const todo = {
    id: idGenerator(),
    completed: false,
    task,
    date
  };
  if (task) {
    todos.push(todo);
    saveToStorage();
    displayTodo();
    taskInput.value = "";
    dateInput.value = "";
    showAlert("Todo successfuly added", "success");
  } else {
    showAlert("Please enter todo", "error");
  }
};

// remove with filter , change new todo with old one to show
const deleteOne = (id) => {
  const newTodos = todos.filter((item) => item.id !== id);
  todos = newTodos;
  saveToStorage();
  displayTodo();
  showAlert("delete successfuly", "success");
};

// change do to undo with find and id
const doHandler = (id) => {
  const edit = todos.find((item) => item.id === id);
  edit.completed = !edit.completed;
  saveToStorage();
  displayTodo();
  showAlert(`${edit.completed ? "Do" : "Undo"} succcessfuly`, "success");
};

// edit button with find and send it to value of input
const editHandler = (id) => {
  const editTodo = todos.find((item) => item.id === id);
  taskInput.value = editTodo.task;
  dateInput.value = editTodo.date;
  addButton.style.display = "none";
  editButton.style.display = "inline-block";
  // we can use this id in applyedit function
  editButton.dataset.id = id;
};

const applyEdit = (e) => {
  // for using data set which we assign in edit handler
  const id = e.target.dataset.id;
  const todo = todos.find((item) => item.id === id);
  todo.task = taskInput.value;
  todo.date = dateInput.value;
  taskInput.value = "";
  dateInput.value = "";
  addButton.style.display = "inline-block";
  editButton.style.display = "none";
  saveToStorage();
  displayTodo();
  showAlert("edited sucssesfuly", "success");
};

const filterHandler = (event) => {
  let filterTodos = null;
  const filter = event.target.dataset.filter;
  switch (filter) {
    case "pending":
      filterTodos = todos.filter((todo) => todo.completed === false);
      break;

    case "compelted":
      filterTodos = todos.filter((todo) => todo.completed === true);
      break;
    default:
      filterTodos = todos;
      break;
  }
  displayTodo(filterTodos);
};

//  we dont want to show it as event
window.addEventListener("load", () => displayTodo());
addButton.addEventListener("click", addHandler);
deleteButtonn.addEventListener("click", deleteHandler);
editButton.addEventListener("click", applyEdit);
// if we have 3 button and want to add event for 3 of em we can foreach on 3 and then get event
todoFilter.forEach((button) => {
  button.addEventListener("click", filterHandler);
});
