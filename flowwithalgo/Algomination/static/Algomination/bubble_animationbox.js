function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
   
// let elemens = document.getElementsByClassName('card');
// var elems = elemens;
// //let n = elems.length;
// /*
// //console.log(elems)
// //var index = 1;
// function myLoop() {        
//     setTimeout(function() { 
//             anime({
//                 targets: '#' + elems[j].id,
//                 translateX: 165
//             });

//             anime({
//                 targets: '#card2',
//                 translateX: -165
//             });
//         if (n == 1)
//             return;
//         for (let i=0; i < n-1; i++) {
//             if (elems[i].innerText > elems[i+1].innerText){
//                 var temp = elems[i];
//                 elems[i] = elems[i+1];
//                 elems[i+1] =temp;
//             }
//         }
//         myLoop(elems, n-1);            
//     }, 2000)
// }myLoop(elems, n);
// */
// let temp = document.getElementById('usedinjs');
// var z = 0;
// function swap(elems, first, second){
//     /*anime({
//         targets: '#' + elems[first].id,
//         translateX: 165
//     });
//     anime({
//         targets: '#' + elems[second].id,
//         translateX: -165
//     });*/
//     temp = elems[first];
//     elems[first] = elems[second];
//     elems[second] = temp;
//     z += 1;
//     console.log("Swap" + z);
// }

// function bubble_Sort(){

//     var len = elems.length, element1, element2;

//     for (let i = 0; i < len; i++){
//         for (let j = 0 ; j < (len - i - 1); j++){
//             element1 = elems[j].innerText;          //elems[j].querySelector("p").innerText
//             element2 = elems[j + 1].innerText;
//             //console.log(element1 +  " " + element2); 
//             if (element1 > element2)
//             {
//                 /*anime({
//                     targets: '#' + elems[j].id,
//                     translateX: 165
//                 });
//                 anime({
//                     targets: '#' + elems[j + 1].id,
//                     translateX: -165
//                 });
//                 */
//                 temp = elems[j + 1];
//                 elems[j] = temp;
//                 console.log(elems[j])
//                 console.log(elems[j].id);
//                 swap(elems, j , j + 1);
//             }
//         }
//     }
// }
// bubble_Sort(); 

// let elems = document.getElementsByClassName('card');
// var temp = "", temptext = "";

// for (let index1 = 1; index1 <= elems.length; index1++) {
//     for (let index2 = 1; index2 < elems.length - index1 + 1; index2++) {
//         element1 = document.querySelector("#card" + index2);
//         element2 = document.querySelector("#card" + (index2 + 1));
//         console.log(element1.innerText)
//         console.log(element2.innerText)
//         if(element1.innerText > element2.innerText)
//         {
//             // anime({
//             //     targets: '#' + element1.id,
//             //     translateX: 165
//             // });
//             // anime({
//             //     targets: '#' + element2.id,
//             //     translateX: -165
//             // });    
//             console.log("Swapping");
//             temp = element1.id;
//             temptext = element1.innerText;
//             element1.id = element2.id;
//             element1.innerText = element2.innerText;
//             element2.id = temp;
//             element2.innerText = temptext;
//         }
        
//     }
    
// }

// let elems = document.getElementsByClassName('card');
// var done = 'F';

// function bubbleSort(elems, n) {
//     console.log("qwerty");
//     if (done == 'T')
//     {
//         return
//     }
//     if(n == 1) 
//     {
//         done = 'T';
//     } 
//     for (let i = 0; i < elems.length; i++) { 
//         element1 = document.querySelector("#card" + i);
//         element2 = document.querySelector("#card" + (i + 1));
//         if(elems[i].innerText > elems[i+1].innerText){
//         let temp = elems[i].id;
//         let temptext = elems[i].innerText;
//         console.log(temptext);
//         elems[i].id = elems[i+1].id; 
//         elems[i].innerText = elems[i+1].innerText;  
//         elems[i+1].id = temp;
//         elems[i+1].innerText = tempetext;
//       } 
//     }
//       return bubbleSort(elems, n - 1);
//   };

// bubbleSort(elems, elems.length - 1);

// Running loop

// let elems = document.getElementsByClassName('card');
// var done = 'F';
// var temp = '', temptext = '';
// var change = (0.1 * document.getElementById('animation_box_main').style.width);
// console.log(change)

