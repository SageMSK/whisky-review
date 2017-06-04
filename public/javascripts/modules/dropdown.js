/*
  Drop Down
  Close the dropdown if the user clicks outside of it
*/
window.onclick = function (e) {
  let myDropdown = document.getElementById("myDropdown");
  myDropdown.classList.toggle("show");

  if (!e.target.matches('.dropbtn')) {
      if (myDropdown.classList.contains('show')) {
        myDropdown.classList.remove('show');
      }
  }
};