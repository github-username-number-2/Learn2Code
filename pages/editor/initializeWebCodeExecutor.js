export default function initializeWebCodeExecutor(executorRootURL, startingPagePath) {
	const runButton = document.getElementById("runCode");
	let iframe, retryTimeout, timeoutLength = 500;

	return new Promise(resolve => {
		const executorURL = executorRootURL + "/_L2C_RESERVED_INDEX_.html";

		let firstMessageReceived = false,
			initializationComplete;
		window.addEventListener("message", event => {
			if (event.data === "ready") {
				if (firstMessageReceived) {
					if (initializationComplete) {
						onready();

						window.open(executorRootURL + startingPagePath);
					} else {
						clearTimeout(retryTimeout);

						initializationComplete = true;

						runButton.addEventListener("click", () =>
							webCodeExecutor.executeFileSystem(fileSystemManager.getFilesList())
						);
						onready();

						resolve(webCodeExecutor);
					}
				} else {
					firstMessageReceived = true;
				}
			}
		});

		createIframe();
		setRetryTimeout();

		const webCodeExecutor = {
			ready: false,
			executeFileSystem(fileSystem) {
				if (this.ready) {
					this.ready = false;
					runButton.style.backgroundColor = "#cccccc";

					iframe.contentWindow.postMessage(JSON.stringify(fileSystem), executorURL);
				}
			},
		};

		function createIframe() {
			iframe = document.createElement("iframe");
			iframe.addEventListener("load", function handleLoad() {
				// reload iframe to refresh service workers
				iframe.removeEventListener("load", handleLoad);
				iframe.src += "";
			});

			iframe.setAttribute("src", executorURL);
			iframe.style.display = "none";
			document.body.appendChild(iframe);
		}

		function setRetryTimeout() {
			retryTimeout = setTimeout(() => {
				// restart and reload iframe
				firstMessageReceived = initializationComplete = webCodeExecutor.ready = false;
				document.body.removeChild(iframe);

				// gradually increase wait time for potentially slow connections
				timeoutLength += 1000;

				createIframe();
				setRetryTimeout();
			}, timeoutLength);
		}

		function onready() {
			webCodeExecutor.ready = true;

			runButton.style.backgroundColor = "#4aff4a";
		}
	});
}