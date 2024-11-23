import 'dotenv/config';
import express from "express";
import mariadb from "mariadb";
import morgan from "morgan";
import { fileURLToPath } from "url";

const app = express();

const pool = mariadb.createPool({
	host: process.env.DBHOST || "localhost",
	user: process.env.DBUSER,
	password: process.env.DBPASS,
	database: process.env.DBNAME,
	connectionLimit: 5,
});

app.use(morgan("combined"));
app.use(express.static(fileURLToPath(new URL("./public", import.meta.url))));

app.get("/hi", (req, res) => {
	res.set("Content-Type", "text/plain");
	res.send("hi!");
});

app.use(async (req, res, next) => {
	const conn = await pool.getConnection();
	req.conn = conn;
	res.on("finish", () => {
		conn.end();
	});
	next();
});

app.get("/num", async (req, res) => {
	const rows = await req.conn.query("SELECT value FROM counter WHERE id = 1;");
	res.json({ counter: rows[0]?.value });
});

app.post("/num", async (req, res) => {
	const match = /^([+-]?\d+)$/.exec(req.query?.n);

	if (!match) {
		console.log(req.query);
		res.status(400).json({ error: "param" });
		return;
	}

	const num = Number(match[1]);

	await req.conn.query("UPDATE counter SET value = value + ? WHERE id = 1;", [
		num,
	]);
	const rows = await req.conn.query("SELECT value FROM counter WHERE id = 1;");
	res.json({ counter: rows[0]?.value });
});

app.use((err, req, res, next) => {
	console.error(err);
	res.status(500).json({ error: "internal" });
});

const server = app.listen(process.env.PORT || 3000, () => {
	console.log('Listening on port ' + server.address().port);
});

function shutDown() {
	server.close(() => {
		process.exit(0);
	});
}

process.on('SIGTERM', shutDown);
process.on('SIGINT', shutDown);
