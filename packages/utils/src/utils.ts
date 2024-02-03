// import { nanoid } from "nanoid";
export function camelToDashCase(str: string) {
	return str.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}

// function* devUuidGeneratorMaker() {
// 	let a = 0;
// 	while (true) {
// 		yield (a++).toString();
// 	}
// }

// const devUuidGenerator = devUuidGeneratorMaker();

// const UUID_DEV = () => {
// 	return devUuidGenerator.next().value ?? "";
// };

// const UUID_PROD = () => {
// 	return nanoid();
// };

// export const uuid: () => string = import.meta.env.PROD ? UUID_PROD : UUID_DEV;

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

export function printMistInto() {
	const mist = `%c
	        *     (    (                     )          (        )       \n      (  \`    )\\ ) )\\ )  *   )        ( /(  (       )\\ )  ( /(       \n      )\\))(  (()/((()/(\` )  /(   (    )\\()) )\\ )   (()/(  )\\()) (    \n     ((_)()\\  /(_))/(_))( )(_))  )\\  ((_)\ (()/(    /(_))((_)\  )\\   \n     (_()((_)(_)) (_)) (_(_())  ((_)  _((_) /(_))_ (_))   _((_)((_)  \n     |  \\/  ||_ _|/ __||_   _|  | __|| \\| |(_)) __||_ _| | \\| || __| \n     | |\\/| | | | \\__ \\  | |    | _| | .\` |  | (_ | | |  | .\` || _|  \n     |_|  |_||___||___/  |_|    |___||_|\\_|   \\___||___| |_|\\_||___| \n                       
	`;
	console.log(
		mist,
		"font-weight: bold;  color: transparent; background: linear-gradient(to right, orange, red); padding: 5px; background-clip: text;"
	);
}
