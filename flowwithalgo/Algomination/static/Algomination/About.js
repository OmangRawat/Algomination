var lineDrawing = anime({
    targets: '#lineDrawing .lines path',
    strokeDashoffset: [anime.setDashoffset, 0],
    easing: 'easeInOutSine',
    duration: 3000,
    delay: function(el, i) { return i * 250 },
    direction: 'alternate',
    loop: true
});

function hide()
{
    //var x = document.getElementById('image').style.height;
    document.getElementById('lineDrawing').style.visibility = "hidden";
    document.getElementById('lineDrawing').style.width = '0';
    document.getElementById('lineDrawing').style.height = '0';
    document.getElementById('info').style.width = '75vw';
    //document.getElementById('info').style.height = '100vh';
    document.getElementById('info').style.height = 'fit-content';
    if (window.innerWidth <= 540)
    {
        console.log("................")
        document.getElementById('info').style.display = 'block';
        console.log(document.getElementById('info').style.display)
    }
    document.getElementById('imgcontainer').style.width = '75vw';
    // document.getElementById('imgcontainer').style.height = '70vh';
    document.getElementById('imgcontainer').style.height = 'fit-content';
    //document.getElementById('imgcontainer').style.height = x;
    // document.getElementById('info').style.width = '75vw';
    // document.getElementById('info').style.height = '100vh';
}