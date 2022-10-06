export default {
	info: {
		display: "DOM Manipulation",
	},
	actionString: `
{}

---

By the end of this tutorial, you should know the basics of CSS, including the overall syntax, selecting elements, and styling elements.

---

CSS stands for <b>Cascading StyleSheets</b> and it is used for adding styles to HTML elements. Styles refer to the CSS rules that apply to an element.

For example, the following code will select all \`h1\` elements, set its position to be centered, set the font size of to 60 pixels, and change the color to red (\`#ff0000\` in hex):
<[text/css
h1 {
  text-align: center;
  font-size: 60px;
  color: #ff0000;
}
]>

---

CSS can be written within HTML \`style\` tags:
<[text/html
<style>
  #buttonElement {
    width: 10vw;
  }
</style>
]>

Or you can link external CSS files:
<[text/html
<link rel="stylesheet" href="path/to/file.css">
]>

Both the link and style tags should be placed within the head tags.

---

Set up a new HTML document and write a link to a CSS file named main.css:
<[text/html
<!DOCTYPE html>

<html>

<head>
  <link rel="stylesheet" href="main.css">
</head>

<body>
</body>

</html>
]>

<{c s index.html
<!DOCTYPE html>

<html>

<head>
  <link rel="stylesheet" href="main.css">
</head>

<body>
</body>

</html>
}>

---

Add a button and image element:
<[text/html
<!DOCTYPE html>

<html>

<head>
  <link rel="stylesheet" href="main.css">
</head>

<body>
  <button id="buttonElement">button text</button>
  <img id="imageElement" src="image.png">
</body>

</html>
]>

<{c i index.html 9 0 \n
  <button id="buttonElement">button text</button>
  <img id="imageElement" src="image.png">
}>

---

Click the run button.
>>>

---

As you can see, the button and image elements both have the \`id\` attribute:
<[text/html
<button id="buttonElement">button text</button>
<img id="imageElement" src="image.png">
]>

The \`id\` attribute is used to identify elements with a custom name. In this case the names are \`buttonElement\` and \`imageElement\`. IDs are unique; no 2 elements should share the same ID.

---

Create a file named "main.css"
<c f
main.css
}>

---
In CSS, elements can be selected by their IDs using \`#\` followed by the ID.

In main.css, write the following code:
<[text/css
#buttonElement {
  width: 300px;
  height: 300px;
  font-size: 80px;
}
]>

<{c s main.css
#buttonElement {
  width: 300px;
  height: 300px;
  font-size: 80px;
}
}>

---

Click the run button.

The button should now be a 300 pixel square with a larger font size as well.
>>>

---

To position elements, one method is to use absolute positioning. Positioning an element with absolute positions will put it at a specific point on the screen, regardless of other elements. With absolute positioning it is possible to have overlapping elements.

Add the \`position\`, \`left\`, and \`top\` styles to the button element as shown:
<[text/css
#buttonElement {
  position: absolute;
  left: 400px;
  top: 200px;
  width: 300px;
  height: 300px;
  font-size: 80px;
}
]>

<{c i main.css 1 0 \n
  position: absolute;
  left: 400px;
  top: 200px;
}>

The \`left\` and \`top\` styles will set an element's position from the left of the screen and the top of the screen, respectively. Positions can also be set from the right of the screen and the bottom of the screen using \`right\` and \`top\`.

---

Click the run button.

The button should now be 400 pixels from the top of the screen and 200 pixels from the left of the screen.
>>>

---

To select groups of elements, classes are used. Unlike IDs, classes do not have to be unique.

The \`class\` attribute is used to add an element to a class. Add the image and button elements to the \`square\` class:
<[text/html
<!DOCTYPE html>

<html>

<head>
  <link rel="stylesheet" href="main.css">
</head>

<body>
  <button id="buttonElement" class="square">button text</button>
  <img id="imageElement" class="square" src="image.png">
</body>

</html>
]>

<{c i index.html 9 2 \n
  <button id="buttonElement" class="square">button text</button>
  <img id="imageElement" class="square" src="image.png">
}>

---

To select elements from a class, use \`.\` followed by the class name.

Remove the \`width\` and \`height\` styles from the button and add them to the square class. The file should then look like this:
<[text/css
#buttonElement {
  position: absolute;
  left: 400px;
  top: 200px;
  font-size: 80px;
}

.square {
  width: 300px;
  height: 300px;
}
]>

<{c s main.css
#buttonElement {
  position: absolute;
  left: 400px;
  top: 200px;
  font-size: 80px;
}

.square {
  width: 300px;
  height: 300px;
}
}>

---

Run your code.

Both the button and the image should now be sized to 300 by 300 pixels.
>>>
  `,
};