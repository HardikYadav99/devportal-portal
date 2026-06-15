
require("dotenv").config();

const express = require("express");
const cors = require("cors");

const deployRoutes = require("./routes/deployRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/", deployRoutes);

const server = app.listen(5050, () => {
    console.log("Backend is running on port 5050");
});

server.on("error", (err) => {
    console.error("SERVER ERROR:", err);
});