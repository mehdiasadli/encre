export const fileTransport = {
	target: "pino-roll",
	options: {
		file: "./logs/app.log", // Base filename

		// ROTATION RULES
		frequency: "daily", // Rotate once a day. Options: 'daily', 'hourly', etc.
		size: "10m", // Rotate if file size exceeds 10MB
		mkdir: true, // Auto-create the ./logs folder

		// LIMITING (Cleanup)
		limit: {
			count: 14, // Keep only the last 14 log files
		},

		// PERFORMANCE
		sync: false, // Asynchronous logging (faster)
	},
};

export const prettyTransport = {
	target: "pino-pretty",
	options: {
		colorize: true,
		ignore: "pid,hostname",
		translateTime: "SYS:standard",
	},
};

export const standardConsoleTransport = {
	target: "pino/file",
	options: { destination: 1 }, // 1 = stdout
};
