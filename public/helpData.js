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
          "res-[UserName,UserEmail]",
        ],
      },
      {
        "login end point": [
          "method-Post",
          "body-[UserEmail,UserPwd]",
          "res-[UserName,UserEmail]",
        ],
      },
      {
        "delete end point": [
          "method-Delete",
          "body-[]",
          "res-[return count of deletd id]",
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
          "/api/attendee/searchattendeename",
          "/api/attendee/searchattendeecity",
        ],
      },
      {
        "getattendee end point": [
          "method-Get",
          "body-[]",
          "res-[[AttendeeName,AttendeeCity,AttendeeAmount,_Id]]",
          "Cookie-jwt(user id is populated from Cookie)",
        ],
      },
      {
        "createattendee end point": [
          "method-Post",
          "body-[AttendeeName,AttendeeAmount,AttendeeCity]",
          "res-[AttendeeName,AttendeeCity,AttendeeAmount,_Id]",
          "Cookie-jwt(user id is populated from Cookie)",
        ],
      },
      {
        "updateattendee end point": [
          "method-Patch",
          "body-[AttendeeName,AttendeeAmount,AttendeeCity,AttendeeId]",
          "res-[AttendeeName,AttendeeCity,AttendeeAmount,_Id]",
          "Cookie-jwt(user id is populated from Cookie)",
        ],
      },
      {
        "deleteattendee end point": [
          "method-Patch",
          "body-[AttendeeId]",
          "res-[return count of deletd id]",
          "Cookie-jwt(user id is populated from Cookie)",
        ],
      },
      {
        "searchattendeename end point": [
          "method-GET",
          "body-[],queryParameter-AttendeeName",
          "res-[[AttendeeName,AttendeeCity,AttendeeAmount,_Id]]",
          "Cookie-jwt(user id is populated from Cookie)",
        ],
      },
      {
        "searchattendeecity end point": [
          "method-GET",
          "body-[],queryParameter-AttendeeCity",
          "res-[[AttendeeName,AttendeeCity,AttendeeAmount,_Id]]",
          "Cookie-jwt(user id is populated from Cookie)",
        ],
      },
    ],
  },
];
