import { camelToDashCase } from "@mist-engine/utils";

type LoggerOptions = {
	name: string;
	pattern: string;
	styled: boolean;
};

const monthFormatter = new Intl.DateTimeFormat("en", {
	month: "long",
}).format;

export class MistLogger {
	private options: LoggerOptions;
	private parsedPatterns!: Keys<typeof MistLogger.FormatterPatterns>[];

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
		|%L 	| Emoji of level       	|  				|
		|%l 	| Level in text       	|  				|

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
	private wrapWithStyles(token: string) {
		if (this.options.styled) return "%c" + token.replace(/%c/g, "") + "%c";
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
					const { regex, parse, styles: s } = formatters.Message;
					const styles = MistLogger.makeConsoleStyles({
						...s,
						color: this.getColorForLevel(level),
					});

					logFormat = logFormat.replace(
						regex,
						this.wrapWithStyles(parse({ ...this.options, message }))
					);
					allStyles.push(styles, "");
					break;
				}

				// Log in text form
				case formatters.LevelText.pattern: {
					const { regex, parse, styles: s } = formatters.LevelText;

					const styles = MistLogger.makeConsoleStyles({
						...s,
						color: this.getColorForLevel(level),
						fontWeight: "bold",
					});

					logFormat = logFormat.replace(
						regex,
						this.wrapWithStyles(parse({ ...this.options, message, level }))
					);

					allStyles.push(
						styles,
						"" // extra empty string is required to pop the styles
					);
					break;
				}

				case formatters.LevelShort.pattern: {
					const { regex, parse, styles: s } = formatters.LevelShort;

					const styles = MistLogger.makeConsoleStyles({
						...s,
					});

					logFormat = logFormat.replace(
						regex,
						this.wrapWithStyles(parse({ ...this.options, message, level }))
					);

					allStyles.push(
						styles,
						"" // extra empty string is required to pop the styles
					);
					break;
				}

				default: {
					const key = MistLogger.FormatterPatterns[pattern];
					const { regex, parse, styles: s } = formatters[key];

					const styles = MistLogger.makeConsoleStyles(s);

					logFormat = logFormat.replace(
						regex,
						this.wrapWithStyles(parse(this.options))
					);
					allStyles.push(styles, "");
					break;
				}
			}
		}
		return [logFormat, allStyles];
	}

	private getColorForLevel(level: Values<typeof MistLogger.LogLevel>) {
		switch (level) {
			case MistLogger.LogLevel.ERROR:
				return "red";
			case MistLogger.LogLevel.WARN:
				return "yellow";
			case MistLogger.LogLevel.INFO:
				return "cyan";
			case MistLogger.LogLevel.LOG:
				return "orange";
		}
	}

	private recalculatePlaceholders() {
		this.parsedPatterns = this.parsePlaceholdersFromPattern(
			this.options.pattern
		);
	}

	private parsePlaceholdersFromPattern(pattern: string) {
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

	private static LogLevel = {
		INFO: "Info",
		WARN: "Warning",
		ERROR: "Error",
		LOG: "Log",
	} as const;

	//! Don't use %c as a formatter
	private static readonly FormatterPatterns: Record<string, string> = {
		"%s": "Message",
		"%L": "LevelShort",
		"%l": "LevelText",
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
				},
				styleProps?: Record<string, string>
			): string;
			styles: Record<string, string>;
		}
	> = {
		Message: {
			pattern: "%s",
			styles: { fontStyle: "italic" },
			regex: new RegExp("%s"),
			parse(options) {
				if (options.message === undefined)
					throw new Error("message not provided");
				return options.message;
			},
		},

		LevelText: {
			pattern: "%l",
			styles: {},
			regex: new RegExp("%l"),
			parse(options) {
				if (!options.level) throw new Error("Level was not provided");
				return options.level;
			},
		},

		LevelShort: {
			pattern: "%L",
			styles: {},
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
			styles: {
				color: "transparent",
				fontWeight: "bold",
				fontSize: "1.4em",
				background: "linear-gradient(to right, orange, red)",
				padding: "5px",
				backgroundClip: "text",
			},

			regex: new RegExp("%n"),
			parse(options) {
				return options.name;
			},
		},

		Year4Digits: {
			pattern: "%Y",
			styles: {},
			regex: new RegExp("%Y"),
			parse() {
				return new Date().getFullYear().toString();
			},
		},

		Year2Digits: {
			pattern: "%y",
			styles: {},
			regex: new RegExp("%y"),
			parse() {
				return new Date().getFullYear().toString().slice(2);
			},
		},

		MonthNumber: {
			pattern: "%m",
			styles: {},
			regex: new RegExp("%m"),
			parse() {
				return new Date().getMonth().toString();
			},
		},

		MonthText: {
			pattern: "%M",
			styles: {},
			regex: new RegExp("%M"),
			parse() {
				return monthFormatter(new Date());
			},
		},
		ShortDate: {
			pattern: "%D",
			styles: {
				color: "lightgreen",
			},
			regex: new RegExp("%D"),
			parse() {
				return new Date().toLocaleDateString();
			},
		},
		Day: {
			pattern: "%d",
			styles: {},
			regex: new RegExp("%d"),
			parse() {
				return new Date().getDay().toString();
			},
		},
	} as const;

	static readonly DefaultPattern: string = "%n: [ %l ]\n\t\t %s ( %D )";

	static readonly defaultOptions: LoggerOptions = {
		pattern: MistLogger.DefaultPattern,
		name: "MistLog",
		styled: true,
	};

	private static makeConsoleStyles(styles: Record<string, string>) {
		let stylesStr = "";
		for (const [k, v] of Object.entries(styles)) {
			stylesStr += `${camelToDashCase(k)}: ${v}; `;
		}
		return stylesStr;
	}
}
