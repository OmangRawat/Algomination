// ele = document.getElementsByClassName('dbcard');
// console.log(ele);
// console.log(ele.length)

// shift = 50 * (10 - ele.length)
// shift1 = 50 * (9-ele.length)
// //console.log(document.getElementById('stackani').style.height)
// console.log(shift)

// anime({
//     targets: '#cardtest',
//     translateY: shift
//     //top: 350
// })

// //document.getElementById('cardtest').style.top = -350

// for (let index = 0; index < ele.length; index++) {
//     //console.log("init" + ele[index.id]);
//     ele[index].id = "card" + (ele.length - index);
//     //console.log(ele[index.id]);
// }
//console.log(window.screen.height)

var unit = (77*(window.innerHeight)/100)

function task1(sh)
{
    setTimeout(function() {
        anime({
            targets: "#card0",
            translateX: 360             //408
        })
        task2(sh);
    }, 1000);
}

function task2(sh)
{
    //sh = (sh * unit)
    setTimeout(function() {
        anime({
            targets: "#card0",
            translateY: sh
        });
    }, 1000); 
}

function task3(sh)
{
    setTimeout(function() {
        ele = document.getElementsByClassName('dbcard')
        //console.log("cardtest")
        console.log(ele)
        //console.log("removing")
        // for (let index = 0; index < ele.length; index++) {
        //     console.log("out")
        //     console.log(ele[index].innerText)
        //     console.log(localStorage.getItem('card'+ localStorage.length))
        //     if(ele[index].innerText == localStorage.getItem('card'+ localStorage.length)){
        //         console.log("in")
        //         console.log(ele[index].innerText)
        //         console.log(localStorage.getItem('card'+ localStorage.length))
        //         ele[index].id = 'cardx'
        //         console.log("removed")
        //         console.log(ele[index])
        //         break
        //     }
        // }
        console.log(ele[0])
        ele[0].id = 'cardx'
        anime({
            targets: "#cardx",

            translateY: sh
            //translate3D: (0, sh , 0)
        })
        task4();
    }, 1000); 
}

function task4()
{
    setTimeout(function() {
        anime({
            targets: "#cardx",
            translateX: -350                      //408
        });
    }, 1000);
}

// task1();

var operation = document.getElementById('stackani')
console.log(operation)

