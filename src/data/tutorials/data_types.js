export default {
	info: {
		display: "Data Types",
	},
	actionString: `
{
	"index.html": ["<!DOCTYPE html>\\n<html>\\n<head>\\n</head>\\n<body>\\n  <script src=\\"main.js\\"></script>\\n</body>\\n</html>", "utf-8"],
	"main.js": ["// alerts \\"number\\"\\nalert(typeof 1);\\n\\n// alerts \\"object\\"\\nalert(typeof { });\\n\\n// alerts \\"function\\"\\nalert(typeof function () { });", "utf-8"]
}

---

This tutorial will describe data types, what they are, why they are important and using the \`typeof\` operator to determine the data type of a value.

---

In JavaScript, all data has a data type. Data in this case refers to the values stored in variables, values that have been evaluated from expressions, values returned from functions, etc.

This tutorial will cover 5 different primitive data types:
\`undefined\`
\`number\`
\`string\`
\`boolean\`
\`null\`

It will then cover 3 reference types:
\`object\`
\`array\`
\`function\`

---

Variables that are of the primitive data type store the value itself, whereas reference type variables store a reference to a value. Take the following example:
<[text/javascript
var a = 1;
var b = a;
a = 0;

// will still display 1
alert(b);
]>

\`a\` is initialized to 1.
The value of \`a\` is copied to \`b\`.
The value of \`a\` is changed.
An alert is created displaying the value of \`b\`, which is still \`1\`. This is because numbers are primitive types, and the value \`1\` was copied to \`b\`.

---

The direct value of reference type variables is not actually a function, array or object, but instead a reference to that function, array or object:
<[text/javascript
var a = {};
var b = a;
a.someKey = "someValue";

// will display someValue
alert(b.someKey);
]>

\`a\` is initialized to \`{}\`.
The value of \`a\` is copied to \`b\`. In this case the value is not the empty object itself, but instead a reference to that object. Therefore, there is only 1 object and \`a\` and \`b\` both reference that same object.
A value of the object referenced by \`a\` is changed.
An alert is created displaying the value of \`b.someKey\`, which is "someValue". This is because objects are reference types. \`var b = a\` makes \`b\` refer to the same object that \`a\` does.

---

Anything stored in a variable, anything returned from a function, evaluated from an expression, etc., has a data type.

Some common primitive types are:
\`undefined\` | \`undefined\` is the default value for variables that are not given a value, functions that do not return anything, and in general is just used to represent the absence of a value.
\`number\` | This can be any number, such as \`1\`, \`9009\` or \`-2.555\`. \`1,000,000\` would be invalid syntax, because numbers never contain commas.
\`string\` | A string is a group of characters. They can be created using \`"some string value"\` or \`'some string value'\`.
\`boolean\` | There are only 2 possible values within the boolean data type, \`true\` and \`false\`.
\`null\` | \`null\` is similar to \`undefined\`, in the fact that it is usually used to represent the absence of any value.

Some common reference types are:
\`object\` | An object is a data type that has properties that can be modified. Technically, all other reference types are objects. Objects can be created with \`{}\`.
\`array\` | An array is a list of values. These can be anything from numbers to functions and even arrays themselves. Arrays can be created using \`[1, "some other value", [], ... as many more values as needed ...]\`.
\`function\` | Similar to a mathematical function, this is a set of code that can be used to calculate a value based on an input, or perform some action in another way.

---

If this data type ever needs to be determined, this can be done with the \`typeof\` operator:
<[text/javascript
// alerts "number"
alert(typeof 1);

// alerts "object"
alert(typeof { });

// alerts "function"
alert(typeof function () { });
]>

---

Click the run button.
>>>
`,
};