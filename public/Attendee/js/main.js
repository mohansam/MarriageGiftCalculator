(function ($) {
  "use strict";

  $(document).ready(function () {
    getAttendee();
    function alignModal() {
      var modalDialog = $(this).find(".modal-dialog");

      // Applying the top margin on modal to align it vertically center
      modalDialog.css(
        "margin-top",
        Math.max(0, ($(window).height() - modalDialog.height()) / 2)
      );
    }
    // Align modal when it is displayed
    $(".modal").on("shown.bs.modal", alignModal);

    // Align modal when user resize the window
    $(window).on("resize", function () {
      $(".modal:visible").each(alignModal);
    });
  });

  function renderTableRow(input, rownumber) {
    var tBody = document.querySelector("#tBody");
    var r1 = tBody.insertRow(rownumber);
    r1.setAttribute("id", input._id);
    r1.innerHTML = `<td class="column1">${input.AttendeeName}</td>
									<td class="column2">${input.AttendeeAmount}</td>
									<td class="column3">${input.AttendeeCity}</td>
									<td class="column3">
										<a href="#editEmployeeModal" class="edit" data-toggle="modal" style="width: 40px;"><i class="material-icons"
												data-toggle="tooltip" title="Edit">&#xE254;</i><br>
											<a href="#deleteEmployeeModal" class="delete" data-toggle="modal"><i class="material-icons"
													data-toggle="tooltip" title="Delete">&#xE872;</i></a>
									</td>`;
    var editId = `#${input._id} .edit`;
    var deleteId = `#${input._id} .delete`;
    $(editId).on("click", (event) => {
      editUserPopulateTable(event.target);
    });
    $(deleteId).on("click", (event) => {
      deleteUserPopulateTable(event.target);
    });
  }
  function updateTableRow(input) {
    var row = document.getElementById(input._id);
    row.children[0].innerText = input.AttendeeName;
    row.children[1].innerText = input.AttendeeAmount;
    row.children[2].innerText = input.AttendeeCity;
  }
  async function getAttendee() {
    try {
      const URI = window.origin + "/api/v1/attendee/getattendee";
      const res = await fetch(URI, {
        method: "GET",
        body: null,
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      console.log(data);
      if (data.error) {
        console.log("errordata");
      } else {
        data.forEach((element) => {
          renderTableRow(element, 0);
        });
      }
    } catch (err) {
      console.log("from catch");
      console.log(err);
    }
  }

  function editUserPopulateTable(ele) {
    if ($(ele).hasClass("edit")) {
      ele = ele.children[0];
    }
    var row = ele.parentElement.parentElement.parentElement;
    var id = "_" + row.attributes.id.value;
    var updateForm = document.getElementById("updateForm").children[0];
    updateForm.setAttribute("id", id);
    document.getElementById("updateUserName").value = row.children[0].innerText;
    document.getElementById("updateUserAmount").value =
      row.children[1].innerText;
    document.getElementById("updateUserCity").value = row.children[2].innerText;
  }

  function deleteUserPopulateTable(ele) {
    var row = ele.parentElement.parentElement.parentElement;
    var id = "_" + row.attributes.id.value;
    var deleteElment = document.getElementById("hdeleteUser").children[0];
    deleteElment.setAttribute("id", id);
    deleteElment.innerText = `Delete ${row.children[0].innerText}`;
  }

  $("#deleteButton").on("click", () => {
    $("#deleteButton").attr("disabled", true);
    $("#deleteModelCloseButton").attr("disabled", true);
    var deleteElment = document.getElementById("hdeleteUser").children[0];
    var id = deleteElment.attributes.id.value.substr(1);
    deleteAttendee(id);
  });

  $("#deleteModelCloseButton").on("click", () => {
    $("#deleteButton").attr("disabled", false);
    document.getElementById("deleteAlert").innerText = "";
  });

  async function deleteAttendee(id) {
    try {
      $("#deleteLoader").addClass("lds-ellipsis");
      const URI = window.origin + "/api/v1/attendee/deleteattendee";
      const res = await fetch(URI, {
        method: "DELETE",
        body: JSON.stringify({ AttendeeId: id }),
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      console.log(data);
      if (data.error) {
        $("#deleteLoader").removeClass("lds-ellipsis");
        $("#deleteModelCloseButton").attr("disabled", false);
      } else {
        document.getElementById("deleteAlert").innerText = "Deleted!";
        document.getElementById(id).remove();
        console.log(data);
        $("#deleteLoader").removeClass("lds-ellipsis");
        $("#deleteModelCloseButton").attr("disabled", false);
      }
    } catch (err) {
      $("#deleteLoader").removeClass("lds-ellipsis");
      $("#deleteModelCloseButton").attr("disabled", false);
      console.log("from catch");
      console.log(err);
    }
  }

  $("#updateButton").on("click", () => {
    $("#updateButton").attr("disabled", true);
    $("#updateModelCloseButton").attr("disabled", true);
    updateAttendee();
  });

  $("#updateModelCloseButton").on("click", () => {
    $("#updateButton").attr("disabled", false);
    document.getElementById("updateAlert").innerText = "";
  });

  async function updateAttendee() {
    try {
      $("#updateLoader").addClass("lds-ellipsis");
      const URI = window.origin + "/api/v1/attendee/updateattendee";
      const AttendeeName = document.getElementById("updateUserName").value;
      const AttendeeAmount = document.getElementById("updateUserAmount").value;
      const AttendeeCity = document.getElementById("updateUserCity").value;
      var updateForm = document.getElementById("updateForm").children[0];
      const AttendeeId = updateForm.attributes.id.value.substr(1);
      const res = await fetch(URI, {
        method: "PATCH",
        body: JSON.stringify({
          AttendeeName,
          AttendeeAmount,
          AttendeeCity,
          AttendeeId,
        }),
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (data.error) {
        console.log("errordata");
        $("#updateLoader").removeClass("lds-ellipsis");
        $("#updateModelCloseButton").attr("disabled", false);
        $("#updateButton").attr("disabled", false);
      } else {
        updateTableRow(data);
        $("#updateLoader").removeClass("lds-ellipsis");
        $("#updateModelCloseButton").attr("disabled", false);
        $("#updateButton").attr("disabled", false);
        document.getElementById("updateAlert").innerText = "Updated!";
      }
    } catch (err) {
      console.log("from catch");
      console.log(err);
      $("#updateLoader").removeClass("lds-ellipsis");
      $("#updateModelCloseButton").attr("disabled", false);
    }
  }
})(jQuery);
