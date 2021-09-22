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
  var input = {
    _id: "614aa130210a1f0004d06578",
    AttendeeName: "navin",
    AttendeeAmount: 100,
    AttendeeCity: "Mula",
  };
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
    $(editId).on("click", editUserPopulateTable);
    $(deleteId).on("click", () => {
      console.log("delete");
    });
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

  function editUserPopulateTable() {
    console.log("hi");
    var editUserName = document.querySelector(
      "#editEmployeeModal > div > div > form > div:nth-child(1) > input"
    );
    var editUserAmount = document.querySelector(
      "#editEmployeeModal > div > div > form > div:nth-child(2) > input"
    );
    var editUserCity = document.querySelector(
      "#editEmployeeModal > div > div > form > div:nth-child(3) > input"
    );
    editUserName.value = "Sam";
    editUserAmount = 100;
    editUserCity = "tut";
  }
})(jQuery);
