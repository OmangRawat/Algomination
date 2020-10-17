
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
       
    let elems = document.getElementsByClassName('card');

    /*
    for (let index = 0; index < elems.length; index++) {
        //const element = elems[index] ;
        const element = document.getElementById('turn_blue' + (index + 1));
        setTimeout((element.style.backgroundColor = 'blue'), 2000);
        console.log(element);
        /*sleep(2000)
        .then(() => { 
        element.style.backgroundColor = 'blue';
        sleep(1000).then(() => {element.style.backgroundColor = 'red';})
        console.log(element);  });
    }  
    */

    var index = 1;                 

    function myLoop() {        
    setTimeout(function() { 
        const element = document.getElementById('turn_blue' + (index));
        //console.log(element.style.backgroundColor)
        
        console.log(element);
        if (element.querySelector("#answer") != null)
        {
            //element.style.backgroundColor = 'blue';
            //element.style.border = ""
            sleep(2000).then(() => {
            element.style.backgroundColor = 'green'; }); 
            var found = true;
        }
        if (found == true)
        {
            return
        }
        element.style.backgroundColor = 'blue';
        sleep(2000)
        .then(() => {
        element.style.backgroundColor = 'red'; 
        }); 
        console.log('hello');  
        index++;                    
        if (index < elems.length + 1) {          
        myLoop();             
        }                      
    }, 2000)
    }

    myLoop(); 