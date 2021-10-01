(function ($) {
  "use strict";

  /*==================================================================
    [ Validate ]*/
  var input = $("#signupValidator").children();
  $("#signupForm").on("submit", function (e) {
    e.preventDefault();
    var check = true;
    disbaleLoginButton();
    for (var i = 0; i < input.length; i++) {
      if (validate(input[i].firstElementChild) == false) {
        showValidate(input[i].firstElementChild);
        check = false;
      }
    }

    if (check) {
      check = doSignup();
    }
  });

  $("#signupValidator .input100").each(function () {
    $(this).focus(function () {
      hideValidate(this);
    });
  });

  function validate(input) {
    if ($(input).attr("type") == "email" || $(input).attr("name") == "email") {
      if (
        $(input)
          .val()
          .trim()
          .match(
            /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/
          ) == null
      ) {
        return false;
      }
    } else {
      if ($(input).val().trim() == "") {
        return false;
      }
    }
  }

  function showValidate(input, errorMessage) {
    var thisAlert = $(input).parent();
    if (errorMessage != undefined) {
      $(thisAlert).attr("data-validate", errorMessage);
    }
    $(thisAlert).addClass("alert-validate");
    disbaleLoginButton();
  }

  function hideValidate(input) {
    var thisAlert = $(input).parent();
    enableLoginButton();
    $(thisAlert).removeClass("alert-validate");
  }

  function disbaleLoginButton() {
    $("#signupButton").removeClass("login_hover");
    $("#signupButton").attr("disabled", true);
  }
  function enableLoginButton() {
    $("#signupButton").addClass("login_hover");
    $("#signupButton").attr("disabled", false);
  }
  //function post login
  async function doSignup() {
    var UserName = $("#signupUserName").val();
    var UserEmail = $("#signupUserEmail").val();
    var UserPwd = $("#signupUserPwd").val();
    $("#signupLoader").addClass("lds-ellipsis");
    console.log({ UserEmail, UserPwd });
    const URI = window.origin + "/api/v1/user/signup";
    try {
      const res = await fetch(URI, {
        method: "POST",
        body: JSON.stringify({ UserName, UserEmail, UserPwd }),
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      $("#signupLoader").removeClass("lds-ellipsis");
      console.log(data);
      if (data.error) {
        const postError = data.error;
        postError.forEach((element) => {
          var elementName = `#signup${element.param}`;
          console.log(elementName);
          showValidate($(elementName), element.msg);
        });
      } else {
        location.assign("/Attendee/Attendee.html");
      }
    } catch (err) {
      console.log("from catch");
      console.log(err);
    }
  }
})(jQuery);
