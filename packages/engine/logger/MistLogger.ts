import { camelToDashCase } from "@mist-engine/utils";

type LoggerOptions = {
	name: string;
	pattern: string;
	styled: boolean;
};

enum LogPatterns {
	Message = "%s",
	LevelShort = "%L",
	LevelText = "%l",
	LoggerName = "%n",
	Year4Digits = "%Y",
	Year2Digits = "%y",
	MonthNumber = "%m",
	MonthText = "%M",
	ShortDate = "%D",
	WeekDayDigit = "%w",
	WeekDayText = "%W",
	PerformanceNow = "%p",
}

type PatternName = Keys<typeof LogPatterns>;
type Pattern = `${LogPatterns}`;

export class MistLogger {
	static readonly DefaultPattern: string = "%n: [ %l ] ( %D ) %p \n\t %s ";

	static readonly defaultOptions: LoggerOptions = {
		pattern: MistLogger.DefaultPattern,
		name: "MistLog",
		styled: true,
	};

	private options: LoggerOptions;
	private parsedPatterns!: Pattern[];

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
		|%d 	| week-day in 1-6       |  				|
		|%p 	| current performance   |  				|
		|%L 	| Emoji of level       	|  				|
		|%l 	| Level in text       	|  				|

	// 
	*/

	constructor(options?: Partial<LoggerOptions>) {
		this.options = Object.assign({}, MistLogger.defaultOptions, options);
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

	private static MessageTemplateRegex = /{(?<fPretty>:)?(?<index>\d+)}/g;
	private parseTemplatedMessage(template: string, args: any[]) {
		// Check for "{0}, {1}.. etc"  or "{:0}...etc" for formatted result for objects
		const matches = template.matchAll(MistLogger.MessageTemplateRegex);

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
		if (typeof obj === "object" && obj !== null) {
			return prettifyObject
				? JSON.stringify(obj, null, 2)
				: JSON.stringify(obj);
		}
		return obj.toString();
	}

	/*
		Wraps the tokens with color stop codes
	 */
	private static ConsoleColorStopRegex = /%c/g;
	private wrapTokenWithStyles(token: string) {
		if (this.options.styled)
			return "%c" + token.replace(MistLogger.ConsoleColorStopRegex, "") + "%c";
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

		const outputLogStyles: string[] = [];

		for (const pattern of this.parsedPatterns) {
			switch (pattern) {
				// Parsing messages require a extra message parameter
				case MistLogger.Formatters["Message"].pattern: {
					const [parsedStr, styles] = this.replaceFormatterMessageToken(
						message,
						placeholderString,
						level
					);
					placeholderString = parsedStr;
					outputLogStyles.push(...styles);
					break;
				}

				// Logger level in text
				case MistLogger.Formatters["LevelText"].pattern: {
					const [parsedStr, styles] = this.replaceFormatterLogLevelTextToken(
						placeholderString,
						level // requires the level
					);
					placeholderString = parsedStr;
					outputLogStyles.push(...styles);
					break;
				}

				// Logger Level in Emoji
				case MistLogger.Formatters["LevelShort"].pattern: {
					const [parsedStr, styles] = this.replaceFormatterLogLevelShortToken(
						placeholderString,
						level // requires the level
					);
					placeholderString = parsedStr;
					outputLogStyles.push(...styles);
					break;
				}

				default: {
					const key = MistLogger.FormatterMap[pattern].name;
					const { regex, getValue, stylesProps } = MistLogger.Formatters[key];

					const styles = MistLogger.makeConsoleStyles(stylesProps);

					placeholderString = placeholderString.replace(
						regex,
						this.wrapTokenWithStyles(getValue(this.options))
					);
					outputLogStyles.push(styles, "");
					break;
				}
			}
		}
		return [placeholderString, outputLogStyles];
	}

	// Formatters["Message"]
	private replaceFormatterMessageToken(
		message: string,
		placeholderString: string,
		level: Values<typeof MistLogger.LogLevel>
	): [string, string[]] {
		const { regex, getValue, stylesProps } = MistLogger.Formatters.Message;
		const styles = MistLogger.makeConsoleStyles({
			...stylesProps,
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
		const { regex, getValue, stylesProps } = MistLogger.Formatters.LevelText;

		const styles = MistLogger.makeConsoleStyles({
			...stylesProps,
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
		const { regex, getValue, stylesProps } = MistLogger.Formatters.LevelShort;

		const styles = MistLogger.makeConsoleStyles({
			...stylesProps,
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
		this.parsedPatterns = this.parseFormatterFromPattern(this.options.pattern);
	}

	private static FormatterRegex = /%\w/g;
	private parseFormatterFromPattern(pattern: string) {
		let placeholderExtractorRegex = MistLogger.FormatterRegex;

		const placeholders = [];
		for (const match of pattern.matchAll(placeholderExtractorRegex)) {
			const pattern = match[0] as Pattern;
			if (MistLogger.FormatterMap[pattern] === undefined) {
				throw new Error(`Invalid formatter '${pattern}'`);
			}
			placeholders.push(pattern);
		}
		return placeholders as Pattern[];
	}

	private static LogLevel = {
		INFO: "Info",
		WARN: "Warning",
		ERROR: "Error",
		LOG: "Log",
	} as const;

	private static createFormatterMap() {
		/*
		  Map of formatters 
		eg:
			"%s": { name: "Message", regex: RegExp("%s")}
			"%n": { name: "LoggerName", regex: RegExp("%n")}
			 ... 
		 */

		const formatterPatterns: any = {};
		for (const [name, pattern] of Object.entries(LogPatterns)) {
			formatterPatterns[pattern] = { name, regex: new RegExp(pattern) };
		}
		return formatterPatterns as Record<
			Pattern,
			{ name: PatternName; regex: RegExp }
		>;
	}

	private static readonly FormatterMap: Record<
		Pattern,
		{ name: PatternName; regex: RegExp }
	> = MistLogger.createFormatterMap();

	private static readonly Formatters: Record<
		PatternName,
		{
			pattern: Pattern;
			regex: RegExp;
			getValue(
				options: LoggerOptions & {
					message?: string;
					level?: Values<typeof MistLogger.LogLevel>;
				}
			): string;
			stylesProps: Record<string, string>;
		}
	> = {
		Message: {
			pattern: LogPatterns.Message,
			stylesProps: { fontStyle: "italic" },
			regex: MistLogger.FormatterMap[LogPatterns.Message].regex,
			getValue(options) {
				if (options.message === undefined)
					throw new Error("message not provided");
				return options.message;
			},
		},

		LevelText: {
			pattern: LogPatterns.LevelText,
			stylesProps: {},
			regex: MistLogger.FormatterMap[LogPatterns.LevelText].regex,
			getValue(options) {
				if (!options.level) throw new Error("Level was not provided");
				return options.level;
			},
		},

		LevelShort: {
			pattern: LogPatterns.LevelShort,
			stylesProps: {},
			regex: MistLogger.FormatterMap[LogPatterns.LevelShort].regex,
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
			pattern: LogPatterns.LoggerName,
			stylesProps: {
				color: "transparent",
				fontWeight: "bold",
				fontSize: "1.4em",
				background: "linear-gradient(to right, orange, red)",
				padding: "5px",
				backgroundClip: "text",
			},

			regex: MistLogger.FormatterMap[LogPatterns.LoggerName].regex,
			getValue(options) {
				return options.name;
			},
		},

		PerformanceNow: {
			pattern: LogPatterns.PerformanceNow,
			stylesProps: {
				color: "pink",
			},
			regex: MistLogger.FormatterMap[LogPatterns.PerformanceNow].regex,
			getValue() {
				return `${performance.now().toFixed(2)}ms`;
			},
		},

		Year4Digits: {
			pattern: LogPatterns.Year4Digits,
			stylesProps: {},
			regex: MistLogger.FormatterMap[LogPatterns.Year4Digits].regex,
			getValue() {
				return MistLogger.Date.Year4Digit;
			},
		},

		Year2Digits: {
			pattern: LogPatterns.Year2Digits,
			stylesProps: {},
			regex: MistLogger.FormatterMap[LogPatterns.Year2Digits].regex,
			getValue() {
				return MistLogger.Date.Year2Digit;
			},
		},

		MonthNumber: {
			pattern: LogPatterns.MonthNumber,
			stylesProps: {},
			regex: MistLogger.FormatterMap[LogPatterns.MonthNumber].regex,
			getValue() {
				return MistLogger.Date.MonthDigit;
			},
		},

		MonthText: {
			pattern: LogPatterns.MonthText,
			stylesProps: {},
			regex: MistLogger.FormatterMap[LogPatterns.MonthText].regex,
			getValue() {
				return MistLogger.Date.MonthText;
			},
		},
		ShortDate: {
			pattern: LogPatterns.ShortDate,
			stylesProps: {
				color: "lightgreen",
			},
			regex: MistLogger.FormatterMap[LogPatterns.ShortDate].regex,
			getValue() {
				return new Date().toLocaleDateString();
			},
		},
		WeekDayDigit: {
			pattern: LogPatterns.WeekDayDigit,
			stylesProps: {
				color: "slateblue",
				fontStyle: "italic",
			},
			regex: MistLogger.FormatterMap[LogPatterns.WeekDayDigit].regex,
			getValue() {
				return MistLogger.Date.WeekDayDigit;
			},
		},

		WeekDayText: {
			pattern: LogPatterns.WeekDayText,
			stylesProps: {
				color: "slateblue",
				fontStyle: "italic",
			},
			regex: MistLogger.FormatterMap[LogPatterns.WeekDayText].regex,
			getValue() {
				return MistLogger.Date.WeekDayText;
			},
		},
	} as const;

	private static MonthFormatter = new Intl.DateTimeFormat("en", {
		month: "long",
	}).format;

	private static DayFormatter = new Intl.DateTimeFormat("en", {
		weekday: "long",
	}).format;

	private static Date = (() => {
		const date = new Date();
		const Year4Digit = date.getFullYear().toString();
		const Year2Digit = date.getFullYear().toString().slice(2);
		const MonthDigit = date.getMonth().toString();
		const MonthText = MistLogger.MonthFormatter(date);
		const WeekDayDigit = date.getDay().toString();
		const WeekDayText = MistLogger.DayFormatter(date);

		return {
			Year4Digit,
			Year2Digit,
			MonthDigit,
			MonthText,
			WeekDayDigit,
			WeekDayText,
		};
	})();

	private static makeConsoleStyles(styles: Record<string, string>) {
		let stylesStr = "";
		for (const [k, v] of Object.entries(styles)) {
			stylesStr += `${camelToDashCase(k)}: ${v}; `;
		}
		return stylesStr;
	}
}
