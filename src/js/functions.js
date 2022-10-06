function elementFromString(string) {
	const template = document.createElement("template");
	template.innerHTML = string.trim();

	return template.content.firstElementChild;
}

function encodeHTMLEntities(text) {
	const textArea = document.createElement("textarea");
	textArea.innerText = text;
	return textArea.innerHTML;
}

function isValidUTF8(arrayBuffer) {
	const decoder = new TextDecoder("utf-8", { fatal: true });

	try {
		decoder.decode(arrayBuffer);
	} catch (error) {
		if (error instanceof TypeError)
			return false;

		throw error;
	}
	return true;
}

function checkCharacterValid(character, encoding) {
	switch (encoding) {
		case "utf-8":
			return true;
		case "base64":
			return ~"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".indexOf(character);
		case "hex":
			return ~"0123456789abcdefABCDEF".indexOf(character);
		case "binary":
			return character === "0" || character === "1";
	}
}

function readFileAsArrayBuffer(file) {
	return new Promise(resolve => {
		const reader = new FileReader();
		reader.addEventListener("load", () => resolve(reader.result));
		reader.readAsArrayBuffer(file);
	});
}

function stringToArrayBuffer(string, encodingScheme) {
	switch (encodingScheme) {
		case "utf-8":
			return new TextEncoder().encode(string).buffer;
		case "base64":
			return base64ToArrayBuffer(string);
		case "hex":
			return new Uint8Array((string.match(/.{1,2}/g) || []).map(s => parseInt(s, 16))).buffer;
		case "binary":
			return new Uint8Array((string.match(/.{1,8}/g) || []).map(s => parseInt(s, 2))).buffer;
	}
}

function arrayBufferToString(arrayBuffer, encodingScheme) {
	switch (encodingScheme) {
		case "utf-8":
			return new TextDecoder().decode(arrayBuffer);
		case "base64":
			return arrayBufferToBase64(arrayBuffer);
		case "hex":
			return arrayBufferToHex(arrayBuffer);
		case "binary":
			return arrayBufferToBinary(arrayBuffer);
	}
}

function arrayBufferToBinary(arrayBuffer) {
	return new Uint8Array(arrayBuffer).reduce(
		(a, b) => a + b.toString(2).padStart(8, "0"), ""
	);
}

function arrayBufferToHex(arrayBuffer) {
	return new Uint8Array(arrayBuffer).reduce(
		(a, b) => a + b.toString(16).padStart(2, "0"), ""
	);
}

const [arrayBufferToBase64, base64ToArrayBuffer] = (() => {
	const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

	const lookup = new Uint8Array(256);
	for (let i = 0; i < chars.length; i++)
		lookup[chars.charCodeAt(i)] = i;

	const encode = arraybuffer => {
		const bytes = new Uint8Array(arraybuffer), len = bytes.length;
		let i, base64 = "";
		for (i = 0; i < len; i += 3) {
			base64 += chars[bytes[i] >> 2];
			base64 += chars[((bytes[i] & 3) << 4) | (bytes[i + 1] >> 4)];
			base64 += chars[((bytes[i + 1] & 15) << 2) | (bytes[i + 2] >> 6)];
			base64 += chars[bytes[i + 2] & 63];
		}
		if (len % 3 === 2) {
			base64 = base64.substring(0, base64.length - 1) + "=";
		}
		else if (len % 3 === 1) {
			base64 = base64.substring(0, base64.length - 2) + "==";
		}
		return base64;
	};
	const decode = base64 => {
		const len = base64.length;
		let bufferLength = base64.length * 0.75, i, p = 0, encoded1, encoded2, encoded3, encoded4;
		if (base64[base64.length - 1] === "=") {
			bufferLength--;
			if (base64[base64.length - 2] === "=") {
				bufferLength--;
			}
		}
		const arraybuffer = new ArrayBuffer(bufferLength), bytes = new Uint8Array(arraybuffer);
		for (i = 0; i < len; i += 4) {
			encoded1 = lookup[base64.charCodeAt(i)];
			encoded2 = lookup[base64.charCodeAt(i + 1)];
			encoded3 = lookup[base64.charCodeAt(i + 2)];
			encoded4 = lookup[base64.charCodeAt(i + 3)];
			bytes[p++] = (encoded1 << 2) | (encoded2 >> 4);
			bytes[p++] = ((encoded2 & 15) << 4) | (encoded3 >> 2);
			bytes[p++] = ((encoded3 & 3) << 6) | (encoded4 & 63);
		}
		return arraybuffer;
	};

	return [encode, decode];
})();

export {
	elementFromString,
	encodeHTMLEntities,
	isValidUTF8,
	checkCharacterValid,
	readFileAsArrayBuffer,
	stringToArrayBuffer,
	arrayBufferToString,
	arrayBufferToBinary,
	arrayBufferToHex,
	arrayBufferToBase64,
};