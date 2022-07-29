// initialize sub page tabs

const subPages = [
	...document.getElementsByClassName("subPage")
].map(subPage => subPage.id);

if (!window.location.hash.substring(1).includes(subPages)) {
	window.location.hash = "info";
}

switchSubPages(window.location.hash.substring(1));

for (const index of subPages.keys()) {
	const subPageButton = document.getElementById(subPages[index] + "Button");
	subPageButton.style.left = 7 + index * 12 + "vw";
	subPageButton.addEventListener("mousedown", event => {
		switchSubPages(subPages[index]);
	});
}



function switchSubPages(pageName) {
	for (const button of document.getElementsByClassName("subPageButton")) {
		button.style.height = "4.1vh";
		button.style.backgroundColor = "#cccccc";
		button.children[0].style.marginTop = "1vh";
	}

	for (const subPage of document.getElementsByClassName("subPage")) {
		subPage.style.display = "none";
	}

	const targetButton = document.getElementById(pageName + "Button");
	targetButton.style.height = "4.71vh";
	targetButton.style.backgroundColor = "#eeeeee";
	targetButton.children[0].style.marginTop = "0.8em";

	document.getElementById(pageName).style.display = "block";
}