import { elementFromString } from "/js/functions.js";

// register service worker
navigator.serviceWorker.register("/sw.js");

// prevents dragging of images and text selection
document.addEventListener("dragstart", event => event.preventDefault());
document.addEventListener("selectstart", event => event.preventDefault());

const mask = document.createElement("div");
mask.id = "mask";
document.body.appendChild(mask);

// clicking logo redirects to home page
document.getElementById("logo").addEventListener("click", () =>
	window.location = window.location.origin
);

// page load function
window.loadPage = () => {
	// if no popups exist
	if (!mask.innerHTML)
		document.getElementById("mask").style.display = "none";

	document.getElementById("saveIcon").addEventListener("click", async () => {
		if (await confirmCustom("Load existing save or create new save?", { confirmText: "Load save file", cancelText: "Create save file" }))
			storageManager.loadFromFile();
		else
			storageManager.saveToFile();
	});
};

// custom alert and prompt functions
!function () {
	window.alertCustom = function (message, options = {}) {
		return new Promise(resolve => {
			const alertElement = createPopupElement(
				`<div class="popup alert">
					<div class="popupHeader"></div>
					<p class="popupText">${message}</p>
					<button class="popupButton">Close</button>
				</div>`,
				options,
			);

			setTimeout(() =>
				alertElement.lastElementChild.addEventListener("click", () => {
					deletePopupElement(alertElement);
					resolve();
				}), 10);
		});
	};

	window.confirmCustom = function (message, options = {}) {
		return new Promise(resolve => {
			const confirmElement = createPopupElement(
				`<div class="popup confirm">
					<div class="popupHeader"></div>
					<p class="popupText">${message}</p>
					<button class="popupButton confirm">${options.confirmText || "Confirm"}</button>
					<button class="popupButton cancel">${options.cancelText || "Cancel"}</button>
				</div>`,
				options,
			);

			setTimeout(() => {
				confirmElement.children[2].addEventListener("click", () => {
					deletePopupElement(confirmElement);
					resolve(true);
				});
				confirmElement.children[3].addEventListener("click", () => {
					deletePopupElement(confirmElement);
					resolve(false);
				});
			}, 10);
		});
	};

	window.promptCustom = function (message, options = {}) {
		return new Promise(resolve => {
			const promptElement = createPopupElement(
				`<div class="popup prompt">
					<div class="popupHeader"></div>
					<p class="popupText">${message}</p>
					<div class="inputContainer">


						<input class="popupInput" value="${options.defaultValue || ""}" maxlength="${options.maxLength || ""}" type="text">
						<button class="popupButton">Confirm</button>
						<button class="popupButton">Cancel</button>
					</div>
				</div>`,
				options,
			);

			setTimeout(() => {
				const inputContainer = promptElement.children[2],
					inputElement = inputContainer.children[0];
				inputElement.addEventListener("keydown", event => {
					if (event.key === "Enter") {
						deletePopupElement(promptElement);
						resolve(inputElement.value);
					}
				});
				inputContainer.children[1].addEventListener("click", () => {
					deletePopupElement(promptElement);
					resolve(inputElement.value);
				});
				inputContainer.children[2].addEventListener("click", () => {
					deletePopupElement(promptElement);
					resolve(null);
				});

				inputElement.focus();
				inputElement.select();
			}, 10);
		});
	};


	function createPopupElement(popupHTML, { left, right, top, bottom, width, height }) {
		// prevents errors
		width, height;

		for (const element of mask.children) element.style.display = "none";

		const popupElement = elementFromString(popupHTML);
		const vw = window.innerWidth / 100,
			vh = window.innerHeight / 100;
		const parameterList = ["left", "right", "top", "bottom", "width", "height"],
			unitList = [vw, vw, vh, vh, vw, vh];
		for (let i = 0; i < 6; i++) {
			const parameterName = parameterList[i],
				value = arguments[1][parameterName];

			if (value) {
				popupElement.style[parameterName] = unitList[i] + value + "px";
			}
		}

		if (left || right) popupElement.style.transform = "none";
		if (top || bottom) popupElement.style.top = "auto";

		mask.appendChild(popupElement);
		mask.style.display = "block";

		initializePopup(popupElement);

		return popupElement;
	}

	function deletePopupElement(popupElement) {
		popupElement.remove();

		if (mask.innerHTML) {
			initializePopup(mask.lastChild);
		} else {
			mask.style.display = "none";
		}
	}

	function initializePopup(popupElement) {
		popupElement.style.display = "block";

		({
			alert: () => popupElement.lastElementChild.focus(),
			confirm: () => popupElement.lastElementChild.focus(),
			prompt: () => popupElement.children[2].focus(),
		})[popupElement.classList[1]]();
	}
}();