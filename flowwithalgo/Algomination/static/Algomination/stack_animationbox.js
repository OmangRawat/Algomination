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

function task1(sh)
{
    setTimeout(function() {
        anime({
            targets: "#card0",
            translateX: 408
        })
        task2(sh);
    }, 2000);
}

function task2(sh)
{
    setTimeout(function() {
        anime({
            targets: "#card0",
            translateY: sh
        });
    }, 2000); 
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
        })
        task4();
    }, 2000); 
}

function task4()
{
    setTimeout(function() {
        anime({
            targets: "#cardx",
            translateX: -408
        });
    }, 2000);
}

// task1();

var operation = document.getElementById('stackani')
console.log(operation)

if(operation.querySelector('#pushani') != null){
    
    if (localStorage.getItem("card1") === null) {
        // anime({
        //     targets: '#card0',
        //     translateY: 541
        // })
        task1(520);
        var value_card = document.getElementById('card0').innerText
        localStorage.setItem('card1', value_card)
        console.log(localStorage)
    }
    else{
        var str = ""
        var shift = 520 * (10 - localStorage.length)/10
        console.log("shift1")
        console.log(shift)
        for (let index = localStorage.length; index > 0; index--) {
            var local = localStorage.getItem('card' + index)
            
            str += "<span id ='cardtest' class = 'fill-red card dbcard' style = 'transform: TranslateY("+ shift +"px)'>" + "<p id='answer' style='margin: auto;'>"+ local +"</p>" + " </span>" 
        }

        document.getElementById('pushani').innerHTML = str
        shift = (520 - ((localStorage.length+1) * 52))
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
    }   
}
else if(operation.querySelector('#popani') != null){
    
    if(localStorage.length == 0){
        alert("Stack is Empty!!!!");
    }

    var str = ""
    var shift = 520 * (10 - localStorage.length)/10
    console.log("shift1")
    console.log(shift)
    for (let index = localStorage.length; index > 0; index--) {
        var local = localStorage.getItem('card' + index)
        
        str += "<span id ='cardtest' class = 'fill-red card dbcard' style = 'transform: TranslateY("+ shift +"px)'>" + "<p id='answer' style='margin: auto;'>"+ local +"</p>" + " </span>" 
    }

    document.getElementById('popani').innerHTML = str
    shift = (520 - ((localStorage.length+1) * 52))*(-1)
    console.log("shift2")
    console.log(shift)
    // anime({
    //     targets: '#card0',
    //     translateY: shift
    // })
    task3(shift)
    localStorage.removeItem('card'+localStorage.length)
}

