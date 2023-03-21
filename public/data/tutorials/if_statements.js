export default{info:{display:"if Statements"},actionString:`
{
  "index.html": ["<!DOCTYPE html>\\n<html>\\n<head>\\n</head>\\n<body>\\n <script src=\\"main.js\\"></script>\\n</body>\\n</html>", "utf-8"],
  "main.js": ["", "utf-8"]
}

---

\`if\` statements are a major component of JavaScript, allowing different code to be run based on differing circumstances. In this tutorial, you will learn how \`if\` statements work and how to use them in your code.

---

\`if\` statements are created using the \`if\` keyword and parentheses. Between the parentheses should be an expression, called the condition.

If this condition is truthy, the next statement directly after the parentheses will be executed. If the condition is falsy the following statement will be skipped over. A code block (\`{ }\`) is often used to combine multiple statements together.

---

The purpose of \`if\` statements is to execute different code based on a value. For example, a program may need to detect whether or not the user is connected to the internet. Write the following code in main.js:
<[text/javascript
if (navigator.onLine) {
  alert("You are connected to the internet.");
}
]>

<{c s main.js
if (navigator.onLine) {
  alert("You are connected to the internet.");
}
}>

---

Click the run button. You may also disconnect from the internet, reload the page and see that the alert is never shown.
>>>

---

The \`if\` keyword can also be combined with the \`else\` keyword to form an \`if else\` statement. The \`else\` portion will only execute if the condition is falsy. Convert your code to an \`if else\` statement as shown:
<[text/javascript
if (navigator.onLine) {
  alert("You are connected to the internet.");
} else {
  alert("You are not connected to the internet.");
}
]>

<{c s main.js
if (navigator.onLine) {
  alert("You are connected to the internet.");
} else {
  alert("You are not connected to the internet.");
}
}>

---

Click the run button.
>>>

---

There are also \`if else-if\` and \`if else-if else\` statements. \`if-else\` can be chained as many times as necessary:
<[text/javascript
if (condition1) {
  alert("condition1 is truthy");
} else if (condition2) {
  alert("condition1 is falsy and condition2 is truthy");
} else if (condition3) {
  alert("condition1 and condition2 are both falsy and condition3 is truthy");
} else {
  alert("condition1, condition2 and condition3 are all falsy");
}
]>

---

As you may have noticed, \`if\` statements do not check if values are \`true\` or \`false\`. They instead check whether or not values are truthy or falsy.

Truthy and falsy are not data types, but categories for different values. From <a href="https://developer.mozilla.org/en-US/docs/Glossary/Truthy" target="_blank">MDN</a>:
"A truthy value is a value that is considered true when encountered in a Boolean context. All values are truthy unless they are defined as falsy. That is, all values are truthy except false, 0, -0, 0n, "", null, undefined, and NaN."

---

Delete all code in main.js and write the following:
<[text/javascript
var response = prompt("Close tab?");
if (confirm("Close tab?")) {
  window.close();
}
]>

<{c s main.js
var response = prompt("Close tab?");
if (response === "yes" || response === "y") {
  window.close();
}
}>

---

Click the run button.
>>>
`};