// function bubbleSort(elems, n) {
//     console.log("qwerty");
//     if (done == 'T')
//     {
//         return
//     }
//     if(n == 1) 
//     {
//         done = 'T';
//     } 
//     for (let i = 0; i < (elems.length - 1); i++) 
//     { 
//         //sleep(2000).then(() =>
//         setTimeout(function() 
//         {
//             element1 = document.querySelector("#card" + (i + 1));
//             element2 = document.querySelector("#card" + (i + 2));
//             // element1.style.backgroundColor = 'red';
//             // element2.style.backgroundColor = 'red';
//             if(parseFloat(element1.innerText) > parseFloat(element2.innerText))
//             {
//                 if (isNaN(element1.style.translateX))
//                 {
//                     element1.style.translateX = 0;
//                 }
//                 if (isNaN(element2.style.translateX))
//                 {
//                     element2.style.translateX = 0;
//                 }
//                 // if (isNaN(element1.style.left))
//                 // {
//                 //     element1.style.left = 0;
//                 // }
//                 // if (isNaN(element2.style.left))
//                 // {
//                 //     element2.style.left = 0;
//                 // }
//                 element1.style.translateX += 150;
//                 //element1.style.left += 150;
//                 console.log(element1.style.translateX)
//                 console.log(element1.style.left)
//                 element2.style.translateX -= 150;
//                 //element2.style.left -= 150;
//                 // anime
//                 // ({
//                 //     targets: "#" + element1.id,
//                 //     translateX: element1.style.translateX
//                 // });
//                 // anime
//                 // ({
//                 //     targets: "#" + element2.id,
//                 //     translateX: element2.style.translateX
//                 // });
//                 anime
//                 ({
//                     targets: "#" + element1.id,
//                     left: element1.style.translateX,
//                     backgroundColor: '#8B008B',
//                     borderRadius: ['0%', '50%'],
//                     easing: 'easeInOutQuad',
//                     delay: 3000
//                 });
//                 anime
//                 ({
//                     targets: "#" + element2.id,
//                     left: element2.style.translateX,
//                     backgroundColor: '#8B008B',
//                     borderRadius: ['0%', '50%'],
//                     easing: 'easeInOutQuad',
//                     delay: 3000
//                 });
//                 console.log("Swapping " + element1.innerText + " " + element2.innerText)
//                 temp = element1.id;
//                 //temptext = element1.innerText;
//                 console.log(temptext);
//                 element1.id = element2.id; 
//                 //element1.innerText = element2.innerText;  
//                 element2.id = temp;
//                 //element2.innerText = temptext;
//                 // element1.style.backgroundColor = 'blue';
//                 // element2.style.backgroundColor = 'blue';
//             } 
//         }, 2000);
//     }
//     sleep(2000).then(() => 
//     {
//         return bubbleSort(elems, n - 1);
//     });
//     //return bubbleSort(elems, n - 1);
//   };

// bubbleSort(elems, elems.length - 1);

// let elems = document.getElementsByClassName('card');
// var done = 'F';
// var temp = '', temptext = '';
// var change = (0.1 * document.getElementById('animation_box_main').style.width);
// console.log(change)

// function bubbleSort(elems, n) {
//     console.log("qwerty");
//     if (done == 'T')
//     {
//         return
//     }
//     if(n == 1) 
//     {
//         done = 'T';
//     } 
//     for (let i = 0; i < (elems.length - 1); i++) 
//     { 
//         //sleep(2000).then(() =>
//         task(i);
//     }
//     sleep(2000).then(() => 
//     {
//         return bubbleSort(elems, n - 1);
//     });
//     //return bubbleSort(elems, n - 1);
//   };

// bubbleSort(elems, elems.length - 1);

// Not Running

// function task(i) { 
//     setTimeout(function() { 
//         element1 = document.querySelector("#card" + (i + 1));
//         element2 = document.querySelector("#card" + (i + 2));
//         // element1.style.backgroundColor = 'red';
//         // element2.style.backgroundColor = 'red';
//         if(parseFloat(element1.innerText) > parseFloat(element2.innerText))
//         {
//             if (isNaN(element1.style.translateX))
//             {
//                 element1.style.translateX = 0;
//             }
//             if (isNaN(element2.style.translateX))
//             {
//                 element2.style.translateX = 0;
//             }
//             // if (isNaN(element1.style.left))
//             // {
//             //     element1.style.left = 0;
//             // }
//             // if (isNaN(element2.style.left))
//             // {
//             //     element2.style.left = 0;
//             // }
//             element1.style.translateX += 150;
//             //element1.style.left += 150;
//             console.log(element1.style.translateX)
//             console.log(element1.style.left)
//             element2.style.translateX -= 150;
//             //element2.style.left -= 150;
//             // anime
//             // ({
//             //     targets: "#" + element1.id,
//             //     translateX: element1.style.translateX
//             // });
//             // anime
//             // ({
//             //     targets: "#" + element2.id,
//             //     translateX: element2.style.translateX
//             // });
//             anime
            // ({
            //     targets: "#" + element1.id,
            //     left: element1.style.translateX,
            //     backgroundColor: '#8B008B',
            //     borderRadius: ['0%', '50%'],
            //     easing: 'easeInOutQuad',
            //     delay: 3000
            // });
            // anime
            // ({
            //     targets: "#" + element2.id,
            //     left: element2.style.translateX,
            //     backgroundColor: '#8B008B',
            //     borderRadius: ['0%', '50%'],
            //     easing: 'easeInOutQuad',
            //     delay: 3000
            // });
//             console.log("Swapping " + element1.innerText + " " + element2.innerText)
//             temp = element1.id;
//             //temptext = element1.innerText;
//             console.log(temptext);
//             element1.id = element2.id; 
//             //element1.innerText = element2.innerText;  
//             element2.id = temp;
//             //element2.innerText = temptext;
//             // element1.style.backgroundColor = 'blue';
//             // element2.style.backgroundColor = 'blue';
//         }
//     }, 2000 * i); 
// } 

// Rahul Pro's Really Working Code Super HardWork

var xunit = ((window.innerWidth)/100)
console.log(xunit)

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

let elems = document.getElementsByClassName('card');
var length = elems.length;
var done = 'F';
var temp = '', temptext = '';
//var change = (0.1 * document.getElementById('animation_box_main').style.width);
// var change = (0.0973 * window.screen.width);
var change = (7.1 * xunit)
// console.log(window.screen.width);
console.log(change)
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

            element1.style.translateX += change;
            element2.style.translateX -= change;
            
            // element1.style.translateX += 150;
            // console.log(element1.style.translateX)     
            // console.log(element1.style.left)
            // element2.style.translateX -= 150;
            
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