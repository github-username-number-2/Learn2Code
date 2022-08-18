export function elementFromString(string) {
	const template = document.createElement("template");
	template.innerHTML = string.trim();

	return template.content.firstElementChild;
}

export function isValidUTF8(arrayBuffer) {
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

export function stringToArrayBuffer(string, encodingScheme) {
	switch (encodingScheme) {
		case "utf-8":
			return new TextEncoder().encode(string).buffer;
		case "base64":
			return Uint8Array.from(atob(string), c => c.charCodeAt(0)).buffer;
		case "hex":
			return new Uint8Array((string.match(/.{1,2}/g) || []).map(s => parseInt(s, 16))).buffer;
		case "binary":
			return new Uint8Array((string.match(/.{1,8}/g) || []).map(s => parseInt(s, 2))).buffer;
	}
}

export function arrayBufferToString(arrayBuffer, encodingScheme) {
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

export function arrayBufferToBinary(arrayBuffer) {
	return new Uint8Array(arrayBuffer).reduce(
		(a, b) => a + b.toString(2).padStart(8, "0"), ""
	);
}

export function arrayBufferToHex(arrayBuffer) {
	return new Uint8Array(arrayBuffer).reduce(
		(a, b) => a + b.toString(16).padStart(2, "0"), ""
	);
}

export function arrayBufferToBase64(arrayBuffer) {
	let binary = "";

	const bytes = new Uint8Array(arrayBuffer),
		len = bytes.byteLength;
	for (let i = 0; i < len; i++) {
		binary += String.fromCharCode(bytes[i]);
	}

	return btoa(binary);
}