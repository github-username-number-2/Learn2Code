// prevents dragging of images
document.addEventListener("dragstart", event => event.preventDefault());

// disable text selection
document.addEventListener("selectstart", event => event.preventDefault());