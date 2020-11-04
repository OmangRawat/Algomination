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
    document.getElementById('lineDrawing').style.visibility = "hidden";
    document.getElementById('lineDrawing').style.width = '0';
    document.getElementById('lineDrawing').style.height = '0';
    document.getElementById('imgcontainer').style.width = '75vw';
    document.getElementById('imgcontainer').style.height = '70vh';
    document.getElementById('info').style.width = '75vw';
    document.getElementById('info').style.height = '100vh';
}