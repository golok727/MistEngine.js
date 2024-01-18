type LoggerOptions = {
	name: string;
	pattern: string;
};

type Values<T> = T[keyof T];
type Keys<T> = keyof T;

export class MistLogger {
	private options: {
		name: string;
		pattern: string;
	};
	private placeholders!: Keys<typeof MistLogger.FormatterPatterns>[];

	/**
	  # Format
		|flag | meaning								| example	|
		|-----|:---------------------:|--------|
		|%s   |  text to log 					|  				|
		|%n 	| Logger Name 					|   			|
		|%Y 	| Year in 4 digits			|   			|
	  |%y 	| Year in 2 digits			|  				|
		|%m 	| Month in number (1-12)|   			|
		|%M 	| Month in text		 			|   			|
		|%D 	| Short MM/DD/YY date		|  				|
		|%d 	| day in 1-31       		|  				|
		|%d 	| day in 1-31       		|  				|

	// 



	*/

	constructor(options?: Partial<LoggerOptions>) {
		this.options = { ...MistLogger.defaultOptions, ...options };
		this.recalculatePlaceholders();
	}

	public setPattern(pattern: string) {
		this.options.pattern = pattern;
		this.recalculatePlaceholders();
	}

	public log(message: string, ...args: any[]) {
		const logMessage = this.createLog(message, args);
		console.log(logMessage);
	}

	public error(message: string, ...args: any[]) {
		const logMessage = this.createLog(message, args);
		console.error(logMessage);
	}

	public warn(message: string, ...args: any[]) {
		const logMessage = this.createLog(message, args);
		console.warn(logMessage);
	}

	private parseLogText(message: string, args: any[]) {
		const matches = message.matchAll(/{(?<fPretty>:)?(?<index>\d+)}/g);

		for (const match of matches) {
			const placeholder = match[0];
			if (!match.groups) {
				throw new Error("Invalid number of arguments");
			}

			const index = parseInt(match.groups.index);
			if (isNaN(index)) {
				throw new Error(
					"Placeholder should have a valid number index to the arguments"
				);
			}

			if (index < 0 || index >= args.length) {
				throw new Error("Index out of bounds");
			}

			let prettify = !!match.groups?.fPretty;

			let replacement = this.getReplacement(args[index], prettify);
			message = message.replace(placeholder, `${replacement}`);
		}
		return message;
	}

	private getReplacement(obj: any, prettifyObject = false) {
		if (obj.toString !== undefined && typeof obj.toString === "function") {
			const str = obj.toString();
			if (str === "[object Object]" && typeof obj === "object") {
				return JSON.stringify(obj, null, prettifyObject ? 2 : 0);
			}
			return obj.toString();
		} else {
			return obj;
		}
	}

	private createLog(message: string, args: any[]) {
		const parsedMessage = this.parseLogText(message, args);
		return this.replacePlaceholders(parsedMessage);
	}

	private replacePlaceholders(message: string) {
		let { pattern: template } = this.options;

		for (const placeholder of this.placeholders) {
			const formatter = MistLogger.Formatters;

			switch (placeholder) {
				// Parsing messages require a extra message parameter
				case formatter.Message.pattern: {
					const { regex, parse } = formatter.Message;
					template = template.replace(
						regex,
						parse({ ...this.options, message })
					);
					break;
				}

				default: {
					const key = MistLogger.FormatterPatterns[placeholder];
					const { regex, parse } = formatter[key];
					template = template.replace(regex, parse(this.options));
					break;
				}
			}
		}

		return template;
	}

	private recalculatePlaceholders() {
		this.placeholders = MistLogger.parsePlaceholdersFromPattern(
			this.options.pattern
		);
	}
	//! Don't use %c

	private static readonly FormatterPatterns = {
		"%s": "Message",
		"%n": "LoggerName",
		"%Y": "Year4Digits",
		"%y": "Year2Digits",
		"%m": "MonthNumber",
		"%M": "MonthText",
		"%D": "ShortDate",
		"%d": "Day",
	} as const;

	private static readonly Formatters: Record<
		Values<typeof MistLogger.FormatterPatterns>,
		{
			pattern: Keys<typeof MistLogger.FormatterPatterns>;
			regex: RegExp;
			parse(options: LoggerOptions & { message?: string }): string;
		}
	> = {
		Message: {
			pattern: "%s",
			regex: new RegExp("%s"),
			parse(options) {
				if (!options.message) throw new Error("message not provided");
				return options.message;
			},
		},

		LoggerName: {
			pattern: "%n",
			regex: new RegExp("%n"),
			parse(options) {
				return options.name;
			},
		},

		Year4Digits: {
			pattern: "%Y",
			regex: new RegExp("%Y"),
			parse() {
				return "";
			},
		},
		Year2Digits: {
			pattern: "%y",
			regex: new RegExp("%y"),
			parse() {
				return "";
			},
		},

		MonthNumber: {
			pattern: "%m",
			regex: new RegExp("%m"),
			parse() {
				return "";
			},
		},

		MonthText: {
			pattern: "%M",
			regex: new RegExp("%M"),
			parse() {
				return "";
			},
		},
		ShortDate: {
			pattern: "%D",
			regex: new RegExp("%D"),
			parse() {
				return new Date().toLocaleDateString();
			},
		},
		Day: {
			pattern: "%d",
			regex: new RegExp("%d"),
			parse() {
				return "";
			},
		},
	} as const;

	static readonly DefaultPattern: string = "%n: %s [ %D ]";

	static readonly defaultOptions: LoggerOptions = {
		pattern: MistLogger.DefaultPattern,
		name: "MistLog",
	};

	private static parsePlaceholdersFromPattern(pattern: string) {
		let placeholderExtractorRegex = /%\w/g;

		const placeholders = [];
		for (const match of pattern.matchAll(placeholderExtractorRegex)) {
			const pattern = match[0] as Keys<typeof MistLogger.FormatterPatterns>;
			if (MistLogger.FormatterPatterns[pattern] === undefined) {
				throw new Error(`Invalid formatter '${pattern}'`);
			}
			placeholders.push(pattern);
		}
		return placeholders as Keys<typeof MistLogger.FormatterPatterns>[];
	}
}
