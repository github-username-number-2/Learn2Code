"use strict";

import * as del from "del";
import * as fs from "fs";

import * as csso from "csso";

const htmlminifyConfig = {
	useShortDoctype: true,
	trimCustomFragments: true,
	sortClassName: true,
	sortAttributes: true,
	removeStyleLinkTypeAttributes: true,
	removeScriptTypeAttributes: true,
	removeRedundantAttributes: true,
	removeEmptyAttributes: true,
	removeComments: true,
	removeAttributeQuotes: true,
	preventAttributesEscaping: true,
	minifyURLs: true,
	decodeEntities: true,
	collapseWhitespace: true,
	collapseInlineTagWhitespace: true,
	collapseBooleanAttributes: true,
};

(async function () {
	const htmlminify = (await import("html-minifier")).default;
	const uglify = (await import("uglify-js")).default;
	const jsonminify = (await import("jsonminify")).default;

	del.deleteSync(["public/**", "!public"]);
	compressDirectory("./src/", "./public/", ["./src/tutorialFileCreator.html", "./src/lastthiniwasdoing.txt", "./src/.vscode", "./src/js/serviceWorker"]);

	function compressDirectory(sourceDirectory, outputDirectory, ignoreFiles) {
		for (const file of fs.readdirSync(sourceDirectory, { withFileTypes: true })) {
			const fileName = file.name,
				path = sourceDirectory + fileName;

			if (ignoreFiles.includes(path)) {
				console.log("Ignored file: " + path);

				const index = ignoreFiles.indexOf(path);
				~index && ignoreFiles.splice(index, 1);
				continue;
			}

			if (file.isDirectory()) {
				fs.mkdirSync(outputDirectory + fileName);

				compressDirectory(path + "/", outputDirectory + fileName + "/", ignoreFiles);
			} else {
				const extension = fileName.split(".").pop();
				console.log(path);

				const contents = fs.readFileSync(path, { encoding: "utf8" });
				let newContents;

				try {
					switch (extension) {
						case "json":
							newContents = jsonminify(contents);
							break;

						case "js":
							newContents = uglify.minify(contents).code;
							break;

						case "html":
							newContents = replaceMarkdown(contents, `<script type="module">`, `</script>`, code =>
								`<script type="module">${uglify.minify(code).code}</script>`
							);
							newContents = replaceMarkdown(newContents, `<script>`, `</script>`, code =>
								`<script>${uglify.minify(code).code}</script>`
							);
							newContents = htmlminify.minify(contents, htmlminifyConfig);
							break;

						case "css":
							newContents = csso.minify(contents).css;
							break;
					}

					if (newContents) {
						console.log(contents.length, newContents.length, (newContents.length / contents.length * 100).toFixed(2) + "%");

						fs.writeFileSync(outputDirectory + fileName, newContents);
					} else {
						fs.copyFileSync(path, outputDirectory + fileName);
					}
				} catch (error) {
					console.log("Error occurred in file: " + path);
					throw error;
				}
			}
		}

		console.log("Remaining ignore directories: " + JSON.stringify(ignoreFiles));
	}

	function replaceMarkdown(string, startString, endString, handler) {
		let startIndex, resultString = "";
		while (startIndex = string.indexOf(startString), ~startIndex) {
			resultString += string.slice(0, startIndex);
			string = string.slice(startIndex + startString.length);

			const endIndex = string.indexOf(endString);
			if (!~endIndex) throw new Error(`Start markup sequence is never closed. End sequence: ${endString} Current parsed string: ${resultString}`);

			resultString += handler(string.slice(0, endIndex));
			string = string.slice(endIndex + endString.length);
		}
		resultString += string;

		return resultString;
	}
})();