if(operation.querySelector('#pushani') != null){

    if (localStorage.length == 10)
    {
        alert("Stack is Full");
        var str = ""
        var shift = 520 * (10 - localStorage.length)/10
        console.log("shift1")
        console.log(shift)
        for (let index = localStorage.length; index > 0; index--) {
            var local = localStorage.getItem('card' + index)
            if(local == null)
            {
                break
            }
            str += "<span id ='cardtest' class = 'fill-blue card dbcard' style = 'transform: TranslateY("+ 0 +"px)'>" + "<p id='answer' style='margin: auto;'>"+ local +"</p>" + " </span>" 
        }
        document.getElementById('pushani').innerHTML = str
        document.getElementById('directions').innerText = "<-- Stack is Full -->";
        document.getElementById('storage_left').innerText = "0";
    }
    else if (localStorage.getItem("card1") === null) {
        // anime({
        //     targets: '#card0',
        //     translateY: 541
        // })
        task1(520);
        var value_card = document.getElementById('card0').innerText
        localStorage.setItem('card1', value_card)
        console.log(localStorage)
        document.getElementById('storage_left').innerText = "" + (10 - localStorage.length);
        var local = localStorage.getItem('card' + localStorage.length)
        console.log(local)
        document.getElementById('directions').innerText = "<-- Pushed [" + local + "] in the Stack -->";
    }
    else{
        //console.log("............" + localStorage.length)
        var str = ""
        var shift = 520 * (10 - localStorage.length)/10
        console.log("shift1")
        console.log(shift)
        for (let index = localStorage.length; index > 0; index--) {
            var local = localStorage.getItem('card' + index)
            if(local == null)
            {
                break
            }
            str += "<span id ='cardtest' class = 'fill-blue card dbcard' style = 'transform: TranslateY("+ 0 +"vh)'>" + "<p id='answer' style='margin: auto;'>"+ local +"</p>" + " </span>" 
        }

        document.getElementById('pushani').innerHTML = str
        //shift = (520 - ((localStorage.length + 1) * 52))
        //shift = ((70 - (7 * localStorage.length))*(unit/100))
        shift = (75 - (7 * localStorage.length))*(unit/100)
        console.log("shift2")
        console.log(shift)
        // anime({
        //     targets: '#card0',
        //     translateY: shift
        // })
        task1(shift)
        var value_card = document.getElementById('card0').innerText
        var key = 'card' + (localStorage.length + 1)
        localStorage.setItem(key, value_card)
        console.log(localStorage)
        document.getElementById('storage_left').innerText = "" + (10 - localStorage.length);
        var local = localStorage.getItem('card' + localStorage.length)
        console.log(local)
        document.getElementById('directions').innerText = "<-- Pushed [" + local + "] in the Stack -->";
    }   
}
else if(operation.querySelector('#popani') != null){
    
    if(localStorage.length == 0){
        alert("Stack is Empty!!!!");
        document.getElementById('storage_left').innerText = "10";
        document.getElementById('directions').innerText = '<-- Stack is Empty -->';
    }

    var str = ""
    var shift = 520 * (10 - localStorage.length)/10
    console.log("shift1")
    console.log(shift)
    for (let index = localStorage.length; index > 0; index--) {
        var local = localStorage.getItem('card' + index)
        
        // str += "<span id ='cardtest' class = 'fill-blue card dbcard' style = 'transform: TranslateY("+ ((529 * (10 - localStorage.length))/77) +"vh)'>" + "<p id='answer' style='margin: auto;'>"+ local +"</p>" + " </span>" 
        str += "<span id ='cardtest' class = 'fill-blue card dbcard' style = 'transform: TranslateY("+ 0 +"px)'>" + "<p id='answer' style='margin: auto;'>"+ local +"</p>" + " </span>"
    }

    document.getElementById('popani').innerHTML = str
    //shift = (520 - ((localStorage.length + 1) * 52))*(-1)
    shift = (-1*(70 - (6.7 * localStorage.length))*(unit/100))
    console.log("shift2")
    console.log(shift)
    // anime({
    //     targets: '#card0',
    //     translateY: shift
    // })
    task3(shift)
    if(localStorage.length != 0)
    {
        document.getElementById('storage_left').innerText = "" + (11 - localStorage.length);
        var local = localStorage.getItem('card' + localStorage.length)
        console.log(local)
        document.getElementById('directions').innerText = "<-- Removed [" + local + "] from the Stack -->"
        localStorage.removeItem('card'+localStorage.length)
    }
}
else if(operation.querySelector('#peekani') != null)
{
    if(localStorage.length == 0){
        alert("Stack is Empty!!!!");
        document.getElementById('storage_left').innerText = "10";
        document.getElementById('directions').innerText = '<-- Stack is Empty -->';
    }

    var str = ""
    var shift = 520 * (10 - localStorage.length)/10
    console.log("shift1")
    console.log(shift)
    for (let index = localStorage.length; index > 0; index--) {
        var local = localStorage.getItem('card' + index)
        
        str += "<span id ='cardtest' class = 'fill-blue card dbcard' style = 'transform: TranslateY("+ 0 +"vh)'>" + "<p id='answer' style='margin: auto;'>"+ local +"</p>" + " </span>" 
    }
    if(localStorage.length != 0)
    {
        document.getElementById('peekani').innerHTML = str
        var local = localStorage.getItem('card' + localStorage.length)
        console.log(local)
        document.getElementById('directions').innerText = '<-- Element at the top of the Stack is [' + local + '] -->';
        document.getElementById('storage_left').innerText = 10 - localStorage.length;
    }
}
