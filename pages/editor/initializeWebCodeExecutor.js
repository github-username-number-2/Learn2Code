export default function initializeWebCodeExecutor(executorRootURL, startingPagePath) {
	const runButton = document.getElementById("runCode");
	let iframe, retryTimeout, timeoutLength = 500;

	return new Promise(resolve => {
		const executorURL = executorRootURL + "/_L2C_RESERVED_INDEX_.html";

		let firstMessageReceived = false,
			initializationComplete;
		window.addEventListener("message", event => {
			if (event.data === "0") {
				if (firstMessageReceived) {
					if (!initializationComplete) {
						clearTimeout(retryTimeout);

						initializationComplete = true;

						runButton.addEventListener("click", () =>
							webCodeExecutor.executeFilesList(fileSystemManager.getBinaryFilesList())
						);
						onready();

						resolve(webCodeExecutor);
					}
				} else {
					firstMessageReceived = true;
				}
			} else if (event.data === "1") {
				onready();

				window.open(executorRootURL + startingPagePath);
			}
		});

		createIframe();
		setRetryTimeout();

		const webCodeExecutor = {
			ready: false,
			executeFilesList(filesList) {
				if (this.ready) {
					this.ready = false;
					runButton.style.backgroundColor = "#cccccc";

					for (const fileData of filesList) {
						fileData[0] = "/" + fileData[0].replaceAll(" ", "/");
					}

					iframe.contentWindow.postMessage(filesList, executorURL);
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