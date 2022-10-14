export default{info:{display:"Functions"},actionString:`
{
	"index.html": ["<!DOCTYPE html>\\n<html>\\n<head>\\n</head>\\n<body>\\n <script src=\\"main.js\\"></script>\\n</body>\\n</html>", "utf-8"],
	"main.js": ["", "utf-8"]
}

---

Functions are an important part of JavaScript. Like functions in math, JavaScript functions take 0 or more parameters and output a single value.

---

Functions can be created with a function statement or a function expression:
<[text/javascript
// function statement
function functionName (parameter1, parameter2) {
}

// function expression
var functionName = function (parameter1, parameter2) { };
]>

Within the parenthesis are the function's parameters. The names of function parameters have the same limits as variable names, so any valid variable name is a valid parameter name and vice versa.

---

After a function is declared, it can be run by using parenthesis. This is also known as calling a function. Within the parentheses are the function arguments separated by commas.
<[text/javascript
var rectanglePerimeter = getRectanglePerimeter(10, 5);
alert(rectanglePerimeter);

var otherRectanglePerimeter = getRectanglePerimeter(30, 2);
alert(otherRectanglePerimeter);

function getRectanglePerimeter(width, height) {
return width * 2 + height * 2;
}
]>

Parameters are used as variables within the function, while arguments are the values that are passed to the function. In this case the arguments are \`10\` and \`5\` and the parameters are \`width\` and \`height\`. Arguments can change, but parameters can not.

---

Another thing to notice is that the function was used below where it was called. This is due to hoisting, which requires knowledge of the JavaScript interpreter to understand, but on the surface it can be thought of as functions being placed at the top of the current function/file.

For example:
<[text/javascript
var x = y();

function y() { }
]>
Would become:
<[text/javascript
function y() { }

var x = y();
]>
And:
<[text/javascript
function someFunction() {
var x = y();

function y() { }
}
]>
Would become:
<[text/javascript
function someFunction() {
function y() { }

var x = y();
}
]>

Function expressions are not hoisted and will cause an error if they are called before they are created.

---

Write the following code in main.js:
<[text/javascript
alertQuotient(4, 2);
alertQuotient(1.6, 8);
alertQuotient(4, 2 + 2);

function alertQuotient(dividend, divisor) {
var quotient = dividend / divisor;
alert("Result is: " + quotient);
}
]>

<{c s main.js
alertQuotient(4, 2);
alertQuotient(1.6, 8);
alertQuotient(4, 2 + 2);

function alertQuotient(dividend, divisor) {
var quotient = dividend / divisor;
alert("Result is: " + quotient);
}
}>

---

Click the run button.
>>>
`};