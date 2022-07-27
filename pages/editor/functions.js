export function elementFromString(string) {
	const template = document.createElement("template");
	template.innerHTML = string.trim();

	return template.content.firstElementChild;
}

export function selectTab(tabName) {
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