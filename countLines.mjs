import * as fs from "fs";

const scanTarget = process.argv[2],
	noIgnore = Boolean(process.argv[3]);

const fileLines = [];
await scanDirectory(scanTarget, noIgnore ? [] : [scanTarget + "images", scanTarget + "js/libraries", scanTarget + "data/tutorials/resources", scanTarget + "favicon.png", scanTarget + "data/iconData.json"], fileLines);

let totalLines = 0,
	totalBytes = 0;
const linesPerExtension = {},
	bytesPerExtension = {};
for (const lineArray of fileLines) {
	const [path, lines, bytes] = lineArray,
		extension = path.split(".").pop();

	totalLines += lines;
	linesPerExtension[extension] = linesPerExtension[extension]
		? linesPerExtension[extension] + lines
		: lines;

	totalBytes += bytes;
	bytesPerExtension[extension] = bytesPerExtension[extension]
		? bytesPerExtension[extension] + bytes
		: bytes;

	console.log(path.padEnd(60), lines, bytes);
}

for (const extension in linesPerExtension)
	console.log(extension.padEnd(20), linesPerExtension[extension], bytesPerExtension[extension]);
console.log("Total lines: " + totalLines);
console.log("Total bytes: " + totalBytes);

async function scanDirectory(sourceDirectory, ignoreFiles, lineArray) {
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
			await scanDirectory(path + "/", ignoreFiles, lineArray);
		} else {
			let lineCount = 0,
				byteCount = 0;
			await new Promise(resolve =>
				fs.createReadStream(path).on("data", buffer => {
					byteCount += buffer.length;

					let idx = -1;
					lineCount--;

					do {
						idx = buffer.indexOf(10, idx + 1);
						lineCount++;
					} while (idx !== -1);
				}).on("end", resolve)
			);

			lineArray.push([path, lineCount, byteCount]);
		}
	}

	console.log("Remaining ignore directories: " + JSON.stringify(ignoreFiles));
}