// we want the list and name to persist even when we close the browser or shut down the computer so we will use localStorage
// when the window loads, we need to quickly get into local storage to get the previous data
// or if data is not there, we declare empty strings or arrays waiting to receive new data

window.addEventListener('load', () => {
  // first of all let's point to relevant elements in the HTML
  const nameInput = document.querySelector('#cus-name');
  const newTodoForm = document.querySelector('#new-todo-form');

  // now let's get into local storage and retrieve saved name data
  // or if saved name data is not there, bring back an empty string
  // we will assign whatever we bring back to the 'username' variable
  const username = localStorage.getItem('username') || '';

  // we already pointed to #cus-name and named it nameInput
  // so whatever we bring back into username, put it in nameInput
  // if it had a saved name data, it will be there when page loads
  // if it does not, and returned an empty String, field will be empty, waiting for new data input
  nameInput.value = username;

  // when the input is empty on load, then the user types in their name
  // we need to inform local storage to pick it up and save it inside the username variable
  // so we listen for a change event on that element
  // when that change event occurs, we target its value
  // pick it up and put it inside the username key as saved name data
  // when the page loads next time, hopefully, it persists
  // note here, we are only expecting a string value
  // JSON values are already string values so we don't have to stringify the data to store
  nameInput.addEventListener('change', (e) => {
    localStorage.setItem('username', e.target.value);
  });

  // now we need to take data from the form and store it. or serve it when the page loads
  // we declared a todos variable to save the form data into it
  // if no stored data, we declare an empty [] and assign it to todos to wait and receive value
  // todos is the key here, the value will be in the form of js objects inside the array
  // note that the todos is not explicitly declared with var, let, or const so it can be accessed anywhere
  // yes it's possible without errors because we assigned it with an = sign
  todos = JSON.parse(localStorage.getItem('theTaskList')) || [];

  // the newTodoForm is listening for the submit
  // if it is clicked and all the relevant data are available, we need to add that todo as an object to the todos array
  newTodoForm.addEventListener('submit', (e) => {
    // on forms, after submission, the default is the page reloads
    // we want to prevent that default behavior
    e.preventDefault();
    // we need 2 todo properties from the form to create the todo
    // 1) the user input task or content and
    // 2) the category they selected for the todo
    // we also want to add a done? & date() property
    if (e.target.elements.content.value && e.target.elements.category.value) {
      const todo = {
        // we're using e.target.elements to access the form control with the custom names to get the user input value
        content: e.target.elements.content.value,
        // or if it's a selection, get the 'value' we put on it
        category: e.target.elements.category.value,
        done: false,
        createdAt: new Date().getTime(),
      };
      // after the todo obj is created, we push it to the todos array as another element
      todos.push(todo);

      // now todos has an element but how do we store it in local storage?
      // i'm calling the key theTaskList and the value is an array with objects declared already as todos
      // this todos value is not a string so we must find a way to make it a set of strings when storing it
      localStorage.setItem('theTaskList', JSON.stringify(todos));
    } else {
      alert('Not too fast! Add a task and pick a category');
    }

    // after submission, since the page does not reload, we need a way to reset the form
    e.target.reset();

    // now that the todos array is ready, we need to display the taskList inside the .todo-list section
    // so we immediately call the function to extract the data from the todos [] and do that
    displayTodos();
  });
  // currently the previous displayTodos() is hiding behind the form submit listener
  // but what if the user comes to the page but does not submit a form?
  // then if there if there is data stored in local Storage, it won't be displayed?
  // that is what this displayTodos() declared here is for
  // to display whatever is available when the page load whether a new todo is submitted or not
  displayTodos();
});

