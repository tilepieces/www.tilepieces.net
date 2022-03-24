const menuToggle = document.getElementById("menuToggle");
const menuNav = document.getElementById("menuNav");
menuToggle.addEventListener("click",e=>{
  menuToggle.classList.toggle("checked");
  menuNav.classList.toggle("open");
});