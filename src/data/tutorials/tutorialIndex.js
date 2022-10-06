export default {
	tutorialList: {
		hello_world: {
			display: "Hello World",
			description: `A Hello World program is simply a program that outputs the message "Hello World." By tradition, it is usually the first program that is taught to beginners to a language or programming as a whole.`,
			left: 0,
			top: 0,
			prerequisites: [],
			relatedLinks: [
				"https://developer.mozilla.org/en-US/docs/Web/API/Window/alert",
				"https://developer.mozilla.org/en-US/docs/Web/JavaScript",
			],
		},
		html_hello_world: {
			display: "HTML Hello World",
			description: `HTML stands for HyperText Markup Language and it is the standard markup language for websites. It is currently in version 5, which is why you will often see it referred to as HTML5. Its sole purpose is to put things on the screen so they can then be modified and interacted with by CSS and JavaScript.`,
			left: -14,
			top: 30,
			prerequisites: ["hello_world"],
			relatedLinks: [
				"https://developer.mozilla.org/en-US/docs/Web/HTML",
				"https://developer.mozilla.org/en-US/docs/Learn/HTML/Introduction_to_HTML",
				"https://developer.mozilla.org/en-US/docs/Web/HTML/Element",
			],
		},
		html_basic_syntax: {
			display: "HTML Basic Syntax",
			description: `Being a markup language rather than a programming language, HTML's syntax is very simple. Consisting of only tags and the DOCTYPE declaration, HTML is considered a great starting point for beginners.`,
			left: -14,
			top: 60,
			prerequisites: ["html_hello_world"],
			relatedLinks: [
				"https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/HTML_basics",
			],
		},
		javascript_basic_syntax: {
			display: "JavaScript Basic Syntax",
			description: `To add functionality to websites, the JavaScript programming language (not the same as Java) is used. The most important thing to do when learning a new language is to learn its syntax. Relative to HTML or CSS, the syntax of JavaScript is much more complex, and unlike HTML and CSS, errors will happen if the syntax is wrong.`,
			left: 14,
			top: 30,
			prerequisites: ["hello_world"],
			relatedLinks: [
				"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference",
				"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Lexical_grammar",
			],
		},

		// incomplete
		dom_manipulation: {
			display: "DOM Manipulation",
			description: ``,
			left: 60,
			top: 0,
			prerequisites: [],
			relatedLinks: [
			],
		},
		events_and_event_listeners: {
			display: "Events & Event Listeners",
			description: `Events happen when the user interacts with a webpage, something loads, an error happens, etc. Event listeners allow JavaScript programs to capture those events and make decisions based on their properties.`,
			left: 14,
			top: 90,
			prerequisites: [],
			relatedLinks: [
				"https://developer.mozilla.org/en-US/docs/Web/API/Event",
				"https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Events",
				"https://developer.mozilla.org/en-US/docs/Web/Events",
			],
		},
		setTimeout_setInterval: {
			display: "setTimeout and setInterval",
			description: `In certain cases, a program may need to wait a certain amount of time before executing code. To do this, are the setTimeout and setInterval functions. setTimeout will add a delay before executing code, while setInterval runs code over and over with a delay in between.`,
			left: 40,
			top: 90,
			prerequisites: [],
			relatedLinks: [
				"https://developer.mozilla.org/en-US/docs/Web/API/setTimeout",
				"https://developer.mozilla.org/en-US/docs/Web/API/setInterval",
			],
		},
		pong: {
			display: "Pong",
			description: `Pong is a tennis based game released in 1972 by Atari. Originally Pong was not programmed, but instead built using physical electronic logic gates. Although it could seem simple on the surface, programming Pong will require all of the knowledge described in the previous tutorials.`,
			left: 28,
			top: 120,
			prerequisites: ["events_and_event_listeners", "setTimeout_setInterval"],
			relatedLinks: [
				"https://developer.mozilla.org/en-US/docs/Games/Introduction",
			],
		},
	},
};