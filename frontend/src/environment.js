let server = "/api";
if (process.env.NODE_ENV === "development") {
	server = "http://localhost:8000";
} else if (process.env.REACT_APP_API_URL) {
	server = process.env.REACT_APP_API_URL;
}
export default server;