export function camelToDashCase(str: string) {
	return str.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}

export async function loadImageAsync(src: string): Promise<HTMLImageElement> {
	return new Promise((resolve, reject) => {
		const image = new Image();

		image.onload = () => {
			resolve(image);
		};

		image.onerror = (err) => {
			reject(err);
		};
		image.src = src;
	});
}

export function mistIntro__() {
	console.log(
		"%c❄️️️️️️❄️️️️️️❄️️️️️️❄️️️️️️❄️️️️️️❄️️️️️️❄️️️️️️️️️️️️",
		"font-size: 2rem;"
	);
	console.log(
		"%cMist Engine",
		"font-weight: bold; font-size: 3rem; color: transparent; background: linear-gradient(to right, orange, red); padding: 5px; background-clip: text;"
	);
	console.log(
		"%c❄️️️️️️❄️️️️️️❄️️️️️️❄️️️️️️❄️️️️️️❄️️️️️️❄️️️️️️️️️️️️",
		"font-size: 2rem;"
	);
}
