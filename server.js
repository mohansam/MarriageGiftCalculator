require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const helpData = require("./public/helpData");
const inputValidator = require(".//middelware/inputValidator");
const app = express();
const PORT = process.env.PORT || 5000;

//middelware

app.use(express.json({ strict: true }));
app.use(cookieParser());
app.use(express.static("public"));

//db connection
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true });
const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to Database"));

//root route
app.get("/", (req, res) => {
  console.log(req.hostname);
  res.status(200).json({
    message: "this app is used to calculate marriage gift money tracker",
  });
});

//help route
app.get("/help", (req, res) => {
  console.log(req);
  res.status(200).json(helpData);
});

//user route
const userRoute = require("./routes/userRoute");
app.use("/api/v1/user", userRoute);

//attendeeRoute
const attendeeRoute = require("./routes/attendeeRoute");
app.use("/api/v1/attendee", attendeeRoute);

//to handle unwanted route
app.use((req, res) => {
  try {
    throw Error(
      JSON.stringify({
        type: "m",
        statusCode: 404,
        errors: [{ msg: "end point not available" }],
      })
    );
  } catch (err) {
    inputValidator.error_handler(err, req, res);
  }
});

//to handle error
app.use(function (err, req, res, next) {
  inputValidator.error_handler(err, req, res);
});

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
