function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
var string = ""
let elems = document.getElementsByClassName('card');
let length = elems.length;
console.log(length);
var div1, div2, tdiv1, tdiv2;
let j = 0;
console.log(elems[0].innerText + " " + elems[1].innerText);
function myLoop() {
    setTimeout(function(){
        for(var j = 0; j < length;  j++){    
            for(var i = 0; i < (length-j-1); i++){            
                //sleep(2000).then(() =>
                setTimeout(function() 
                {
                    element1 = document.querySelector("#card" + (i + 1));
                    element2 = document.querySelector("#card" + (i + 2));
                    // element1.style.backgroundColor = 'red';
                    // element2.style.backgroundColor = 'red';
                    if(parseFloat(element1.innerText) > parseFloat(element2.innerText))
                    {
                        if (isNaN(element1.style.translateX))
                        {
                            element1.style.translateX = 0;
                        }
                        if (isNaN(element2.style.translateX))
                        {
                            element2.style.translateX = 0;
                        }
                        // if (isNaN(element1.style.left))
                        // {
                        //     element1.style.left = 0;
                        // }
                        // if (isNaN(element2.style.left))
                        // {
                        //     element2.style.left = 0;
                        // }
                        element1.style.translateX += 150;
                        //element1.style.left += 150;
                        console.log(element1.style.translateX)
                        console.log(element1.style.left)
                        element2.style.translateX -= 150;
                        //element2.style.left -= 150;
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
                        anime
                        ({
                            targets: "#" + element1.id,
                            left: element1.style.translateX,
                            backgroundColor: '#8B008B',
                            borderRadius: ['0%', '50%'],
                            easing: 'easeInOutQuad',
                            
                        });
                        anime
                        ({
                            targets: "#" + element2.id,
                            left: element2.style.translateX,
                            backgroundColor: '#8B008B',
                            borderRadius: ['0%', '50%'],
                            easing: 'easeInOutQuad',
                            
                        });
                        console.log("Swapping " + element1.innerText + " " + element2.innerText)
                        temp = element1.id;
                        //temptext = element1.innerText;
                        console.log(temptext);
                        element1.id = element2.id; 
                        //element1.innerText = element2.innerText;  
                        element2.id = temp;
                        //element2.innerText = temptext;
                        // element1.style.backgroundColor = 'blue';
                        // element2.style.backgroundColor = 'blue';
                    } 
                }, 2000);
            }     
        }
        return;
    }, 2000)
}myLoop();