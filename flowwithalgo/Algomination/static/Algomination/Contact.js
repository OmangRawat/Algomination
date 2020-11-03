/* Set the width of the side navigation to 250px */
function openNav1() 
{
    //document.getElementById("mySidenav").style.width = "250px";
    document.getElementById("mySidenav2").style.width = "0";
    document.getElementById("mySidenav3").style.width = "0";
    document.getElementById("mySidenav1").style.width = "50vw";
}

function openNav2() 
{
    //document.getElementById("mySidenav").style.width = "250px";
    document.getElementById("mySidenav1").style.width = "0";
    document.getElementById("mySidenav2").style.width = "50vw";
    document.getElementById("mySidenav3").style.width = "0";
}

function openNav3() {
//document.getElementById("mySidenav").style.width = "250px";
    document.getElementById("mySidenav1").style.width = "0";
    document.getElementById("mySidenav2").style.width = "0";
    document.getElementById("mySidenav3").style.width = "50vw";
}
  
  /* Set the width of the side navigation to 0 */
  function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
  }