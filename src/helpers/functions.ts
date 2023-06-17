export const findMissingValue = (
	inputObject: any
): string | null | undefined => {
	if (inputObject) {
		return;
	} else {
		for (let key in inputObject) {
			if (inputObject[key] === undefined) return key;
		}
	}

	return null;
};
