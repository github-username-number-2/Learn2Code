export default {
	info: {
		display: "JavaScript Basic Syntax",
	},
	actionString: `
{
	"index.html": ["<!DOCTYPE html>\\n<html>\\n<head>\\n</head>\\n<body>\\n  <script src=\\"main.js\\"></script>\\n</body>\\n</html>", "utf-8"],
	"main.js": ["if (true) {\\n  alert(\\"1\\");\\n  alert(\\"test\\");\\n  alert(\\"/*this is within a string and is therefore not a comment*/\\");\\n}", "utf-8"]
}

---

This tutorial will cover the basics of JavaScript syntax.

---

JavaScript code is made up of statements and comments.

Example:
<[text/javascript
var x = 20;
for (var i = 0; i < 10; i++) {
	alert(i + x);
}
]>

This code is made up of 3 statements, 3 keywords, 3 operators and 1 code block.

---

Statements are usually separated by semicolons, but the browser will automatically insert semicolons when needed, in most cases. Therefore, the following pieces of code are functionally identical:
<[text/javascript
var x = 1
alert(x)
]>

<[text/javascript
var x = 1;
alert(x);
]>

2 semicolons with nothing between them (\`;;\`) will form an empty statement that does nothing.

---

Comments can be used for describing the functionality of code, disabling code temporarily, etc. Comments are removed before the program runs, so they usually have no effect on the actual execution of the program.

---

JavaScript has single line, multiline, and hashbang comments.

Single line comments are created with \`//\`. Everything on the same line after the \`//\` is considered a comment.

The following will alert a 2 because the first line is never run:
<[text/javascript
//var x = 1;
var x = 2;
alert(x);//comments can also be placed at the end of lines
]>

---

Multiline comments are created with \`/*\` and \`*/\`. Everything in between is considered a comment.

Although multiline comments can span over multiple lines, they do not have to, as shown in the following example:
<[text/javascript
if (true) {
	/*multiline comment*/
}
]>

Multiline comments can be placed anywhere a space can. So, you can think of multiline comments as counting as a space when replaced.

This is allowed:
<[text/javascript
if (true/*comment*/) { }
]>
And this is not:
<[text/javascript
if (tr/*comment*/ue) { }
]>

---

Hashbang comments are meant to be used server side, but are available client side anyway although rarely used.

They are like single line comments except they are denoted with \`#!\` and have to be placed at the absolute beginning of the file. No spaces, new lines, or any other character can come before a hashbang comment.

<[text/javascript
#!hashbang comment
]>

---

Write a few comments in main.js as shown:
<[text/javascript
if (true) {
	//alert("1");
	alert(/*"test"*/);
	alert("/*this is within a string and is therefore not a comment*/");
}
]>

<{c s main.js
if (true) {
	//alert("1");
	alert(/*"test"*/);
	alert("/*this is within a string and is therefore not a comment*/");
}
}>

---

Click the run button.
>>>

---

After comments are removed, all that is left are statements.

Statements can be made of either keywords, expressions, code blocks, or a combination of the three. Examples of keywords are:

\`for\` | Create a for loop

\`var\` | Declare a variable

\`while\` | Create a while loop

\`throw\` | Throw an error

\`import\` | Import data from another script

---

Code blocks combine multiple lines of code into a single statement, and are denoted with \`{ }\`.

The \`if\` statement executes the statement that directly follows it, when the condition (the expression between the parenthesis) is truthy:
<[text/javascript
// "alert(2)" is not part of the if statement, and will run automatically regardless of the condition
if (true) alert(1); alert(2);
]>

To execute multiple statements, you would use a code block:
<[text/javascript
if (true) {
	// both alerts will now run if the condition it truthy
	alert(1);
	alert(2);
}
]>

This is the same with \`for\` loops, \`while\` loops, and many other types of statements as well.

Because the need to execute multiple statements is so common, the misconception arises that the code block is actually part of the \`if\` statement, the \`for\` loop, the \`while\` loop, etc.

---

But not all curly braces are code blocks. For example, the curly braces in a \`switch\` statement are part of the statement itself:
<[text/javascript
// a syntax error is thrown, because the { } are required
switch (true)

// no error
switch (true) {
	case true:
		alert();
		break;
}
]>

---

Code blocks do not require semicolons to separate them from other statements:
<[text/javascript
while (true) {

}alert(1);
// no error occurs
]>

---

The final component to statements are expressions.

A statement made up of only 1 expression is known as an expression statement.

An expression is made up of a combination of operators, operands and other expressions. Some important operators are:

\`operand && operand\` | Evaluate to \`true\` if both sides are truthy else evaluate to \`false\`

\`operand || operand\` | Evaluate to the first operand if that side is truthy else evaluate to the second operand

\`variableOperand = valueOperand\` | Assign a value to a variable and evaluate to the assigned value

\`operand == operand\` | Check if both sides are of same value and evaluate to \`true\`/\`false\` (\`1 == "1"\` is \`true\`)

\`operand === operand\` | Check if both sides are of same value and type and evaluate to \`true\`/\`false\` (\`1 === "1"\` is \`false\` but \`1 === 1\` is \`true\`)

\`objectOperand.propertyOperand\` | Select a property of an object

\`operand + operand\` | Add 2 numbers or combine 2 strings

\`operand - operand\` | Subtract 2 numbers

\`operand * operand\` | Multiply 2 numbers

\`operand / operand\` | Divide 2 numbers

\`operand < operand\` | Evaluate to \`true\` if the first operand is less than the second, else \`false\`

\`operand > operand\` | Evaluate to \`true\` if the second operand is less than the first, else \`false\`

\`operand <= operand\` | Evaluate to \`true\` if the first operand is less than or equal to the second (same value), else \`false\`

\`operand >= operand\` | Evaluate to \`true\` if the second operand is less than or equal to the first (same value), else \`false\`

\`operand <== operand\` | Evaluate to \`true\` if the first operand is less than or equal to the second (same value and type), else \`false\`

\`operand >== operand\` | Evaluate to \`true\` if the second operand is less than or equal to the first (same value and type), else \`false\`

---

Operands are the values that are utilized by operators.

Operands can be variables, data types such as numbers, strings, booleans, or functions, and the results of other operators.

Example:
<[text/javascript
var x = 'some string';
(6 + 6 == 12 || x.length >= 10) && typeof false === "boolean";
]>

---

Like in mathematics, there is operator precedence, meaning that operators with higher precedence will be evaluated before others. Also as in mathematics, you can use parentheses to evaluate parts of expressions first:
<[text/javascript
// usually multiplication would be evaluated first, but parenthesis cause addition to be evaluated first

// alerts 300
alert((1 + 2) * 100);

// alerts 201
alert(1 + 2 * 100);
]>

---

A table displaying operator precedence can be found here:

<a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Operator_Precedence#table" target="_blank">https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Operator_Precedence#table</a>

---

When parts of an expression are evaluated, you can think of that part as being replaced with the value.

So when the browser is evaluating an expression, the process can be visualized like this:
<[text/javascript
var x = 'some string';

// initial expression
(6 + 6 == 12 || x.length >= 10) && typeof false === "boolean";

// evaluated the "." and x had a length of 11
(6 + 6 == 12 || 11 >= 10) && typeof false === "boolean";

// evaluated the "+"
(12 == 12 || 11 >= 10) && typeof false === "boolean";

// evaluated the ">="
(12 == 12 || true) && typeof false === "boolean";

// evaluated the "=="
(true || true) && typeof false === "boolean";

// evaluated the "||"
true && typeof false === "boolean";

// evaluated the "typeof"
true && "boolean" === "boolean";

// evaluated the "==="
true && true;

// evaluated the "&&" and the expression is true overall
true;
]>

---

So, looking back at the first piece of code you should now be able to roughly break it up into its components:
<[text/javascript
// "var x =" is a declaration created by the var keyword
// note that the "=" is not the "=" operator in this context; it is part of declaration
// 20 is an expression
var x = 20;

/*
	this statement is created with a for loop:
	for ()

	and a code block:
	{ }

	within the for loop is 1 declaration (var i = 0) and 2 expressions (i < 10 and i++)
	note that the ++ operator is a separate operator and is not a combination of 2 + operators
*/
for (var i = 0; i < 10; i++) {
	// there is a single expression statement inside the code block
	alert(i + x);
}
]>

As you may see, it is debatable how many total expressions there are, because different parts of expressions can be considered expressions themselves. (You could say \`alert(i + x)\` contains the expression \`i + x\`.)

Additionally, it could be argued that there are only 2 statements total rather than 3, because \`alert(i + x);\` is part of the code block and the code block is part of the for loop, making them all the same statement.

---

Based on all this information, the structure of JavaScript code can be viewed as in the following diagram:

<a href="/data/tutorials/resources/javascript_basic_syntax/syntaxDiagram.png" target="_blank"><img src="/data/tutorials/resources/javascript_basic_syntax/syntaxDiagram.png" style="width: 100%"></a>
`,
};