class MistLogger {
	private format: string;

	constructor(format?: string) {
		this.format = "$TYPE: $DATA $DATE";
		if (format) this.format = format;
	}

	log() {}

	warn() {}

	error() {}

	setFormat(format: string) {
		this.format = format;
	}
}
