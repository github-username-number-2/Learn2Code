import { elementFromString } from "/js/functions.js";

const settingsInfo = {
	editorFontSize: {
		default: 16,
		type: "number",
		display: "Code font size",
		description: "Font size of all editors (2-40)",

		min: 2,
		max: 40,
	},
	editorLineNumbers: {
		default: true,
		type: "toggle",
		display: "Line numbers",
		description: "Show line numbers in editor",
	},
	editorWrapText: {
		default: false,
		type: "toggle",
		display: "Wrap text",
		description: "Allow long lines to continue off screen or place on next line",
	},
	tutorialDifferenceEditorStyle: {
		default: "sideBySide",
		type: "select",
		display: "Tutorial hint style",
		description: "Display tutorial hints side by side or inline",

		defaultDisplay: "Side by side",
		valueList: [
			"sideBySide",
			"inline",
		],
		displayList: {
			sideBySide: "Side by side",
			inline: "Inline",
		},
	},
};

export default async function initializeSettingsManager() {
	const storedSettings = await storageManager.getEditorSettings();

	window.userSettings = {};
	for (const setting in settingsInfo) {
		const storedSetting = storedSettings.find(object => object.name === setting);

		userSettings[setting] = settingsInfo[setting].currentValue =
			storedSetting
				? storedSetting.currentValue
				: settingsInfo[setting].default;
	}

	const settingsContainer = document.getElementById("settingsPanelContent"),
		reloadText = document.getElementById("settingsReloadText");
	for (const setting in settingsInfo) {
		const settingData = settingsInfo[setting],
			settingType = settingData.type;

		const settingElement = elementFromString(`
				<div id="${setting}Setting" class="setting ${settingType}">
					<h1>
						${settingData.display}
						<img src="/images/icons/resetIcon.png" title="Reset to default (${settingData.defaultDisplay || settingData.default})">
					</h1>
					<p>${settingData.description}</p>
				</div>
			`);

		settingElement.firstElementChild.firstElementChild.addEventListener("click", async () =>
			updateSetting(setting, settingData, settingData.default)
		);

		const currentValue = settingData.currentValue;
		switch (settingType) {
			case "number": {
				const input = elementFromString(`
					<input type="number" value="${currentValue}" min="${settingData.min}" max="${settingData.max}">
				`);

				input.addEventListener("change", () => {
					const value = parseInt(input.value);
					if (value < settingData.min || value > settingData.max) {
						input.style.border = "0.2vh solid #ff0000";
					} else {
						input.style.border = null;
						updateSetting(setting, settingData, value);
					}
				});

				settingElement.append(input);
			} break;
			case "toggle": {
				const toggleButton = elementFromString(`
					<div><div></div></div>
				`);

				if (currentValue)
					toggleButton.firstElementChild.classList.add("settingToggleSliderTransformed");
				else
					toggleButton.classList.remove("settingToggleSliderTransformed");

				let currentUpdatedValue = currentValue;
				toggleButton.addEventListener("click", () =>
					updateSetting(setting, settingData, currentUpdatedValue = !currentUpdatedValue)
				);

				settingElement.append(toggleButton);
			} break;
			case "select": {
				let optionsString = "";
				for (const value of settingData.valueList)
					optionsString += `<option value="${value}">${settingData.displayList[value]}</option>`;

				const selectElement = elementFromString(`
					<select>
						${optionsString}
					</select>
				`);
				selectElement.value = currentValue;

				selectElement.addEventListener("change", () =>
					updateSetting(setting, settingData, selectElement.value)
				);

				settingElement.append(selectElement);
			} break;
		}

		settingsContainer.append(settingElement);
	}

	const changedSettings = {};
	async function updateSetting(settingName, settingObject, value) {
		settingObject = { ...settingObject, name: settingName, currentValue: value };
		await storageManager.modifyEditorSetting(settingObject);

		// update screen value
		const settingElement = document.getElementById(settingName + "Setting");
		switch (settingObject.type) {
			case "number": {
				const input = settingElement.querySelector("input");
				input.value = value;
				input.style.border = null;
			} break;
			case "toggle": {
				const sliderELement = settingElement.lastElementChild.firstElementChild;
				if (value)
					sliderELement.classList.add("settingToggleSliderTransformed");
				else
					sliderELement.classList.remove("settingToggleSliderTransformed");
			} break;
			case "select": {
				const selectElement = settingElement.querySelector("select");
				selectElement.value = value;
			} break;
		}

		changedSettings[settingName] = value;
		for (const setting in changedSettings) {
			if (changedSettings[setting] === settingObject.default)
				await storageManager.deleteEditorSetting(setting);

			if (changedSettings[setting] === userSettings[setting])
				delete changedSettings[setting];
		}


		if (Object.keys(changedSettings).length)
			reloadText.style.display = "block";
		else
			reloadText.style.display = "none";


		for (const updatedText of settingElement.querySelectorAll(".updatedSettingText"))
			updatedText.remove();

		if (settingName in changedSettings) {
			settingElement.firstElementChild.prepend(
				elementFromString(`<p class="updatedSettingText">*</p>`)
			);
		}
	}
}