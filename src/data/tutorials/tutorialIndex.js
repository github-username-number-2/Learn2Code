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
			description: ``,
			left: 14,
			top: 30,
			prerequisites: ["hello_world"],
			relatedLinks: [
				"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference",
				"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Lexical_grammar",
			],
		},

		// incomplete
		events_and_event_listeners: {
			display: "Events & Event Listeners",
			description: ``,
			left: 14,
			top: 90,
			prerequisites: [],
			relatedLinks: [],
		},
		setTimeout_setInterval: {
			display: "setTimeout and setInterval",
			description: ``,
			left: 40,
			top: 90,
			prerequisites: [],
			relatedLinks: [],
		},
		pong: {
			display: "Pong",
			description: ``,
			left: 28,
			top: 60,
			prerequisites: [],
			relatedLinks: [],
		},
	},
};