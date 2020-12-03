function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

var xunit = ((window.innerWidth)/100)
var shift;
var min_ind = 0;
var i, j;
let elems = document.getElementsByClassName('card');
var length = elems.length;
var done = 'F';
var temp = '', temptext = '';
// var change = (0.0973 * window.screen.width);
var change = (7.1 * xunit)
console.log(window.screen.width);

for(j = 0; j < length-1;  j++){    
    //console.log("j: "+ j);
     
    
    task1(j);     
}//console.log("outer loop end");  
document.getElementById('directions').innerText = "<-- Lets Start Sorting the Array using Selection Sort -->";

function task1(j) { 
    setTimeout(function() { 
        min_ind = j;
        console.log("min_index_initial_outside: "+ min_ind);
        shift = 0;
        for(i = j+1; i < length; i++){   
            task(i);

        }//console.log("inner loop end");
        console.log("required min index: " + min_ind);
        element1 = document.querySelector("#card" + (min_ind + 1));
        element2 = document.querySelector("#card" + (j + 1));
        //shift = 166.5*(min_ind - j);
        shift = (7.1 * xunit)*(min_ind - j);
        console.log("shift: " + shift);
        element1.style.translateX -= shift;
        element2.style.translateX += shift;

        if(j == 0){
            document.getElementById('directions').innerText = "<-- Swapping " + element1.innerText + " with " + element2.innerText + " as " + element1.innerText + " is the "+ (j+1) +"st smallest element -->";
        }
        else if(j == 1){
            document.getElementById('directions').innerText = "<-- Swapping " + element1.innerText + " with " + element2.innerText + " as " + element1.innerText + " is the "+ (j+1) +"nd smallest element -->";
        }
        else if(j == 2){
            document.getElementById('directions').innerText = "<-- Swapping " + element1.innerText + " with " + element2.innerText + " as " + element1.innerText + " is the "+ (j+1) +"rd smallest element -->";
        }
        else{
            document.getElementById('directions').innerText = "<-- Swapping " + element1.innerText + " with " + element2.innerText + " as " + element1.innerText + " is the "+ (j+1) +"th smallest element -->";
        }

        anime({
            targets: "#" + element1.id,
            translateX: element1.style.translateX,
            backgroundColor: '#8B008B',
            //backgroundColor: '#000000',
            borderRadius: ['0%', '50%'],
            easing: 'easeInOutQuad',
            //delay: 3000
        });
        anime
        ({
            targets: "#" + element2.id,
            translateX: element2.style.translateX,
            backgroundColor: '#8B008B',
            borderRadius: ['0%', '50%'],
            easing: 'easeInOutQuad',
            //delay: 3000
        });
        
        element1.style.backgroundColor = 'blue';
        element2.style.backgroundColor = 'blue';

        //document.getElementById('directions').innerText = "<-- Swapping " + element1.innerText + " with " + element2.innerText + " as " + element1.innerText + "has the minimum value -->";
        temp = element1.id;
        //console.log(temptext);
        element1.id = element2.id;   
        element2.id = temp;

    }, 1000 * j *(length)); 

}

function task(i) { 
    //setTimeout(function() { 
        //console.log("i: "+ i);            
        element1 = document.querySelector("#card" + (min_ind + 1));
        element2 = document.querySelector("#card" + (i + 1));

        // element1.style.backgroundColor = 'red';
        // element2.style.backgroundColor = 'red';
        
        document.getElementById('directions').innerText = "<-- Comparing " + element1.innerText + " and " + element2.innerText + " -->";
        
        if(parseFloat(element1.innerText) > parseFloat(element2.innerText))
        {   
            min_ind = i;
            console.log("min_index: "+ min_ind);
            //document.getElementById('directions').innerText = "<-- Swapping " + element1.innerText + " with " + element2.innerText + " as " + element1.innerText + " > " + element2.innerText + " -->";
            if (isNaN(element1.style.translateX))
            {
                element1.style.translateX = 0;
            }
            if (isNaN(element2.style.translateX))
            {
                element2.style.translateX = 0;
            }

            // element1.style.translateX += change;
            // element2.style.translateX -= change;
            //shift += 166.5;
            //element1.style.translateX += 166.5;
            // console.log(element1.style.translateX)     
            // console.log(element1.style.left)
            //element2.style.translateX -= 166.5;
        }

    //}, 2000 * i); 
} 

//document.getElementById('directions').innerText = "<-- Final Sorted Array -->";

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