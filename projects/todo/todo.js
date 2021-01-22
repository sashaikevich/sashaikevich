let listsLS = ['unfinishedListLS', 'finishedListLS'];

const unfinishedIconClasses = 'fa fa-circle-o task-bullet unfinished-task';
const finishedIconClasses = 'fa fa-check-circle task-bullet finished-task';

let deleteAllCompletedBtn = document.getElementById('delete-all-completed')
let deleteAllBtn = document.getElementById('delete-all')
let dividerLine = document.getElementById('divider-line')

let taskInput = document.getElementById('task-text');
let addTaskBtn = document.getElementById('add-task');

let allTodoLists = document.querySelectorAll('.todo-list');
let unfinishedList = document.getElementsByClassName('unfinished')[0];
let finishedList = document.getElementsByClassName('finished')[0];



// show today's date
(function () {
  let d = new Date();
  let daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  let months = ["Jan.", "Feb.", "Mar.", "Apr.", "May", "Jun.", "Jul.", "Aug.", "Sept.", "Oct.", "Nov.", "Dec."]
  let today = `${daysOfWeek[d.getDay()]}, ${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;

  // update today's date in DOM
  document.getElementById('today').textContent = today;
})();


// load all event listeners
function loadEventListeners() {
  // DOM load event
  document.addEventListener('DOMContentLoaded', function () {
    loadFromLS();
  })

  // add task
  addTaskBtn.addEventListener('click', addTodo);

  // filter or add task with "enter"
  taskInput.addEventListener('keyup', filterOrAdd);

  // manipulate tasks
  allTodoLists.forEach(function (list) {
    list.addEventListener('click', manipulateTask);
  });

  // delete all completeted tasks
  document.getElementById('delete-all-completed').addEventListener('click', deleteAllCompleted);

  // delete all tasks
  document.getElementById('delete-all').addEventListener('click', deleteAll);

};

loadEventListeners();

// populat task list from local storage
function loadFromLS() {
  listsLS.forEach(function (listLS) {
    if (localStorage.getItem(listLS) !== null) {
      let items = JSON.parse(localStorage.getItem(listLS));

      // calculate destination list DOM
      let itemDestination;
      switch (listLS) {
        case 'unfinishedListLS':
          itemDestination = unfinishedList;
          break;
        case 'finishedListLS':
          itemDestination = finishedList;
          break;
      }

      items.forEach(function (item) {
        addTodoDOM(item, itemDestination);
      })
    } else {
      // localStorage.setItem(listLS, JSON.stringify("[]"));
    }
  })

  checkForVisibility();
}

// create appropriate li element
function createLi(text, destination) {
  let li = document.createElement('li');

  // create unfinished li
  if (destination.classList.contains('unfinished')) {
    // create the circle to denote unfinished tasks
    const unchecked = document.createElement('i');
    unchecked.className = unfinishedIconClasses;
    unchecked.setAttribute('aria-hidden', 'true');

    // append circle icon
    li.appendChild(unchecked);
  }

  // create finished li
  else if (destination.classList.contains('finished')) {
    // create the circle to denote unfinished tasks
    const checked = document.createElement('i');
    checked.className = finishedIconClasses;
    checked.setAttribute('aria-hidden', 'true');

    // append circle icon
    li.appendChild(checked);
  }

  // create the x to delete tasks
  const x = document.createElement('i');
  x.className = 'fa fa-times delete-task';
  x.setAttribute('aria-hidden', 'true');

  // append x icon
  li.appendChild(x);

  let textNode = document.createTextNode(text);
  li.appendChild(textNode);
  return li;
}

// Filter tasks or add a new task
function filterOrAdd(e) {
  let code = (e.keyCode ? e.keyCode : e.which);

  if (e.target.value) {
    addTaskBtn.classList.add('active');
  } else {
    addTaskBtn.classList.remove('active');
  }

  if (code == 13) {
    addTodo(e);
  } else {
    let searchQuery = e.target.value.toLowerCase();

    document.querySelectorAll('.todo-list li').forEach(function (task) {
      let taskText = task.firstChild.nextSibling.nextSibling.textContent;
      if (taskText.toLowerCase().indexOf(searchQuery) != -1) {
        task.style.display = "block";
      } else {
        task.style.display = "none";
      }
    });
  }

  checkForVisibility();
}

// add a new task
function addTodo(e) {
  // add users task to DOM
  if (taskInput.value) {
    let text = taskInput.value;
    addTodoDOM(text, unfinishedList);
    // clear input field
    taskInput.value = "";
    // remove color from active button
    addTaskBtn.classList.remove('active');
    e.preventDefault();

    // add users task to LS
    addTodoLS(text, 'unfinishedListLS');
  }

  // unfilter results
  document.querySelectorAll('.todo-list li').forEach(function (task) {
    task.style.display = "block";
  });

  checkForVisibility();
};


// add task item to Local Storage
function addTodoLS(text, listLS) {
  let items = [];
  if (localStorage.getItem(listLS) !== null) {
    items = JSON.parse(localStorage.getItem(listLS));
  }
  items.push(text);
  localStorage.setItem(listLS, JSON.stringify(items));
};

// add task item to DOM
function addTodoDOM(text, destination) {
  destination.prepend(createLi(text, destination));
}

// manipulate task item
function manipulateTask(e) {
  if (e.target.classList.contains('delete-task')) {
    removeTask(e);
  } else if (e.target.classList.contains('unfinished-task')) {
    markComplete(e);
  } else if (e.target.classList.contains('finished-task')) {
    undoComplete(e);
  }

  e.preventDefault()
  return;
};


// remove task
function removeTask(e) {
  // remove from Local Storage
  let targetList = whichListLS(e);
  let items = JSON.parse(localStorage.getItem(targetList));

  // use a for loop instead of forEach to keep duplicates untouched
  for (let i = 0; i < items.length; i++) {
    if (items[i] == e.target.parentElement.textContent) {
      items.splice(i, 1);
      localStorage.setItem(targetList, JSON.stringify(items));
      break;
    }
  }

  // remove from DOM
  e.target.parentElement.remove();

  checkForVisibility();
};

// determine which LS list should be targeted
function whichListLS(e) {
  if (e.target.parentElement.parentElement.classList.contains('unfinished')) {
    return 'unfinishedListLS';
  } else if (e.target.parentElement.parentElement.classList.contains('finished')) {
    return 'finishedListLS';
    // console.log('part of the finished list');
  }
}

function markComplete(e) {
  // change icon in DOM
  e.target.classList = finishedIconClasses;
  setTimeout(function () {
    finishedList.prepend(e.target.parentElement);
  }, 0); // figure out why it only works with a 0 timeout, but not without timeout

  // remove task from current LS list
  removeTask(e);
  // add task to finished LS list
  addTodoLS(e.target.parentElement.textContent, 'finishedListLS');

  setTimeout(function () {
    checkForVisibility();
  }, 0); // figure out why it only works with a 0 timeout, but not without timeout
};

function undoComplete(e) {
  // change icon in DOM
  e.target.classList = unfinishedIconClasses;
  setTimeout(function () {
    unfinishedList.prepend(e.target.parentElement);
  }, 0); // figure out why it only works with a 0 timeout, but not without timeout

  // remove task from current LS list
  removeTask(e);
  // add task to unfinished LS list
  addTodoLS(e.target.parentElement.textContent, 'unfinishedListLS');

  checkForVisibility();
};

// delete all completed tasks
function deleteAllCompleted(e) {
  if (confirm("Are you sure you would like to completely clear your completed tasks?")) {
    // remove from DOM
    while (finishedList.firstElementChild) {
      finishedList.firstElementChild.remove();
    }
    // remove from LS
    localStorage.removeItem('finishedListLS');
  }

  checkForVisibility();
  e.preventDefault();
};

// delete all completed tasks
function deleteAll(e) {
  if (confirm("Are you sure you would like to completely clear all your tasks?")) {
    // remove from DOM
    allTodoLists.forEach(function (list) {
      while (list.firstElementChild) {
        list.firstElementChild.remove();
      }
    });
    // remove from LS
    localStorage.clear();
  }

  checkForVisibility();
  e.preventDefault();
};

function checkForVisibility() {
  if (finishedList.childElementCount) {
    deleteAllCompletedBtn.style.display = 'inline-block';
  } else {
    deleteAllCompletedBtn.style.display = 'none';
  }

  if (!finishedList.childElementCount && !unfinishedList.childElementCount) {
    deleteAllBtn.style.display = 'none';
  } else {
    deleteAllBtn.style.display = 'inline-block';
  }

  if (finishedList.childElementCount && unfinishedList.childElementCount) {
    dividerLine.style.display = 'inline';
  } else {
    dividerLine.style.display = 'none';
  }
}