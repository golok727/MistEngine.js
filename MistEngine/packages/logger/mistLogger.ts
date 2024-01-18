type LoggerOptions = {
	name: string;
	pattern: string;
	styled: boolean;
};

type Values<T> = T[keyof T];
type Keys<T> = keyof T;

const monthFormatter = new Intl.DateTimeFormat("en", {
	month: "long",
}).format;

export class MistLogger {
	private options: LoggerOptions;
	private parsedPatterns!: Keys<typeof MistLogger.FormatterPatterns>[];
	private stylesCache: Map<string, string>;

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
		this.stylesCache = new Map();
		this.options = { ...MistLogger.defaultOptions, ...options };
		this.recalculatePlaceholders();
	}

	public setPattern(pattern: string) {
		this.options.pattern = pattern;
		this.recalculatePlaceholders();
	}

	// Normal logging
	public log(message: string, ...args: any[]) {
		const [logMessage, styles] = this.createLog(
			message,
			MistLogger.LogLevel.LOG,
			args
		);
		console.log(logMessage, ...styles);
	}

	// Info
	public info(message: string, ...args: any[]) {
		const [logMessage, styles] = this.createLog(
			message,
			MistLogger.LogLevel.INFO,
			args
		);
		console.log(logMessage, ...styles);
	}

	// Warnings
	public warn(message: string, ...args: any[]) {
		const [logMessage, styles] = this.createLog(
			message,
			MistLogger.LogLevel.WARN,
			args
		);
		console.log(logMessage, ...styles);
	}

	// Errors
	public error(message: string, ...args: any[]) {
		const [logMessage, styles] = this.createLog(
			message,
			MistLogger.LogLevel.ERROR,
			args
		);
		console.log(logMessage, ...styles);
	}

	/*
		Parses the templated string provided by the user and fills with the data provided
		template arg == {index} eg: {0}-{1}-{0}
		Index is the index of the data in the args
	 */

	private parseLogText(template: string, args: any[]) {
		// Check for "{0}, {1}.. etc"  or "{:0}...etc" for formatted result for objects
		const matches = template.matchAll(/{(?<fPretty>:)?(?<index>\d+)}/g);

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
			template = template.replace(placeholder, `${replacement}`);
		}
		return template;
	}

	// is the passes in object has a toString method it will use it or if it gives [object Object] it parses it using JSON.parse
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

	/*
		Wraps the tokens with color stop codes
	 */
	private wrapWithStyles(token: string, allow: boolean) {
		if (this.options.styled && allow)
			return "%c" + token.replace(/%c/g, "") + "%c";
		else return token;
	}

	/*
		Creates a formatted log with given level template and data for the placeholder as args
	*/
	private createLog(
		template: string,
		level: Values<typeof MistLogger.LogLevel>,
		args: any[]
	) {
		const parsedMessage = this.parseLogText(template, args);
		return this.replaceFormatters(parsedMessage, level);
	}

	/* 
		Replaces the formatters with actual data
	*/
	private replaceFormatters(
		message: string,
		level: Values<typeof MistLogger.LogLevel>
	) {
		let { pattern: logFormat } = this.options;

		const allStyles: string[] = [];

		for (const pattern of this.parsedPatterns) {
			const formatters = MistLogger.Formatters;

			switch (pattern) {
				// Parsing messages require a extra message parameter
				case formatters.Message.pattern: {
					const { regex, parse, styles } = formatters.Message;
					logFormat = logFormat.replace(
						regex,
						this.wrapWithStyles(parse({ ...this.options, message }), !!styles)
					);
					if (styles) allStyles.push(styles, "");
					break;
				}

				case formatters.Level.pattern: {
					const { regex, parse, styles } = formatters.Level;
					logFormat = logFormat.replace(
						regex,
						this.wrapWithStyles(
							parse({ ...this.options, message, level }),
							!!styles
						)
					);
					const consoleLevelStyles = this.getStylesForLevel(level);

					if (styles) {
						allStyles.push(
							this.applyStyles(styles, consoleLevelStyles, level),
							"" // extra empty string is required to pop the styles
						);
					}
					break;
				}

				default: {
					const key = MistLogger.FormatterPatterns[pattern];
					const { regex, parse, styles } = formatters[key];
					logFormat = logFormat.replace(
						regex,
						this.wrapWithStyles(parse(this.options), !!styles)
					);
					if (styles) allStyles.push(styles, "");
					break;
				}
			}
		}
		return [logFormat, allStyles];
	}
	// For using styles with %value% placeholder
	private applyStyles(
		stylesStr: string,
		styles: Record<string, string>,
		key: string
	) {
		const cache = this.stylesCache.get(key);
		if (cache !== undefined) return cache;

		const s = Object.entries(styles).reduce((final, [k, v]) => {
			return final.replace(new RegExp(`%${k}%`), v);
		}, stylesStr);

		this.stylesCache.set(key, s);
		return s;
	}
	private getStylesForLevel(level: Values<typeof MistLogger.LogLevel>) {
		switch (level) {
			case MistLogger.LogLevel.ERROR:
				return { borderColor: "red", color: "white" };
			case MistLogger.LogLevel.WARN:
				return { borderColor: "yellow", color: "white" };
			case MistLogger.LogLevel.INFO:
				return { borderColor: "cyan", color: "white" };
			case MistLogger.LogLevel.LOG:
				return { borderColor: "orange", color: "white" };
		}
	}
	private recalculatePlaceholders() {
		this.parsedPatterns = MistLogger.parsePlaceholdersFromPattern(
			this.options.pattern
		);
	}
	//! Don't use %c
	private static LogLevel = {
		INFO: "Info",
		WARN: "Warning",
		ERROR: "Error",
		LOG: "Log",
	} as const;

	private static readonly FormatterPatterns: Record<string, string> = {
		"%s": "Message",
		"%L": "Level",
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
			parse(
				options: LoggerOptions & {
					message?: string;
					level?: Values<typeof MistLogger.LogLevel>;
				}
			): string;
			styles?: string;
		}
	> = {
		Message: {
			pattern: "%s",
			styles: "color: orange; font-weight: bold;",
			regex: new RegExp("%s"),
			parse(options) {
				if (!options.message) throw new Error("message not provided");
				return options.message;
			},
		},
		Level: {
			pattern: "%L",
			styles:
				"border:1px solid %borderColor%; border-radius: 10px; padding:  .5rem; color: %color%; font-weight: bold; font-size: .9rem;",
			regex: new RegExp("%L"),
			parse: function (options) {
				if (!options.level) throw new Error("Level was not provided");
				let emoji = "";
				switch (options.level) {
					case MistLogger.LogLevel.LOG:
						emoji = "🚀";
						break;
					case MistLogger.LogLevel.INFO:
						emoji = "🚄";
						break;
					case MistLogger.LogLevel.ERROR:
						emoji = "💔";
						break;
					case MistLogger.LogLevel.WARN:
						emoji = "⚠️";

						break;
				}
				return emoji;
			},
		},

		LoggerName: {
			pattern: "%n",
			styles: "color: cyan; font-weight: bold; ",
			regex: new RegExp("%n"),
			parse(options) {
				return options.name;
			},
		},

		Year4Digits: {
			pattern: "%Y",
			regex: new RegExp("%Y"),
			parse() {
				return new Date().getFullYear().toString();
			},
		},

		Year2Digits: {
			pattern: "%y",
			regex: new RegExp("%y"),
			parse() {
				return new Date().getFullYear().toString().slice(2);
			},
		},

		MonthNumber: {
			pattern: "%m",
			regex: new RegExp("%m"),
			parse() {
				return new Date().getMonth().toString();
			},
		},

		MonthText: {
			pattern: "%M",
			regex: new RegExp("%M"),
			parse() {
				return monthFormatter(new Date());
			},
		},
		ShortDate: {
			pattern: "%D",
			styles: "color: lightgreen",
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

	static readonly DefaultPattern: string = "%L %n: %s ( %D )";

	static readonly defaultOptions: LoggerOptions = {
		pattern: MistLogger.DefaultPattern,
		name: "MistLog",
		styled: true,
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
