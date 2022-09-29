export default {
	tutorialList: {
		hello_world: {
			display: "Hello World",
			left: 0,
			top: 0,
			prerequisites: [],
		},
		html_hello_world: {
			display: "HTML Hello World",
			left: -14,
			top: 30,
			prerequisites: ["hello_world"],
		},
		html_basic_syntax: {
			display: "HTML Basic Syntax",
			left: -14,
			top: 60,
			prerequisites: ["html_hello_world"],
		},
		javascript_basic_syntax: {
			display: "JavaScript Basic Syntax",
			left: 14,
			top: 30,
			prerequisites: ["hello_world"],
		},

		// incomplete
		events_and_event_listeners: {
			display: "Events & Event Listeners",
			left: 14,
			top: 90,
			prerequisites: [],
		},
		setTimeout_setInterval: {
			display: "setTimeout and setInterval",
			left: 40,
			top: 90,
			prerequisites: [],
		},
		pong: {
			display: "Pong",
			left: 28,
			top: 60,
			prerequisites: [],
		},
	},
};