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