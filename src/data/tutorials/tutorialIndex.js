export default {
	entryPoint: "hello_world",
	tutorialList: {
		hello_world: {
			display: "Hello World",
			prerequisites: null,
		},
		html_hello_world: {
			display: "HTML Hello World",
			prerequisites: ["hello_world"],
		},
		html_basic_syntax: {
			display: "HTML Basic Syntax",
			prerequisites: ["html_hello_world"],
		},

		// incomplete
		events_and_event_listeners: {
			display: "Events & Event Listeners",
			prerequisites: [],
		},
		setTimeout_setInterval: {
			display: "setTimeout and setInterval",
			prerequisites: [],
		},
	},
};