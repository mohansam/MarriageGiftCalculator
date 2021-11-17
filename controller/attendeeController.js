const User = require("../models/userModel");
const Attendee = require("../models/attendeeModel");
const inputValidator = require("../middelware/inputValidator");

//verifying userid this function not used
module.exports.verify_user_id = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    if (user == null) {
      return res.status(404).json({ message: "Cannot find user" });
    }
  } catch (err) {
    return res.status(500).json({ message2: err });
  }
  next();
};

//getting one attendee
get_one_attendee = async (req, res) => {
  const attendee = await Attendee.find({
    AttendeeUser: req.params.userId,
    _id: req.body.AttendeeId,
  });
  if (!attendee.length) {
    err = JSON.stringify({
      type: "m",
      statusCode: 404,
      errors: [{ msg: "attendeeId not found" }],
    });
    throw Error(err);
  }
  return attendee[0];
};

// Getting all the attendee
module.exports.get_all_attendee = async (req, res) => {
  try {
    const attendee = await Attendee.find(
      { AttendeeUser: req.params.userId },
      {
        _id: true,
        AttendeeName: true,
        AttendeeCity: true,
        AttendeeAmount: true,
      }
    );
    res.status(200).json(attendee);
  } catch (err) {
    inputValidator.error_handler(err, req, res);
  }
};

//Creating new attendee
module.exports.create_new_attendee = async (req, res) => {
  try {
    const err = await inputValidator.error_validation(
      req,
      res,
      inputValidator.attendee_creation_validation
    );
    if (!err) {
      const attendee = new Attendee({
        AttendeeName: req.body.AttendeeName,
        AttendeeAmount: req.body.AttendeeAmount,
        AttendeeCity: req.body.AttendeeCity,
        AttendeeUser: req.params.userId,
      });
      const { AttendeeName, AttendeeAmount, AttendeeCity, _id } =
        await attendee.save();
      await updateTotalamount(req.params.userId);
      res.status(201).json({ AttendeeName, AttendeeAmount, AttendeeCity, _id });
    }
  } catch (err) {
    inputValidator.error_handler(err, req, res);
  }
};

//Updating one attendee
module.exports.update_one_attendee = async (req, res) => {
  try {
    const inputValidationError = await inputValidator.error_validation(
      req,
      res,
      inputValidator.update_attendee_validation
    );
    if (!inputValidationError) {
      var attendee = await get_one_attendee(req, res);
      attendee.AttendeeName = req.body.AttendeeName;
      attendee.AttendeeAmount = req.body.AttendeeAmount;
      attendee.AttendeeCity = req.body.AttendeeCity;
      const { AttendeeName, AttendeeAmount, AttendeeCity, _id } =
        await attendee.save();
      await updateTotalamount(req.params.userId);
      res.status(200).json({ AttendeeName, AttendeeAmount, AttendeeCity, _id });
    }
  } catch (err) {
    inputValidator.error_handler(err, req, res);
  }
};

//deleting one attendees related to that users
//
module.exports.delete_one_attendee = async (req, res) => {
  try {
    const inputValidationError = await inputValidator.error_validation(
      req,
      res,
      inputValidator.delete_attendee_validation
    );
    if (!inputValidationError) {
      const { deletedCount } = await Attendee.deleteMany({
        _id: req.body.AttendeeId,
        AttendeeUser: req.params.userId,
      });
      if (deletedCount >= 1) {
        writeData(req.params.userId);
        return res
          .status(200)
          .json({ message: `${deletedCount} attendee deleted` });
      }

      err = JSON.stringify({
        type: "m",
        statusCode: 404,
        errors: [{ msg: "attendee not found" }],
      });
      throw Error(err);
    }
  } catch (err) {
    inputValidator.error_handler(err, req, res);
  }
};

//
let clients = [];
async function updateTotalamount(userId) {
  const totalAmount = await Attendee.aggregate([
    { $match: { AttendeeUser: userId } },
    {
      $group: {
        _id: null,
        userTotalAmount: { $sum: "$AttendeeAmount" },
      },
    },
  ]);
  if (totalAmount.length == 0) writeData(req.params.userId, totalAmount);
  pushData(userId, totalAmount[0].userTotalAmount);
}

module.exports.user_total_amount = async (req, res) => {
  try {
    res.setHeader("Content-type", "text/event-stream");
    req.params.clientId = Date.now();
    const newClient = {
      userId: req.params.userId,
      clientUniqueId: req.params.clientUniqueId,
      clientId: req.params.clientId,
      res,
    };
    clients.push(newClient);
    console.log(clients);
    await updateTotalamount(req.params.userId);

    //if (totalAmount.length == 0)
    //return res.status(200).json({ totalAmount: 0 });
    //res.status(200).json({ totalAmount: totalAmount[0].userTotalAmount });

    req.on("close", () => {
      console.log(`${req.params.clientId} Connection closed`);
      clients = clients.filter(
        (client) => client.clientId !== req.params.clientId
      );
      console.log(clients);
    });
  } catch (err) {
    inputValidator.error_handler(err, req, res);
  }
};

async function pushData(userId, totalAmount) {
  selctiveClient = clients.filter((client) => client.userId === userId);
  selctiveClient.forEach(async (client) => {
    client.res.write("data: " + `${totalAmount}\n\n`);
  });
}
//search attendee by name
module.exports.search_attendee_name = async (req, res) => {
  try {
    const inputValidationError = await inputValidator.error_validation(
      req,
      res,
      inputValidator.search_attendee_name_validation
    );
    if (!inputValidationError) {
      var searchAttendeeName = req.query.AttendeeName;
      const searchRegx = new RegExp(`^${searchAttendeeName}`, "gi");
      const searchValue = await Attendee.find(
        {
          AttendeeUser: req.params.userId,
          AttendeeName: { $regex: searchRegx },
        },
        {
          _id: true,
          AttendeeName: true,
          AttendeeCity: true,
          AttendeeAmount: true,
        }
      );
      res.status(200).json(searchValue);
    }
  } catch (err) {
    inputValidator.error_handler(err, req, res);
  }
};

//search attendee by city
module.exports.search_attendee_city = async (req, res) => {
  try {
    const inputValidationError = await inputValidator.error_validation(
      req,
      res,
      inputValidator.search_attendee_city_validation
    );
    if (!inputValidationError) {
      var searchAttendeeCity = req.query.AttendeeCity;
      const searchRegx = new RegExp(`^${searchAttendeeCity}`, "gi");
      const searchValue = await Attendee.find(
        {
          AttendeeUser: req.params.userId,
          AttendeeCity: { $regex: searchRegx },
        },
        {
          _id: true,
          AttendeeName: true,
          AttendeeCity: true,
          AttendeeAmount: true,
        }
      );
      res.status(200).json(searchValue);
    }
  } catch (err) {
    inputValidator.error_handler(err, req, res);
  }
};
