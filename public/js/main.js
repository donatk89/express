// script((src = "https://code.jquery.com/jquery-3.5.1.min.js"));
// script.$(document).ready(function () {
//   $(".delete-medicine").on("click", function (e) {
//     $target = $(e.target);
//     const id = $target.attr("data-id");
//     $.ajax({
//       type: "DELETE",
//       url: "/medicine/delete/" + id,
//       success: function (response) {
//         //alert("Deleting medicine");
//         window.location.href = "/";
//       },
//       error: function (err) {
//         console.log(err);
//       },
//     });
//   });
// });

// // Event handler for submitting a search form
// $(".search-form").on("submit", function (e) {
//   e.preventDefault(); // Prevent the form from submitting normally
//   var searchQuery = $(this).find("input[name='search']").val();

//   // Perform the search using the searchQuery variable
//   // You can make an AJAX request to the server or handle the search logic here

//   // Example: Redirect to a search results page
//   window.location.href = "/search?q=" + encodeURIComponent(searchQuery);
// });
//});

// import axios from "axios";

// document
//   .getElementById("delete-medicine")
//   .addEventListener("click", function (event) {
//     const medicineId = event.target.getAttribute("dataid");

//     axios
//       .delete(
//         "http://localhost:3000/medicine/delete/:id" + medicineId
//         //event.target.getAttribute("dataid")
//       )
//       .then((response) => {
//         console.log(response);
//         alert("deleting post");
//         window.location = "/";
//       })
//       .catch((error) => console.log(error));
//   });

// script((src = "https://code.jquery.com/jquery-3.5.1.min.js"));
// script.$(document).ready(function () {
//   $(".delete-medicine").on("click", function (e) {
//     e.preventDefault();
//     var medicineId = $(this).data("id");
//     deleteMedicine(medicineId);
//   });

//   function deleteMedicine(medicineId) {
//     $.ajax({
//       url: "/medicine/delete/" + medicineId,
//       type: "POST",
//       success: function (response) {
//         if (response.success) {
//           // Reload the page or perform any additional actions
//           window.location.reload();
//         } else {
//           console.error("Failed to delete medicine");
//         }
//       },
//       error: function (xhr, status, error) {
//         console.error("AJAX request failed:", error);
//       },
//     });
//   }
// });
script((src = "https://code.jquery.com/jquery-3.5.1.min.js"));
script.$(
  // Update current date and time in navbar
  function updateDateTime() {
    const dateTimeElement = document.getElementById("currentDateTime");
    const now = new Date();
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    };
    const formattedDateTime = now.toLocaleDateString(undefined, options);
    dateTimeElement.textContent = formattedDateTime;
  }
);
updateDateTime(); // Update immediately
setInterval(updateDateTime, 1000); // Update every second

// script((src = "https://code.jquery.com/jquery-3.5.1.min.js"));
// script.$
// var date = new Date();
// document.getElementById("datetime").innerHTML = date.toString();
