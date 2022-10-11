export default {
	info: {
		display: "Introduction To Variables",
	},
	actionString: `
{
"index.html": ["<!DOCTYPE html>\\n<html>\\n<head>\\n</head>\\n<body>\\n <script src=\\"main.js\\"></script>\\n</body>\\n</html>", "utf-8"],
"main.js": ["", "utf-8"]
}

---

This tutorial will cover what variables are, why they are used and how to create them.

---

Programs use variables to store data. As the name suggests, variables can be modified and changed to store new data. For example:
<[text/javascript
var variable = 1;
variable = 2;
variable = 3;
variable = 4;
variable = "some text...";
]>

---

Variables can also be used in expressions to access their data:
<[text/javascript
var numberVariable = 2;

// alerts 2
alert(numberVariable);

// alerts 6
alert(numberVariable + 4);

// alerts 1
alert(numberVariable / 2);

// numberVariable is set to itself squared, in this case 4
numberVariable = numberVariable * numberVariable;
]>

---

Before variables can be used, they need to be declared. One way to do this is with the \`var\` keyword:
<[text/javascript
var variableName = variableValue;
]>

\`variableName\` should be the identifier for the variable and \`variableValue\` should be an expression that will be the value of the variable.
<[text/javascript
// an example of a variable whose value is the result of an expression
var dateString = "The date is:  " + Date();
]>

---

Variable names can contain numbers, letters, underscores and dollar signs, but can't start with a number, and can't contain any reserved words:
<[text/javascript
// valid variable names
var x;
var _$123abc;


// invalid variable names, will cause an error
var 123;
var abcd@efg;
var var;
var function;
]>

---

As you may have noticed from the previous example, the variables were not given any value when they were declared. This is because when a variable is declared with \`var\` it does not have to be given a value. Until it is given a value it will be undefined:
<[text/javascript
var t;

// alerts undefined
alert(t);
]>

---

When a variable is given a value, this is known as initializing the variable:
<[text/javascript
// declaration without initialization
var x;
]>
<[text/javascript
// declaration with initialization
var x = 0;
]>


---

In main.js, declare a variable and initialize it to a function, then alert the result of the function as shown:
<[text/javascript
var add = function (n1, n2) {
return n1 + n2;
};

alert(add(3, 8));
alert(add(-9, 1.1));
alert(add(0, 2));
]>

<{c s main.js
var add = function (n1, n2) {
  return n1 + n2;
};

alert(add(3, 8));
alert(add(-9, 1.1));
alert(add(0, 2));
}>

---

Currently, the 2 other methods of declaring variables are \`let\` and \`const\`, and these will be discussed in a later tutorial.
`,
};