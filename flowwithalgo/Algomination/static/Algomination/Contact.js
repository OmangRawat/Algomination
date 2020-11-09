function openNav1() 
{
    document.getElementById("mySidenav2").style.width = "0";
    document.getElementById("mySidenav3").style.width = "0";
    document.getElementById("mySidenav1").style.width = "50vw";
    if(window.innerWidth <= 800)
    {
        document.getElementById("mySidenav1").style.width = "100%";
    }
}

function openNav2() 
{
    
    document.getElementById("mySidenav1").style.width = "0";
    document.getElementById("mySidenav2").style.width = "50vw";
    document.getElementById("mySidenav3").style.width = "0";
    if(window.innerWidth <= 800)
    {
        document.getElementById("mySidenav2").style.width = "100%";
    }
}

function openNav3() {

    document.getElementById("mySidenav1").style.width = "0";
    document.getElementById("mySidenav2").style.width = "0";
    document.getElementById("mySidenav3").style.width = "50vw";
    if(window.innerWidth <= 800)
    {
        document.getElementById("mySidenav3").style.width = "100%";
    }
}
  
  
  // function closeNav() {
  //   document.getElementById("mySidenav").style.width = "0";
  // }
