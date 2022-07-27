// prevents dragging of images and text selection
document.addEventListener("dragstart", event => event.preventDefault());
document.addEventListener("selectstart", event => event.preventDefault());


const mask = document.createElement("div");
mask.id = "mask";
document.body.appendChild(mask);

// hide mask on page load
window.addEventListener("load", () => document.getElementById("mask").style.display = "none");

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
				}), 100);
		});
	};

	window.confirmCustom = function (message, options = {}) {
		return new Promise(resolve => {
			const confirmElement = createPopupElement(
				`<div class="popup confirm">
					<div class="popupHeader"></div>
					<p class="popupText">${message}</p>
					<button class="popupButton confirm">Confirm</button>
					<button class="popupButton cancel">Cancel</button>
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
			}, 100);
		});
	};

	window.promptCustom = function (message, options = { defaultInputValue: "", maxLength: "" }) {
		return new Promise(resolve => {
			const promptElement = createPopupElement(
				`<div class="popup prompt">
					<div class="popupHeader"></div>
					<p class="popupText">${message}</p>
					<input class="popupInput" value="${options.defaultInputValue}" maxlength="${options.maxLength} type="text">
					<button class="popupButton">Confirm</button>
				</div>`,
				options,
			);

			setTimeout(() => {
				promptElement.children[2].addEventListener("keydown", event => {
					if (event.key === "Enter") {
						const response = promptElement.children[2].value;

						deletePopupElement(promptElement);
						resolve(response);
					}
				});
				promptElement.lastElementChild.addEventListener("click", () => {
					const response = promptElement.children[2].value;

					deletePopupElement(promptElement);
					resolve(response);
				});
			}, 100);
		});
	};

	function createPopupElement(popupHTML, { left, right, top, bottom, width, height }) {
		const template = document.createElement("template");
		template.innerHTML = popupHTML;

		for (const element of mask.children) element.style.display = "none";

		const popupElement = template.content.firstChild;
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