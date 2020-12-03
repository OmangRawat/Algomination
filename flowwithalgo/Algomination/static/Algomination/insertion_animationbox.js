function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

var xunit = ((window.innerWidth)/100)
var jelement, keyelement, sectempelement, tempelement;
var i, j, key, counter;
let elems = document.getElementsByClassName('card');
var length = elems.length;
var done = 'F';
var temp = '', temptext = '';
//var change = (0.1 * document.getElementById('animation_box_main').style.width);
// var change = (0.0973 * window.screen.width);
var change = (7.1 * xunit)
console.log(window.screen.width);
for(i = 1; i < length;  i++){    
    task1(i);     
}//console.log("outer loop end");  
document.getElementById('directions').innerText = "<-- Lets Start Sorting the Array using Insertion Sort -->";

function task1(i) { 
    setTimeout(function() { 
        console.log("i: "+ i);
        keyelement = document.querySelector("#card" + (i + 1));
        key = parseFloat(keyelement.innerText);  
        j = i - 1; 
        jelement = document.querySelector("#card" + (j + 1));
        counter = 0;
        console.log(jelement);
        //keyelement.style.backgroundColor = "red";
        while(j >= 0 && (parseFloat(jelement.innerText)) > key){   
            task(j);
            j = j-1;
            console.log("j after: "+ j);
            if(j >= 0){
            jelement = document.querySelector("#card" + (j+1));
            //console.log("first/just before: " + jelement.id);
            //console.log("j-1 element id: " )
        }  
        }console.log("inner loop end");
        //document.style.getElementById("#card0").id = ("#card" + (i + 1));
        //keyelement = (document.getElementsByClassName("key"))[0];
        //console.log((document.getElementsByClassName("key")));
        if (isNaN(keyelement.style.translateX))
            {
                keyelement.style.translateX = 0;
            }
          
        // if(keyelement.innerText == 5){
        //     console.log("outside loop before: " + keyelement.style.translateX + "i: " + i + " j: " + j);
        // }     
        console.log(keyelement);
        //keyelement.style.translateX -= (166.5*counter);
        keyelement.style.translateX -= (change*counter);
        keyelement.id = "card0";
        // if(keyelement.innerText == 5){
        //     console.log("outside loop after: " + keyelement.style.translateX + "i: " + i + " j: " + j);
        // } 
        anime
            ({
                //targets: "#" + keyelement.id,
                targets: "#card0",
                translateX: keyelement.style.translateX
            });
        //console.log("outside loop key element before change: " + keyelement.id);
        //console.log("tempelement outside: " + tempelement);
        //keyelement.id = tempelement;
        keyelement.id = "card" + (i + 1 - counter);
        //keyelement.style.backgroundColor = "blue";
        //console.log(elems)
        //console.log("outside loop key element after change: " + keyelement.id);
        if(counter == 1)
        {
            document.getElementById('directions').innerText = "<--As [" + counter + "] element before the key element [" + key + "] is greater than it we insert " + key + " before it-->"; 
        }
        else
        {
            document.getElementById('directions').innerText = "<--As [" + counter + "] elements before the key element [" + key + "] are greater than it we insert " + key + " before them-->"; 
        }
    }, 500 * i * length); 
}

function task(j) { 
    console.log("j: "+ j);
    //setTimeout(function() { 
        counter++;
        if (isNaN(jelement.style.translateX))
            {
                jelement.style.translateX = 0;
            }
        // if(jelement.innerText == 5){
        //         console.log("inside loop before: " + keyelement.style.translateX + "i: " + i + " j: " + j);
        // } 
        //jelement.style.translateX += 166.5;
        jelement.style.translateX += change;
        // if(jelement.innerText == 5){
        //     console.log("inside loop after: " + keyelement.style.translateX + "i: " + i + " j: " + j);
        // }
        //console.log("translate of: " +  jelement.style.translateX + "element: " + jelement.innerText);
        anime
        ({
            targets: "#" + jelement.id,
            translateX: jelement.style.translateX
        });
        console.log("inside loop before change: " + jelement.id);
        if(counter == 1){
            jpluselement = document.querySelector("#card" + (j + 2));
            tempelement = jelement.id;
            jelement.id = jpluselement.id;
            //jelement.classList.remove("key");
        }
        else{
            sectempelement = jelement.id;
            jelement.id = tempelement;
            tempelement = sectempelement;
            //console.log("tempelement inside: " + tempelement);
        }
        //console.log("inside loop after change: " + jelement.id);
        // j = j-1;
        console.log("j after: "+ j);
        // if( (j-1) > 0){
        //     jelement = document.querySelector("#card" + (j+1));
        // }   
    //}, 2000 * j); 
}

function openNav() 
{
    document.getElementById("mySidenav").style.width = "20vw";
    if (window.innerWidth <= 800)
    {
        document.getElementById("mySidenav").style.width = "40vw";
    }
}

function closeNav() 
{
    document.getElementById("mySidenav").style.width = "0";
}