/*
  Drop Down
  Close the dropdown if the user clicks outside of it
*/
window.onclick = function (e) {
  let myDropdown = document.getElementById("myDropdown");
  // When user is not logged in, remove the error in console
  if (myDropdown === null) {
    return;
  }

  myDropdown.classList.toggle("show");

  if (!e.target.matches('.dropbtn')) {
      if (myDropdown.classList.contains('show')) {
        myDropdown.classList.remove('show');
      }
  }
};