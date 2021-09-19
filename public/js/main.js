(function ($) {
  "use strict";

  /*==================================================================
    [ Validate ]*/
  var input = $(".validate-input .input100");
  $("#loginForm").on("submit", function (e) {
    e.preventDefault();
    var check = true;

    for (var i = 0; i < input.length; i++) {
      if (validate(input[i]) == false) {
        showValidate(input[i]);
        check = false;
      }
    }
    if (check) {
      check = doLogin();
    }
  });

  $(".validate-form .input100").each(function () {
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
  }

  function hideValidate(input) {
    var thisAlert = $(input).parent();

    $(thisAlert).removeClass("alert-validate");
  }

  //function post login
  async function doLogin() {
    var UserEmail = $("#loginUserEmail").val();
    var UserPwd = $("#loginUserPwd").val();
    $("#loginLoader").addClass("lds-ellipsis");
    console.log({ UserEmail, UserPwd });
    try {
      const res = await fetch("api/v1/user/login", {
        method: "POST",
        body: JSON.stringify({ UserEmail, UserPwd }),
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      $("#loginLoader").removeClass("lds-ellipsis");
      console.log(data);
      if (data.error) {
        const postError = data.error;
        postError.forEach((element) => {
          var elementName = `#login${element.param}`;
          console.log(elementName);
          showValidate($(elementName), element.msg);
        });
      }
      //location.assign('home.html');
    } catch (err) {
      console.log("from catch");
      console.log(err);
    }
  }
})(jQuery);
