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
	static readonly DefaultPattern: string = "%n: [ %l ]\n\t\t %s ( %D )";

	static readonly defaultOptions: LoggerOptions = {
		pattern: MistLogger.DefaultPattern,
		name: "MistLog",
		styled: true,
	};

	private options: LoggerOptions;
	private parsedPatterns!: Keys<typeof MistLogger.FormatterPatterns>[];

	/**
	  # Format
		|flag | meaning								| example	|
		|-----|:---------------------:|--------|
		|%s   | Text to log 					|  				|
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
		const [formattedMessage, styles] = this.createLog(
			message,
			MistLogger.LogLevel.LOG,
			args
		);
		this._consoleLog(formattedMessage, styles);
	}

	// Info
	public info(message: string, ...args: any[]) {
		const [formattedMessage, styles] = this.createLog(
			message,
			MistLogger.LogLevel.INFO,
			args
		);
		this._consoleLog(formattedMessage, styles);
	}

	// Warnings
	public warn(message: string, ...args: any[]) {
		const [formattedMessage, styles] = this.createLog(
			message,
			MistLogger.LogLevel.WARN,
			args
		);
		this._consoleLog(formattedMessage, styles);
	}

	// Errors
	public error(message: string, ...args: any[]) {
		const [formattedMessage, styles] = this.createLog(
			message,
			MistLogger.LogLevel.ERROR,
			args
		);
		this._consoleLog(formattedMessage, styles);
	}

	/*
		Parses the templated string provided by the user and fills with the data provided
		template arg == {index} eg: {0}-{1}-{0}
		Index is the index of the data in the args
	 */

	private _consoleLog(formattedMessage: string, styles: string[]) {
		if (this.options.styled) console.log(formattedMessage, ...styles);
		else console.log(formattedMessage);
	}

	/*
		Creates a formatted log with given level template and data for the placeholder as args
	*/
	private createLog(
		template: string,
		level: Values<typeof MistLogger.LogLevel>,
		args: any[]
	) {
		const parsedMessage = this.parseTemplatedMessage(template, args);
		return this.replaceFormattersWithData(parsedMessage, level);
	}

	/**
	  Parse the templated message and replace it with the data provided in the args
	 */
	private parseTemplatedMessage(template: string, args: any[]) {
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

			let replacement = this.getArgDataReplacement(args[index], prettify);
			template = template.replace(placeholder, `${replacement}`);
		}
		return template;
	}

	private getArgDataReplacement(obj: any, prettifyObject = false) {
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
	private wrapTokenWithStyles(token: string) {
		if (this.options.styled) return "%c" + token.replace(/%c/g, "") + "%c";
		else return token;
	}

	/* 
		Replaces the formatters with actual data
	*/
	private replaceFormattersWithData(
		message: string,
		level: Values<typeof MistLogger.LogLevel>
	): [string, string[]] {
		let { pattern: placeholderString } = this.options;

		const allStyles: string[] = [];

		for (const pattern of this.parsedPatterns) {
			const formatters = MistLogger.Formatters;

			switch (pattern) {
				// Parsing messages require a extra message parameter
				case formatters.Message.pattern: {
					const [parsedStr, styles] = this.replaceFormatterMessageToken(
						message,
						placeholderString,
						level
					);
					placeholderString = parsedStr;
					allStyles.push(...styles);
					break;
				}

				// Log in text form
				case formatters.LevelText.pattern: {
					const [parsedStr, styles] = this.replaceFormatterLogLevelTextToken(
						placeholderString,
						level
					);
					placeholderString = parsedStr;
					allStyles.push(...styles);
					break;
				}

				case formatters.LevelShort.pattern: {
					const [parsedStr, styles] = this.replaceFormatterLogLevelShortToken(
						placeholderString,
						level
					);
					placeholderString = parsedStr;
					allStyles.push(...styles);
					break;
				}

				default: {
					const key = MistLogger.FormatterPatterns[pattern];
					const { regex, getValue, styles: s } = formatters[key];

					const styles = MistLogger.makeConsoleStyles(s);

					placeholderString = placeholderString.replace(
						regex,
						this.wrapTokenWithStyles(getValue(this.options))
					);
					allStyles.push(styles, "");
					break;
				}
			}
		}
		return [placeholderString, allStyles];
	}

	// Formatters["Message"]
	private replaceFormatterMessageToken(
		message: string,
		placeholderString: string,
		level: Values<typeof MistLogger.LogLevel>
	): [string, string[]] {
		const { regex, getValue, styles: s } = MistLogger.Formatters.Message;
		const styles = MistLogger.makeConsoleStyles({
			...s,
			color: this.getColorForLogLevel(level),
		});

		placeholderString = placeholderString.replace(
			regex,
			this.wrapTokenWithStyles(getValue({ ...this.options, message }))
		);
		return [placeholderString, [styles, ""]];
	}

	// Formatters["LevelText"]
	private replaceFormatterLogLevelTextToken(
		placeholderString: string,
		level: Values<typeof MistLogger.LogLevel>
	): [string, string[]] {
		const { regex, getValue, styles: s } = MistLogger.Formatters.LevelText;

		const styles = MistLogger.makeConsoleStyles({
			...s,
			color: this.getColorForLogLevel(level),
			fontWeight: "bold",
		});

		placeholderString = placeholderString.replace(
			regex,
			this.wrapTokenWithStyles(getValue({ ...this.options, level }))
		);

		return [placeholderString, [styles, ""]];
	}

	private replaceFormatterLogLevelShortToken(
		placeholderString: string,
		level: Values<typeof MistLogger.LogLevel>
	): [string, string[]] {
		const { regex, getValue, styles: s } = MistLogger.Formatters.LevelShort;

		const styles = MistLogger.makeConsoleStyles({
			...s,
		});

		placeholderString = placeholderString.replace(
			regex,
			this.wrapTokenWithStyles(getValue({ ...this.options, level }))
		);
		return [placeholderString, [styles, ""]];
	}

	private getColorForLogLevel(level: Values<typeof MistLogger.LogLevel>) {
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

	// Placeholders
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
			getValue(
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
			getValue(options) {
				if (options.message === undefined)
					throw new Error("message not provided");
				return options.message;
			},
		},

		LevelText: {
			pattern: "%l",
			styles: {},
			regex: new RegExp("%l"),
			getValue(options) {
				if (!options.level) throw new Error("Level was not provided");
				return options.level;
			},
		},

		LevelShort: {
			pattern: "%L",
			styles: {},
			regex: new RegExp("%L"),
			getValue: function (options) {
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
			getValue(options) {
				return options.name;
			},
		},

		Year4Digits: {
			pattern: "%Y",
			styles: {},
			regex: new RegExp("%Y"),
			getValue() {
				return new Date().getFullYear().toString();
			},
		},

		Year2Digits: {
			pattern: "%y",
			styles: {},
			regex: new RegExp("%y"),
			getValue() {
				return new Date().getFullYear().toString().slice(2);
			},
		},

		MonthNumber: {
			pattern: "%m",
			styles: {},
			regex: new RegExp("%m"),
			getValue() {
				return new Date().getMonth().toString();
			},
		},

		MonthText: {
			pattern: "%M",
			styles: {},
			regex: new RegExp("%M"),
			getValue() {
				return monthFormatter(new Date());
			},
		},
		ShortDate: {
			pattern: "%D",
			styles: {
				color: "lightgreen",
			},
			regex: new RegExp("%D"),
			getValue() {
				return new Date().toLocaleDateString();
			},
		},
		Day: {
			pattern: "%d",
			styles: {},
			regex: new RegExp("%d"),
			getValue() {
				return new Date().getDay().toString();
			},
		},
	} as const;

	private static makeConsoleStyles(styles: Record<string, string>) {
		let stylesStr = "";
		for (const [k, v] of Object.entries(styles)) {
			stylesStr += `${camelToDashCase(k)}: ${v}; `;
		}
		return stylesStr;
	}
}
