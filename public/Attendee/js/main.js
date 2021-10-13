(function ($) {
  ("use strict");

  $(document).ready(function () {
    renderSkleton(state.rows);
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
        var deleteElment = document.getElementById("hdeleteUser").children[0];
        deleteElment.innerText = "";
        getTotalAmount();
        state.querySet = state.querySet.filter((item) => {
          if (item._id != id) return true;
        });
        buildTable();
        $("#deleteLoader").removeClass("lds-ellipsis");
        $("#deleteModelCloseButton").attr("disabled", false);
        setTimeout(function () {
          $("#deleteEmployeeModal").modal("hide");
          $("#deleteButton").attr("disabled", false);
          document.getElementById("deleteAlert").innerText = "";
        }, 490);
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
  autocomplete(document.getElementById("updateUserCity"));
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
        getTotalAmount();
        var pos = state.querySet.findIndex((item) => item._id === data._id);
        state.querySet[pos] = data;
        buildTable();
        $("#updateLoader").removeClass("lds-ellipsis");
        document.getElementById("updateAlert").innerText = "Updated!";
        setTimeout(function () {
          $("#editEmployeeModal").modal("hide");
          $("#updateModelCloseButton").attr("disabled", false);
          $("#updateButton").attr("disabled", false);
          document.getElementById("updateAlert").innerText = "";
        }, 490);
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
    $("#logout").addClass("active");
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
      $("#totalAmount").addClass("active");

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
        $("#totalAmount").removeClass("active");
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
        if (state.querySet) {
          state.querySet.unshift(data);
        } else {
          state.querySet = [data];
        }

        buildTable();
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

  autocomplete(document.getElementById("addUserCity"));
  function autocomplete(inp, arr) {
    arr = [];
    /*the autocomplete function takes two arguments,
  the text field element and an array of possible autocompleted values:*/
    var currentFocus;
    /*execute a function when someone writes in the text field:*/
    inp.addEventListener("input", function (e) {
      if (state.querySet && !state.fromSearch) {
        arr = state.querySet.map((item) =>
          item.AttendeeCity.toLocaleLowerCase()
        );
        arr = [...new Set(arr)];
      }

      var a,
        b,
        i,
        val = this.value;
      /*close any already open lists of autocompleted values*/
      closeAllLists();
      if (!val) {
        return false;
      }
      currentFocus = -1;
      /*create a DIV element that will contain the items (values):*/
      a = document.createElement("DIV");
      a.setAttribute("id", this.id + "autocomplete-list");
      a.setAttribute("class", "autocomplete-items");
      /*append the DIV element as a child of the autocomplete container:*/
      this.parentNode.appendChild(a);
      /*for each item in the array...*/
      for (i = 0; i < arr.length; i++) {
        /*check if the item starts with the same letters as the text field value:*/
        if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
          /*create a DIV element for each matching element:*/
          b = document.createElement("DIV");
          /*make the matching letters bold:*/
          b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
          b.innerHTML += arr[i].substr(val.length);
          /*insert a input field that will hold the current array item's value:*/
          b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
          /*execute a function when someone clicks on the item value (DIV element):*/
          b.addEventListener("click", function (e) {
            /*insert the value for the autocomplete text field:*/
            inp.value = this.getElementsByTagName("input")[0].value;
            /*close the list of autocompleted values,
              (or any other open lists of autocompleted values:*/
            closeAllLists();
          });
          a.appendChild(b);
        }
      }
    });
    /*execute a function presses a key on the keyboard:*/
    inp.addEventListener("keydown", function (e) {
      var x = document.getElementById(this.id + "autocomplete-list");
      if (x) x = x.getElementsByTagName("div");
      if (e.keyCode == 40) {
        /*If the arrow DOWN key is pressed,
        increase the currentFocus variable:*/
        currentFocus++;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 38) {
        //up
        /*If the arrow UP key is pressed,
        decrease the currentFocus variable:*/
        currentFocus--;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 13) {
        /*If the ENTER key is pressed, prevent the form from being submitted,*/
        e.preventDefault();
        if (currentFocus > -1) {
          /*and simulate a click on the "active" item:*/
          if (x) x[currentFocus].click();
        }
      }
    });
    function addActive(x) {
      /*a function to classify an item as "active":*/
      if (!x) return false;
      /*start by removing the "active" class on all items:*/
      removeActive(x);
      if (currentFocus >= x.length) currentFocus = 0;
      if (currentFocus < 0) currentFocus = x.length - 1;
      /*add class "autocomplete-active":*/
      x[currentFocus].classList.add("autocomplete-active");
    }
    function removeActive(x) {
      /*a function to remove the "active" class from all autocomplete items:*/
      for (var i = 0; i < x.length; i++) {
        x[i].classList.remove("autocomplete-active");
      }
    }
    function closeAllLists(elmnt) {
      /*close all autocomplete lists in the document,
    except the one passed as an argument:*/
      var x = document.getElementsByClassName("autocomplete-items");
      for (var i = 0; i < x.length; i++) {
        if (elmnt != x[i] && elmnt != inp) {
          x[i].parentNode.removeChild(x[i]);
        }
      }
    }
    /*execute a function when someone clicks in the document:*/
    document.addEventListener("click", function (e) {
      closeAllLists(e.target);
    });
  }

  //search table
  var check = false;
  $("#search").on("keyup", () => {
    var searchinput = $("#search").val();
    if (searchinput.length == 0 && check) {
      removeTableRow();
      renderSkleton(state.rows);
      state.fromSearch = false;
      getListOfAttendee();
      check = false;
    }
    if (searchinput.length >= 3) {
      removeTableRow();
      renderSkleton(state.rows);
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
    rows: 9,
    window: 5,
    searchPage: 1,
    fromSearch: false,
  };
  function getWindowSize() {
    if (window.innerWidth < 768) {
      state.rows = 4;
      return;
    } else if (window.innerWidth < 991) {
      state.rows = 8;

      return;
    } else {
      state.rows = 9;

      return;
    }
  }
  getWindowSize();
  window.onresize = function () {
    if (window.innerWidth < 768) {
      state.rows = 4;
      buildTable();
      return;
    } else if (window.innerWidth < 991) {
      buildTable();
      state.rows = 8;
      return;
    } else {
      buildTable();
      state.rows = 9;
      return;
    }
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
      const statusCode = await res.status;

      if (data.error) {
        if (statusCode == 401) {
          unauthorizedError();
        }
        console.log(statusCode);
      } else {
        if (data.length > 0) {
          state.querySet = data.reverse();
          buildTable();
          return;
        }
        removeTableRow();
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
    for (var page = maxLeft + 1; page < maxRight; page++) {
      wrapper.innerHTML += `<button value=${page} id=${page} class="page btn btn-sm btn-info">${page}</button>`;
    }
    if (pages > 1) {
      wrapper.innerHTML =
        `<button value=${1} id=${1} class="page btn btn-sm btn-info">&#171; First</button>` +
        wrapper.innerHTML;
      wrapper.innerHTML += `<button value=${pages} id=${pages} class="page btn btn-sm btn-info">Last &#187;</button>`;
    }

    $(".page").on("click", function () {
      removeTableRow();
      if (state.fromSearch) {
        state.searchPage = Number($(this).val());
      } else {
        state.tablePage = Number($(this).val());
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
    $(`#${state.page}`).addClass("active");
  }

  //end of pagination

  //to handle 401 error
  function unauthorizedError() {
    document.cookie =
      "loggedinstatus=;expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    location.assign("/User/user.html");
  }

  //download PDF
  $("#downloadPDF").on("click", (e) => {
    e.preventDefault();
    getAllttendee();
  });
  async function getAllttendee() {
    try {
      $("#downloadPDF").addClass("active");
      const URI = window.origin + "/api/v1/attendee/getattendee";
      const res = await fetch(URI, {
        method: "GET",
        body: null,
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      const statusCode = await res.status;

      if (data.error) {
        if (statusCode == 401) {
          unauthorizedError();
        }
        console.log(statusCode);
      } else {
        if (data.length > 0) {
          downloadPDF(data);
          $("#downloadPDF").removeClass("active");
          return;
        }
      }
    } catch (err) {
      console.log("from catch");
      console.log(err);
    }
  }
  function downloadPDF(data) {
    window.jsPDF = window.jspdf.jsPDF;
    const doc = new jsPDF("p", "mm");
    var i = 1;
    body = data.map((item) => [
      i++,
      item.AttendeeName,
      item.AttendeeAmount,
      item.AttendeeCity,
    ]);
    doc.autoTable({
      head: [["ID", "Name", "Amount", "Country"]],
      body: body,
      theme: "grid",
      tableWidth: 180,
      styles: {},
      columnStyles: {},
    });

    doc.save("giverDetails");
  }
})(jQuery);
