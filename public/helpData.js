module.exports.helpData = [
  {
    User: [
      {
        "User API end points": [
          "/api/user/signup",
          "/api/user/login",
          "/api/user/deleteuser",
        ],
      },
      {
        "Signup end point": [
          "method-Post",
          "body-[UserName,UserEmail,UserPwd]",
        ],
      },
      {
        "login end point": ["method-Post", "body-[UserEmail,UserPwd]"],
      },
      {
        "delete end point": [
          "method-Delete",
          "body-[]",
          "Cookie-jwt(user id is populated from Cookie)",
        ],
      },
    ],
  },
  {
    Attendee: [
      {
        "Attendee API end points": [
          "/api/attendee/getattendee",
          "/api/attendee/createattendee",
          "/api/attendee/updateattendee",
          "/api/attendee/deleteattendee",
        ],
      },
      {
        "getattendee end point": [
          "method-Get",
          "body-[]",
          "Cookie-jwt(user id is populated from Cookie)",
        ],
      },
      {
        "createattendee end point": [
          "method-Post",
          "body-[AttendeeName,AttendeeAmount,AttendeeCity]",
          "Cookie-jwt(user id is populated from Cookie)",
        ],
      },
      {
        "updateattendee end point": [
          "method-Patch",
          "body-[AttendeeName,AttendeeAmount,AttendeeCity,AttendeeId]",
          "Cookie-jwt(user id is populated from Cookie)",
        ],
      },
      {
        "deleteattendee end point": [
          "method-Patch",
          "body-[AttendeeID]",
          "Cookie-jwt(user id is populated from Cookie)",
        ],
      },
    ],
  },
];
