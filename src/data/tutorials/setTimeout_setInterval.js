export default {
	info: {
		display: "setTimeout and setInterval",
	},
	actionString: `
{
	"index.html": ["<!DOCTYPE html>\\n<html>\\n<head>\\n</head>\\n<body>\\n  <script src=\\"main.js\\"></script>\\n</body>\\n</html>", "utf-8"],
	"main.js": ["", "utf-8"]
}

---

In this tutorial you will learn about the \`setTimeout\` and \`setInterval\` functions.

---

\`setTimeout\` is used to run a function after x milliseconds, and \`setInterval\` is used to run a function every x milliseconds, x being the amount of time you choose. The function will run once with \`setTimeout\`, and with \`setInterval\`, will run over and over until you clear (cancel) the interval.

---

The \`setTimeout\` function takes 2 parameters:

1. The function to run
2. The number of milliseconds to wait

Write the following code in the "main.js" file:
<[text/javascript
setTimeout(function () {
  alert();
}, 3000);
]>
This code will create an \`alert\` box after 3 seconds, or 3000 milliseconds.

<{c s main.js
setTimeout(function () {
  alert();
}, 3000);
}>

---

Click the run button.
>>>

---

The \`setInterval\` function takes 2 parameters:

1. The function to run
2. The number of milliseconds to wait at the start and in between each function

Change your code to this:
<[text/javascript
setInterval(function () {
  alert();
}, 3000);
]>

<{c s main.js
setInterval(function () {
  alert();
}, 3000);
}>

---

Click the run button.
>>>

---

As you can see, the code waits for 3 seconds, runs, waits for 3 seconds, and runs again. This will be done continuously until the interval is cleared.

---

Clearing a timeout/interval will cancel it. Clearing a timeout/interval that has already been cleared will have no effect. This is all done using the \`clearTimeout\` or \`clearInterval\` functions.

They each take 1 parameter. \`clearTimeout\` takes the timeout ID and \`clearInterval\` takes the interval ID.

These IDs are numbers that start at 1, and increment every time \`setTimeout\` or \`setInterval\` is called.

Delete the code in main.js and write the following example:
<[text/javascript
var intervalID = setInterval(function () {}, 1000);
alert(intervalID);

var timeoutID = setTimeout(function () {}, 1000);
alert(timeoutID);

var intervalID2 = setInterval(function () {}, 1000);
alert(intervalID2);
]>
As you can see, the ID is the return value of calling either function.

<{c s main.js
var intervalID = setInterval(function () {}, 1000);
alert(intervalID);

var timeoutID = setTimeout(function () {}, 1000);
alert(timeoutID);

var intervalID2 = setInterval(function () {}, 1000);
alert(intervalID2);
}>

---

Click the run button.
>>>

---
To use the clear function, pass the ID of the timeout/interval you want to clear.

Delete the code in main.js and write the following example:
<[text/javascript
var timeoutID = setTimeout(function () {
  alert("This timeout has been cleared");
}, 1000);

clearTimeout(timeoutID);

var intervalID = setInterval(function () {
  if (confirm("Clear the interval?")) {
    clearInterval(intervalID);
  }
}, 5000);
]>

<{c s main.js
var timeoutID = setTimeout(function () {
  alert("This timeout has been cleared");
}, 1000);

clearTimeout(timeoutID);

var intervalID = setInterval(function () {
  if (confirm("Clear the interval?")) {
    clearInterval(intervalID);
  }
}, 5000);
}>

---

Click the run button.
>>>

---

First, notice that the timeout function never runs, because it is cleared immediately. Then the interval function runs every 5 seconds and creates a popup each time.

If the confirm button is canceled, the interval keeps running. Otherwise, the interval is canceled.
`,
};