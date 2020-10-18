let choice = document.getElementById("animation_box_main");
//console.log(choice);

if (choice.querySelector('#linearsearch') != null)
{
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
        const element = document.getElementById('card' + (index));
        //console.log(element.style.backgroundColor)
        
        console.log(element);
        if (element.querySelector("#answer") != null)
        {
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
}

else if (choice.querySelector('#binarysearch') != null)
{
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
       
    let elems = document.getElementsByClassName('card');
    max = elems.length;
    checker = 0;
    partition = 0;

    var found = false;

    document.getElementById('directions').innerText = "<-- For Binary Search, we need a sorted array, here it is -->";
    
    function myLoop() {        
        setTimeout(function() { 
            if (found == true)
            {
                return
            }
            else
            {
                if (partition == 0)
                {
                    for (let index = 0; index < checker; index++) 
                    {
                        const ele = elems[index];
                        ele.style.backgroundColor = 'lightgrey';
                        ele.style.color = 'lightgrey';
                        ele.style.border = 'none';
                    }
                }
                else
                {
                    for (let index = max; index < elems.length; index++) 
                    {
                        const ele = elems[index];
                        ele.style.backgroundColor = 'lightgrey';
                        ele.style.color = 'lightgrey';
                        ele.style.border = 'none';
                    }
                }
                const element = document.getElementById('card' + (Math.floor((max + checker)/2) + 1));
                console.log(element.innerText)
                element.style.backgroundColor = 'red';
                if (document.querySelector('#answer').innerText == element.innerText)
                {
                    element.style.backgroundColor = 'green';
                    found = true;
                    document.getElementById('directions').innerText = "<-- Found it -->";
                    myLoop();
                }
                else if (document.querySelector('#answer').innerText > element.innerText)
                {
                    partition = 0;
                    checker += (Math.floor((max - checker)/2) + 1);
                    document.getElementById('directions').innerText = "<-- As the element " + document.querySelector('#answer').innerText + " is greater than " + element.innerText + " so we need to search the right part -->";
                    sleep(3000).then(() => {
                    myLoop();
                    });
                }
                else if (document.querySelector('#answer').innerText < element.innerText)
                {
                    partition = 1;
                    max -= Math.floor((max - checker)/2);
                    document.getElementById('directions').innerText = "<-- As the element " + document.querySelector('#answer').innerText + " is smaller than " + element.innerText + " so we need to search the left part -->";
                    sleep(3000).then(() => {
                    myLoop();
                    });
                }
                var last = (Math.floor((max + checker)/2) + 1);
            } /*
            if (partition == 0)
            {
                for (let index = 0; index < checker; index++) 
                {
                    const ele = elems[index];
                    ele.style.backgroundColor = 'lightgrey';
                    ele.style.color = 'lightgrey';
                }
            }
            else
            {
                for (let index = max; index < elems.length; index++) 
                {
                    const ele = elems[index];
                    ele.style.backgroundColor = 'lightgrey';
                    ele.style.color = 'lightgrey';
                }
            }
            if (found == true)
            {
                return
            }
            const element = document.getElementById('card' + (Math.floor((max + checker)/2) + 1));
            console.log(element.innerText)
            element.style.backgroundColor = 'red';
            if (document.querySelector('#answer').innerText == element.innerText)
            {
                checker = Math.floor((max + checker)/2);
                element.style.backgroundColor = 'green';
                found = true;

                myLoop();
            }
            else if (document.querySelector('#answer').innerText > element.innerText)
            {
                partition = 0;
                checker += Math.floor((max - checker)/2);
                myLoop();
            }
            else if (document.querySelector('#answer').innerText < element.innerText)
            {
                partition = 1;
                max -= Math.floor((max - checker)/2);
                myLoop();
            }    */
        }, 2000)
    }
    myLoop();
}
