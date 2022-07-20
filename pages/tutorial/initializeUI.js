export default function initializeUI(defaultTab) {
	const resizeContainers = (function () {
		let intervals = [], mouseX;
		window.addEventListener("mousemove", event => mouseX = event.pageX);

		const panelContainer = document.getElementById("panelContainer"),
			editorContainer = document.getElementById("editorContainer");

		return {
			_resize: function (xOffset, separatorWidth) {
				// set left and right limiters
				if (mouseX - xOffset < separatorWidth) mouseX = xOffset = 0;
				if (mouseX - xOffset > window.innerWidth - separatorWidth * 2) {
					mouseX = window.innerWidth - separatorWidth;
					xOffset = 0;
				}

				separator.style.left = mouseX - xOffset + "px";
				panelContainer.style.width = mouseX - xOffset + "px";
				editorContainer.style.width = window.innerWidth - mouseX + xOffset - separatorWidth + "px";
			},
			resizeOnce: function () {
				const separatorStyle = getComputedStyle(separator),
					separatorWidth =
						parseInt(separatorStyle.width.slice(0, -2)) +
						parseInt(separatorStyle.borderLeft.slice(0, -2)) +
						parseInt(separatorStyle.borderRight.slice(0, -2));

				const xOffset = separator.getBoundingClientRect().x;

				editorContainer.style.width = window.innerWidth - xOffset - separatorWidth + "px";
			},
			startResize: function (event) {
				separator.children[0].style.backgroundColor = "#595959";

				const separatorStyle = getComputedStyle(separator),
					separatorWidth =
						parseInt(separatorStyle.width.slice(0, -2)) +
						parseInt(separatorStyle.borderLeft.slice(0, -2)) +
						parseInt(separatorStyle.borderRight.slice(0, -2));

				const xOffset = event.pageX - separator.getBoundingClientRect().x;
				intervals.push(setInterval(() => {
					this._resize(xOffset, separatorWidth);
				}, 20));
			},
			stopResize: function () {
				separator.children[0].style.removeProperty("background-color");
				intervals.filter(interval => clearInterval(interval));
			},
		}
	})();


	const separator = document.getElementById("containersSeparator");
	separator.addEventListener("mousedown", event => resizeContainers.startResize(event));
	window.addEventListener("mouseup", () => resizeContainers.stopResize());
	window.addEventListener("resize", () => resizeContainers.resizeOnce());

	for (const tab of document.getElementsByClassName("panelTab")) {
		tab.addEventListener("click",
			event => selectTab(event.target.id.slice(0, -8))
		);
	}

	selectTab(defaultTab);
}

function selectTab(tabName) {
	const tabs = document.getElementsByClassName("panelTab");
	for (const tab of tabs) {
		tab.style.backgroundColor = "#eeeeee";
	}

	const contentContainers = document.getElementsByClassName("panelContent");
	for (const container of contentContainers) {
		container.style.display = "none";
	}

	document.getElementById(tabName + "PanelTab").style.backgroundColor = "#cccccc";
	document.getElementById(tabName + "PanelContent").style.display = "block";
}