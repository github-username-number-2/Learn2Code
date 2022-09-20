export default {
	info: {
		display: "Events & Event Listeners",
	},
	actionString: `
In this tutorial you will learn the basics of events, event listeners and detecting user input.

---

Whenever you click a button, press a key, move the mouse, when an image loads, etc., an event is dispatched. To capture these events, are event listeners.

---

There are many different events that can occur, but some common ones are:
	1. \`click\`/\`MouseEvent\`: This event fires when the user presses and releases the mouse over an element.
	2. \`mousedown\`/\`MouseEvent\`: This event fires immediately when the user presses down on the mouse over an element.
	3. \`mouseup\`/\`MouseEvent\`: This event fires immediately when the user releases the mouse over an element.
	4. \`keydown\`/\`KeyboardEvent\`: This event fires immediately when the user presses down on a key. It is dispatched onto whatever element has focus (usually just the last element that has been clicked).
	5. \`keyup\`/\`KeyboardEvent\`: This event is the same as \`keydown\`, but fires when the user releases a key.
	6. \`load\`/\`Event\`: This event is fired when an element is done loading. This could be an image, an embedded webpage (the iframe element), or the page itself.
	7. \`error\`/\`UIEvent\`: This event is fired when a JavaScript error occurs, when an element has an error loading, when an IndexedDB database error occurs, etc.

---

The index.html file is already set up with a button element. Write the following code into main.js:
<text/javascript
var button = document.getElementById(“button”);
button.onclick = function () {
	alert(“button clicked”);
};
>
This code listens for the click event on the button element, and creates an alert when the button is clicked.

<{c s main.js
var button = document.getElementById(“button”);
button.onclick = function () {
	alert(“button clicked”);
};
}>

---

Click run.
>>>

---

Clicking the button runs the event handler assigned to \`button.onclick\`, and an alert is created.

An event handler is the function that is run when the event fires. Event handlers are attached to specific elements. \`elementVariable.onclick = function () {...}\` is an example of attaching an \`onclick\` handler to the element stored in \`elementVariable\`.

Creating an event listener is just attaching an event handler to an element.

Delete the code in main.js and write the following:
<text/javascript
var input = document.getElementById(“input”);
input.onkeydown = function (keyEvent) {
	alert(“key pressed: ” + keyEvent.key);
};
input.onkeyup = function (keyEvent) {
	alert(“key released: ” + keyEvent.key);
};
>
Now when you click the input and type something, an alert is created displaying the key that you pressed.

<{c s main.js
var input = document.getElementById(“input”);
input.onkeydown = function (keyEvent) {
	alert(“key pressed: ” + keyEvent.key);
};
input.onkeyup = function (keyEvent) {
	alert(“key released: ” + keyEvent.key);
};
}>

---

The previous code makes use of the \`key\` property on the \`event\` object. Whenever an event is fired, not only is the handler run, but the event object is passed to the handler.

---

The event object can contain important information, in this case it is a \`KeyboardEvent\` type, so it contains the key that was pressed (\`event.key\`), whether or not the shift (\`event.shiftKey\`), alt (\`event.altKey\`), or ctrl (\`event.ctrlKey\`) keys were being pressed at the same time, or if the key is being auto-repeated (\`event.repeat\`), and some others.

---

Different types of events will pass different types of event objects to the handler, and different types of event objects will contain different data. The \`MouseEvent\` object, triggered by the click event for example contains the X and Y positions of the click, while the regular \`Event\`, or \`KeyboardEvent\` objects do not.

---

Creating event listeners is simple:

To listen for a click event on a button:
<text/javascript
buttonElement.onclick = function () {
	... code to execute ...
};
>
To listen for a keydown event on an input:
<text/javascript
inputElement.onkeydown = function (eventObject) {
	... code to execute ...
};
>
To listen for a load event on an image:
<text/javascript
imageElement.onload = function () {
	... code to execute ...
};
>
As you can see, to attach different handlers, all that is needed is to prefix the event name with “on”. Because of the flexibility of function parameters, you can choose not to include the event parameter if you are not using it to save space and increase readability, like in the 1st and 3rd examples.

---

This was a basic explanation of events and event listeners. There are more complex features of event handling, like event bubbling/propagation, element focus, and dispatching custom events.
`,
};