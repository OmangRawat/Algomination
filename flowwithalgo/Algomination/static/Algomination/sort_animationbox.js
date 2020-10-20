/*function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
   
let elems = document.getElementsByClassName('card');
let n = elems.length;
//console.log(elems)
//var index = 1;
function myLoop() {        
    setTimeout(function() { 
            anime({
                targets: '#' + elems[j].id,
                translateX: 165
            });

            anime({
                targets: '#card2',
                translateX: -165
            });
        if (n == 1)
            return;
        for (let i=0; i < n-1; i++) {
            if (elems[i].innerText > elems[i+1].innerText){
                var temp = elems[i];
                elems[i] = elems[i+1];
                elems[i+1] =temp;
            }
        }
        myLoop(elems, n-1);            
    }, 2000)
}myLoop(elems, n);

/*function swap(elems, first, second){
    var temp = elems[first];
    elems[first] = elems[second];
    elems[second] =temp;
}

function bubble_Sort(){

    var len = elems.length,stop, element1, element2;

    for (let i=0; i < len; i++){
        for (let j=0, stop=len-i; j < stop; j++){
            element1 = elems[j].innerText;
            element2 = elems[j+1].innerText;
            //console.log(element1 +  " " + element2); 
            if (element1 > element2){
                
                anime({
                    targets: '#' + elems[j+1].id,
                    translateX: +165
                });
                
               
                anime({
                    targets: '#' + elems[j].id,
                    translateX: -165
                });
                var temp = elems[j];
                elems[j] = elems[j+1];
                elems[j+1] =temp;
                for (let index = 0; index < elems.length; index++) {
                    console.log(elems[index].innerText);
                    
                }
                
            }
        }
    }
}
bubble_Sort(); */