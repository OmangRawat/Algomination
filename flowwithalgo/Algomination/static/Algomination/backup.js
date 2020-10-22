function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

let elems = document.getElementsByClassName('card');
var length = elems.length;
var done = 'F';
var temp = '', temptext = '';
var change = (0.0973 * window.screen.width);
console.log(window.screen.width);

for(var j = 0; j < length;  j++){    
    //console.log("j: "+ j);
    
    task1(j);     
}//console.log("outer loop end");  
document.getElementById('directions').innerText = "<-- Lets Start Sorting the Array using Bubble Sort -->";

function task1(j) { 
    setTimeout(function() { 
        for(var i = 0; i < (length-j-1); i++){   
            task(i);
        }//console.log("inner loop end"); 
    }, 2000 * j *(length)); 
}

function task(i) { 
    setTimeout(function() { 
        //console.log("i: "+ i);            
        element1 = document.querySelector("#card" + (i + 1));
        element2 = document.querySelector("#card" + (i + 2));
        //element1.style.backgroundColor = 'red';
        //element2.style.backgroundColor = 'red';
        document.getElementById('directions').innerText = "<-- Comparing " + element1.innerText + " and " + element2.innerText + " -->";
        if(parseFloat(element1.innerText) > parseFloat(element2.innerText))
        {
            document.getElementById('directions').innerText = "<-- Swapping " + element1.innerText + " with " + element2.innerText + " as " + element1.innerText + " > " + element2.innerText + " -->";
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
            
            element1.style.translateX += 166.5;
            // console.log(element1.style.translateX)     
            // console.log(element1.style.left)
            element2.style.translateX -= 166.5;
            
            // anime
            // ({
            //     targets: "#" + element1.id,
            //     translateX: element1.style.translateX
            // });
            // anime
            // ({
            //     targets: "#" + element2.id,
            //     translateX: element2.style.translateX
            // });

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
            
            //console.log("Swapping " + element1.innerText + " " + element2.innerText)
            temp = element1.id;
            //console.log(temptext);
            element1.id = element2.id;   
            element2.id = temp;
        } 
    }, 2000 * i); 
} 

//document.getElementById('directions').innerText = "<-- Final Sorted Array -->";