function displayTodos() {
  // let's point to the div#list container and clear it
  const list = document.querySelector('#list');

  // we are clearing first because anytime there's a re-render,
  // we want to start this section with a clean slate
  // we will be creating all the elements from scratch
  list.innerHTML = '';

  // remember the todos [] is declared globally so we can access it here
  // go over each of them and create the HTML structure for it
  // we will create the list inside the empty div.list in the .todo-list section
  // right below the TODO LIST header
  // follow the commented-out HTML structure to see an example
  todos.forEach((todo) => {
    // // STAY WITH THIS.TODO, IT'S THE ONE WE ARE DOING EVERYTHING FOR
    // when we are done, we will pick the next todo from the array

    // LET'S CREATE A LIST ITEM FOR THIS.TODO

    // inside the existing div.list, we have a container that holds every part of the list together: the div.list-item
    // let's create it with its corresponding class
    // make sure the classes match the ones defined the in the css
    const listItem = document.createElement('div');
    listItem.classList.add('list-item');

    // the div.list-item holds 3 parts of the list
    // checkbox label, input content div, edit-delete div

    // 1. a label which holds the checkbox input and the span

    const label = document.createElement('label');
    const input = document.createElement('input');
    const span = document.createElement('span');

    // let's add their corresponding classes/styles & attributes
    input.type = 'checkbox';
    // by default in our code, a newly added todo.done = false
    // meaning the checkbox is not checked
    // but if this todo.done = true, then input.checked will be true
    // that means we are saying the checkbox is checked
    input.checked = todo.done;
    // if checkbox is checked, we will set the todo.done = true
    // if that todo.done is true, add a class of .done
    // that .done is styled to make this todo.content text gray and strike through it
    // this logic is in normal flow of execution to add .done when necessary.
    // nothing happens when todo.done = false
    if (todo.done) {
      listItem.classList.add('done');
    }
    // remember this span.bubble was styled to take over the input
    // the checkbox is not displayed but the span.bubble is near it and imitates it
    span.classList.add('bubble');
    // according to category, we are styling this.todo's span differently by color
    if (todo.category == 'personal') {
      span.classList.add('personal');
    } else {
      span.classList.add('business');
    }
    // now we need to put the input and span inside the label
    label.appendChild(input);
    label.appendChild(span);

    // 2. a div which holds the input for this.todo
    const todoContent = document.createElement('div');
    todoContent.classList.add('todo-content');
    // we are passing the input inside the div.todo-content
    // we passed the whole input tag in so we can add the variable todo that the user will input here dynamically
    // note that the value is wrapped in quotes so that even if it's a string input, it will capture all not just the first letter
    // the readonly attribute ensures that the text isn't editable
    todoContent.innerHTML = `<input type='text' value='${todo.content}' readonly>`;
    // the input has already been put directly inside the div so move on

    // 3. last part inside the div.list-item is a div with 2 action btns
    const listActions = document.createElement('div');
    listActions.classList.add('list-actions');
    // now create the btns inside the div.list-actions
    const editBtn = document.createElement('button');
    editBtn.classList.add('edit');
    const delBtn = document.createElement('button');
    delBtn.classList.add('delete');
    // the buttons need to have some names on them
    editBtn.innerHTML = 'Edit';
    delBtn.innerHTML = 'Delete';
    // now let's put the action btns inside the div
    listActions.appendChild(editBtn);
    listActions.appendChild(delBtn);

    // now let's hold the div.list-item created and put the 3 parts in it
    // everything is still in memory, remmeber
    listItem.appendChild(label);
    listItem.appendChild(todoContent);
    listItem.appendChild(listActions);

    // now let's attack the UI itself
    // hold the existing div.list and put the div.list-item in it
    // it should render on the screen now
    list.appendChild(listItem);

    // now everything is rendered onto the screen the way we want it
    // but we need to add the functionality
    // the checkbox input, what happens when it's clicked
    // we want it to show that the todo is completed
    // gray out the text and strikethrough
    // that has already been defined by a class of .done
    // so we add or remove it to this todo to effect the UI
    // but it must match the checked or unchecked state of the checkbox
    // so the todo.done state is tied to the e.target.checked state
    // by default it's false but when the checkbox is checked, it takes the e.target.checked state
    input.addEventListener('click', (e) => {
      todo.done = e.target.checked;
      // the moment it's  changed, we update the local storage
      localStorage.setItem('theTaskList', JSON.stringify(todos));

      // this logic is not in normal execution flow
      // it is hiding behind the click event
      // so when the click event happens, we check and update the element as needed
      if (todo.done) {
        listItem.classList.add('done');
      } else {
        listItem.classList.remove('done');
      }

      // after the click event, re-render and update the UI
      displayTodos();
    });

    // what about the edit action button, what happens when it is clicked?
    // we want to focus on that input field and edit the text in it
    editBtn.addEventListener('click', (e) => {
      // you remember we rendered the div.todo-content on the screen with the input element in it
      // let's grab that input inside of it
      const input = todoContent.querySelector('input');
      // first remove the readonly attribute to make the field editable
      input.removeAttribute('readonly');
      // when the readonly is removed, we want the window to auto focus on the input field
      // without this focus, you'd be required to click in it before you can edit. improve the UX for the user please
      input.focus();

      // whiles the edit is going on, it still listens for a click event outside the focus area
      // yes, blur event is the opposite of the focus event
      input.addEventListener('blur', (e) => {
        // readonly is added back
        input.setAttribute('readonly', 'true');
        // and the content now becomes the target's current value
        todo.content = e.target.value;
        // update the local storage of the new change
        localStorage.setItem('theTaskList', JSON.stringify(todos));
        // then re-render again
        displayTodos();
      });

      // or it listens for a keypress. and the key must be the enter key
      input.addEventListener('keypress', (e) => {
        // check if key is the enter key
        if (e.key === 'Enter') {
          input.setAttribute('readonly', 'true');
          todo.content = e.target.value;
          localStorage.setItem('theTaskList', JSON.stringify(todos));
          displayTodos();
        }
      });
    });

    // what about the delete button?
    // when it's clicked we want to remove the current todo that was clicked from the list
    // so we use filter
    delBtn.addEventListener('click', (e) => {
      // when it detects the click, we want to filter through the array and return everything that goes through
      // so if the t does not match the clicked todo(the one we want gone), then return it
      // the one that matches does not match the check so it does not pass
      // the new array is given to todos again
      todos = todos.filter((t) => t != todo);
      // update in local storage
      localStorage.setItem('theTaskList', JSON.stringify(todos));
      // then re-rendered
      displayTodos();

      // don't forget on re-render, only the codes in normal execution flow are rendered. the ones behind the event listeners are skipped till those events occur again

      // and anytime this todo is updated, it is updated in the todos array as well

      // this ensures that at any point in time, the todos array holds the current state of all the todos
    });
  });
}
