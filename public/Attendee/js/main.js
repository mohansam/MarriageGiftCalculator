(function ($) {
  ("use strict");

  $(document).ready(function () {
    renderSkleton(8);
    getListOfAttendee();

    getTotalAmount();
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

  //table data render
  function renderTableRow(input, rownumber) {
    if (!input) {
      var tBody = document.querySelector("#tBody");
      var r1 = tBody.insertRow(rownumber);
      r1.innerHTML = `<td class="column1">No user available</td>
									<td class="column2">-</td>
									<td class="column3">No city available</td>
									<td class="column3">
										<a href="javascript:void(0)" class="edit" data-toggle="modal" style="width: 40px; "><i class="material-icons"
												data-toggle="tooltip" title="Edit">&#xE254;</i><br>
											<a href="javascript:void(0)" class="delete" data-toggle="modal" ><i class="material-icons"
													data-toggle="tooltip" title="Delete">&#xE872;</i></a>
									</td>`;
      return;
    }
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

  function removeTableRow() {
    var tBody = document.querySelector("#tBody");
    const tRowLength = tBody.childElementCount;
    for (var i = 0; i < tRowLength; i++) {
      tBody.children[0].remove();
    }
  }

  function renderSkleton(numberOfRow) {
    var tBody = document.querySelector("#tBody");
    for (var i = 0; i < numberOfRow; i++) {
      var r1 = tBody.insertRow(0);
      r1.innerHTML = `<td class="column1"><div class="skeleton skeleton-text"></td>
									<td class="column2"><div class="skeleton skeleton-text"></td>
									<td class="column3"><div class="skeleton skeleton-text"></td>
									<td class="column3"><div class="skeleton skeleton-text"></td>`;
    }
  }
  //table data render-complted

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
        removeTableRow();
        if (data.length > 0) {
          data.forEach((element) => {
            renderTableRow(element, 0);
          });
          return;
        }
        renderTableRow();
      }
    } catch (err) {
      console.log("from catch");
      console.log(err);
    }
  }

  //delete user functionalty
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
      if (data.error) {
        document.getElementById("deleteAlert").innerText = "User not found";
        document.getElementById(id).remove();
        $("#deleteLoader").removeClass("lds-ellipsis");
        $("#deleteModelCloseButton").attr("disabled", false);
      } else {
        document.getElementById("deleteAlert").innerText = "Deleted!";
        getListOfAttendee();
        getTotalAmount();
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
  //end of delete user functionality

  //update function
  $("#updateButton").on("click", () => {
    $("#updateButton").attr("disabled", true);
    $("#updateModelCloseButton").attr("disabled", true);
    document.getElementById("updateAlert").innerText = "";
    updateAttendee();
  });

  $("#updateModelCloseButton").on("click", () => {
    $("#updateButton").attr("disabled", false);
    document.getElementById("updateAlert").innerText = "";
  });

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
        $("#updateButton").attr("disabled", true);
        document.getElementById("updateAlert").innerText = "User not found";
        document.getElementById(AttendeeId).remove();
        $("#updateLoader").removeClass("lds-ellipsis");
        $("#updateModelCloseButton").attr("disabled", false);
      } else {
        updateTableRow(data);
        getTotalAmount();
        getListOfAttendee();
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
  //update function end

  //logut
  $("#logout").on("click", () => {
    logout();
  });
  async function logout() {
    try {
      const URI = window.origin + "/api/v1/user/logout";
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
        location.assign("/User/user.html");
      }
    } catch (err) {
      console.log(err);
    }
  }

  //get total amount
  $("#totalAmount").on("click", (e) => {
    e.preventDefault();
    getTotalAmount();
  });
  async function getTotalAmount() {
    try {
      const URI = window.origin + "/api/v1/attendee/totalAmount";
      const res = await fetch(URI, {
        method: "GET",
        body: null,
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (data.error) {
        console.log("errordata");
      } else {
        console.log(data);
        document.getElementById(
          "totalAmount"
        ).innerText = `Total Amount ${data.totalAmount}`;
      }
    } catch (err) {
      console.log(err);
    }
  }

  //add user function
  $("#addButton").on("click", () => {
    $("#addButton").attr("disabled", true);
    $("#addModelCloseButton").attr("disabled", true);
    document.getElementById("addAlert").innerText = "";
    addAttendee();
  });

  $("#addModelCloseButton").on("click", () => {
    $("#addButton").attr("disabled", false);
    document.getElementById("addAlert").innerText = "";
  });

  async function addAttendee() {
    try {
      $("#addLoader").addClass("lds-ellipsis");
      const URI = window.origin + "/api/v1/attendee/createattendee";
      const AttendeeName = document.getElementById("addUserName").value;
      const AttendeeAmount = document.getElementById("addUserAmount").value;
      const AttendeeCity = document.getElementById("addUserCity").value;

      const res = await fetch(URI, {
        method: "POST",
        body: JSON.stringify({
          AttendeeName,
          AttendeeAmount,
          AttendeeCity,
        }),
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (data.error) {
        console.log("errordata");
        $("#addButton").attr("disabled", false);
        document.getElementById("addAlert").innerText = "User not found";
        $("#addLoader").removeClass("lds-ellipsis");
        $("#addModelCloseButton").attr("disabled", false);
      } else {
        getTotalAmount();
        state.tablePage = 1;
        getListOfAttendee();
        $("#addLoader").removeClass("lds-ellipsis");
        $("#addModelCloseButton").attr("disabled", false);
        $("#addButton").attr("disabled", false);
        document.getElementById("addUserName").value = "";
        document.getElementById("addUserAmount").value = "";
        document.getElementById("addUserCity").value = "";
        document.getElementById("addAlert").innerText = "Created";
      }
    } catch (err) {
      console.log("from catch");
      console.log(err);
      $("#addLoader").removeClass("lds-ellipsis");
      $("#addModelCloseButton").attr("disabled", false);
    }
  }
  //search table
  var check = false;
  $("#search").on("keyup", () => {
    var searchinput = $("#search").val();
    if (searchinput.length == 0 && check) {
      removeTableRow();
      renderSkleton(8);
      state.fromSearch = false;
      getListOfAttendee();
      check = false;
    }
    if (searchinput.length >= 3) {
      removeTableRow();
      renderSkleton(5);
      check = true;
      searchAttendeeName(searchinput);
    }
  });

  async function searchAttendeeName(value) {
    try {
      var pageButton = document.getElementById("pagination-wrapper");
      while (pageButton.firstChild) {
        pageButton.removeChild(pageButton.firstChild);
      }
      const URI =
        window.origin +
        `/api/v1/attendee/searchattendeename?AttendeeName=${value}`;
      const res = await fetch(URI, {
        method: "GET",
        body: null,
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (data.error) {
        console.log("errordata");
      } else {
        if (data.length > 0) {
          removeTableRow();
          state.searchPage = 1;
          state.fromSearch = true;
          state.querySet = data;
          buildTable();
        } else {
          searchAttendeeCity(value);
        }
      }
    } catch (err) {
      console.log("from catch");
      console.log(err);
    }
  }
  async function searchAttendeeCity(value) {
    try {
      const URI =
        window.origin +
        `/api/v1/attendee/searchattendeecity?AttendeeCity=${value}`;
      const res = await fetch(URI, {
        method: "GET",
        body: null,
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (data.error) {
        console.log("errordata");
      } else {
        removeTableRow();
        if (data.length > 0) {
          state.searchPage = 1;
          state.fromSearch = true;
          state.querySet = data;
          buildTable();
        } else {
          renderTableRow();
        }
      }
    } catch (err) {
      console.log("from catch");
      console.log(err);
    }
  }
  //pagination
  var state = {
    querySet: "",
    tablePage: 1,
    page: 1,
    rows: 8,
    window: 5,
    searchPage: 1,
    fromSearch: false,
  };
  async function getListOfAttendee() {
    try {
      const URI = window.origin + "/api/v1/attendee/getattendee";
      const res = await fetch(URI, {
        method: "GET",
        body: null,
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();

      if (data.error) {
        console.log("errordata");
      } else {
        if (data.length > 0) {
          state.querySet = data.reverse();
          buildTable();
          return;
        }
        renderTableRow();
      }
    } catch (err) {
      console.log("from catch");
      console.log(err);
    }
  }

  function pagination(querySet, page, rows) {
    var trimStart = (page - 1) * rows;
    var trimEnd = trimStart + rows;
    console.log(querySet);
    var trimmedData = querySet.slice(trimStart, trimEnd);

    var pages;
    if (querySet.length % rows) {
      pages = Math.floor(querySet.length / rows) + 1;
      return {
        querySet: trimmedData,
        pages: pages,
      };
    }
    pages = querySet.length / rows;
    return {
      querySet: trimmedData,
      pages: pages,
    };
  }

  function pageButtons(pages, page) {
    var wrapper = document.getElementById("pagination-wrapper");

    wrapper.innerHTML = ``;

    var maxLeft = state.page - Math.floor(state.window / 2);
    var maxRight = state.page + Math.floor(state.window / 2);

    if (maxLeft < 1) {
      maxLeft = 1;
      maxRight = state.window;
    }

    if (maxRight > pages) {
      maxLeft = pages - (state.window - 1);

      if (maxLeft < 1) {
        maxLeft = 1;
      }
      maxRight = pages;
    }

    for (var page = maxLeft; page <= maxRight; page++) {
      wrapper.innerHTML += `<button value=${page} class="page btn btn-sm btn-info">${page}</button>`;
    }

    if (state.page != 1) {
      wrapper.innerHTML =
        `<button value=${1} class="page btn btn-sm btn-info">&#171; First</button>` +
        wrapper.innerHTML;
    }

    if (state.page != pages) {
      wrapper.innerHTML += `<button value=${pages} class="page btn btn-sm btn-info">Last &#187;</button>`;
    }

    $(".page").on("click", function () {
      removeTableRow();
      if (state.fromSearch) {
        state.searchPage = Number($(this).val());
        $(".btn").attr("disabled", true);
      } else {
        state.tablePage = Number($(this).val());
        $(".btn").attr("disabled", true);
      }

      buildTable();
    });
  }
  function buildTable() {
    if (state.fromSearch) {
      state.page = state.searchPage;
      var data = pagination(state.querySet, state.searchPage, state.rows);
    } else {
      state.page = state.tablePage;
      var data = pagination(state.querySet, state.tablePage, state.rows);
    }

    var myList = data.querySet;
    removeTableRow();
    myList.forEach((element) => {
      renderTableRow(element, -1);
    });
    pageButtons(data.pages);
  }

  //end of pagination
})(jQuery);
