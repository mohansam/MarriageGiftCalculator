require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const helpData = require("./puplic/helpData");

const app = express();
const PORT = process.env.PORT || 5000;

//middelware
app.use(express.json());
app.use(cookieParser());

//db connection
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true });
const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to Database"));

//root route
app.get("/", (req, res) => {
  res
    .status(200)
    .json({ message: "this app is used to calculate marriage gift amount" });
});

//help route
app.get("/help", (req, res) => {
  res.status(200).json(helpData);
});

//user route
const userRoute = require("./routes/userRoute");
app.use("/api/user", userRoute);

//attendeeRoute
const attendeeRoute = require("./routes/attendeeRoute");
app.use("/api/attendee", attendeeRoute);

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
