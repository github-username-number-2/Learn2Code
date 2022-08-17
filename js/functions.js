export function elementFromString(string) {
	const template = document.createElement("template");
	template.innerHTML = string.trim();

	return template.content.firstElementChild;
}

export async function isUTF8(blob) {
	const decoder = new TextDecoder("utf-8", { fatal: true });
	const buffer = await blob.arrayBuffer();

	try {
		decoder.decode(buffer);
	} catch (error) {
		if (error instanceof TypeError)
			return false;
		throw error;
	}
	return true;
}

export function stringToArrayBuffer(string, encodingScheme) {
	switch (encodingScheme) {
		case "UTF-8":
			return new TextEncoder("utf-8").encode(string).buffer;
		case "Base64":
			return Uint8Array.from(atob(string), c => c.charCodeAt(0)).buffer;
		case "binary":
			break;
	}
}

export function arrayBufferToBinary(arrayBuffer) {
	return new Uint8Array(arrayBuffer).reduce((str, byte) => str + byte.toString(2).padStart(8, "0"), "");
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