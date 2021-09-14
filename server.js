require("dotenv").config();

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = process.env.port || 8000;

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true });
const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to Database"));

app.use(express.json());

const userRoute = require("./routes/userRoute");
app.use("/api/user", userRoute);

const attendeeRoute = require("./routes/attendeeRoute");
app.use("/api/attendee", attendeeRoute);

app.get("/", (req, res) => {
  res.send("hi");
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
