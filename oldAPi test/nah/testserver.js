
let players = []; // de array hier kan je miss ook die username prompt aan toevoegen?
let current_turn = 0;
let timeOut;
let _turn = 0;
const MAX_WAITING = 5000; // 5 seconden wachten 

function next_turn(){
   _turn = current_turn++ % players.length;
   players[_turn].emit('your_turn');
   console.log("next turn triggered " , _turn);
   triggerTimeout(); // door deze functie stopt de turn na 5 seconden
}

function triggerTimeout(){
  timeOut = setTimeout(()=>{
    next_turn();
  },MAX_WAITING);
}

function resetTimeOut(){
   if(typeof timeOut === 'object'){
     console.log("timeout reset");
     clearTimeout(timeOut);
   }
}

io.on('connection', function(socket){
console.log('A player connected');

// push method voegt 1 of meer element aan het einde van een array en geeft nieuwe lengte 
players.push(socket); // user maakt connectie/ vult prompt in en komt in array terecht. ( and only the game can be started with the first connected player's request by clicking a button in client side (you can modify this).)
socket.on('pass_turn',function(){ // functie die je client side emit? alleen bij current turn kan je shit doen 
  if(players[_turn] == socket){
     resetTimeOut(); 
     next_turn();
  }
})

socket.on('disconnect', function(){
 console.log('A player disconnected');
 // if any player is disconnected, we remove him from the array and decrease index as well.
 players.splice(players.indexOf(socket),1);
 _turn--;
 console.log("A number of players now ",players.length);
});
});



/// * second test * 

const express = require('express')
const app = express()
const http = require('http').createServer(app)
const path = require('path')
const io = require('socket.io')(http)
const port = process.env.PORT || 4500

// const {Users} = require ()
// const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

app.use(express.static(path.resolve('public')))

// app.set('view engine', 'ejs')
// app.set('views', './views')

// app.get('/', (request, response) => {
//     response.render('index')
// })
// var users = {};



// testing beginning 

card.forEach(c => {
    const num = [...Array(card.length).keys()]
    const random = Math.floor(Math.random() * card.length)

    c.style.order = num[random]
})

// when you click on any of the cards from the array it flips
function clicking() {
    for (let i = 0; i < content.length; i++) {
        content[i].addEventListener('click', () => {
            // content[i].classList.add('flip')
            socket.emit("clickCard", i)

            // without the time out it takes too long to see the scoreboard go up
            setTimeout(() => {
                const flippedCard = document.querySelectorAll('.flip')

                //  limit to amount of cards you can flip during a turn
                if (flippedCard.length == 2) {

                    // then you're not allowed to do anything with your mouse anymore
                    container.style.pointerEvents = 'none'

                    // // after 1 second you're allowed to again
                    // setInterval(() => {
                    //     container.style.pointerEvents = 'all'
                    // }, 1000);
                    console.log(flippedCard);
                    checkMatch(flippedCard[0], flippedCard[1])
                }
            }, 500)
        })
    }
}


function checkMatch(cardOne, cardTwo) {
    // if the data indexes match then 
    console.log(cardOne, cardTwo);
    if (cardOne.dataset.index == cardTwo.dataset.index) {
        // add one point to the score
        score.innerHTML = parseInt(score.innerHTML) + 1

        cardOne.classList.remove('flip')
        cardTwo.classList.remove('flip')

        // and keep showing the matched cards
        cardOne.classList.add('match')
        cardTwo.classList.add('match')

        // // then you're not allowed to do anything with your mouse
        container.style.pointerEvents = 'none'

        // here i need to pass the turn to someone else

        // after a second you can do things with your mouse again
        // setInterval(() => {
        //     container.style.pointerEvents = 'all'
        // }, 1000);
    } else {
        // if the cards do not match then you're not allowed to do anything with your mouse
        container.style.pointerEvents = 'none'

        setTimeout(() => {
            cardOne.classList.remove('flip')
            cardTwo.classList.remove('flip')
        }, 1000);
    }
}


//testing end

io.on('connection', (socket) => {

    // socket.on('create', function (room) {
    //     socket.join(room)
    //     console.log("joined game" + room)
    //     // io.emit("shuffle")
    //     io.to("room").emit("showCards")
    //     // console.log(showCards)
    // })
    // push method voegt 1 of meer element aan het einde van een array en geeft nieuwe lengte 
    players.push(socket); // user maakt connectie/ vult prompt in en komt in array terecht. ( and only the game can be started with the first connected player's request by clicking a button in client side (you can modify this).)
    // console.log(players)
    socket.on('pass_turn',function(){ // functie die je client side emit? alleen bij current turn kan je shit doen 
    if(players[_turn] == socket){
     clicking()
     resetTimeOut(); 
     next_turn();
  }
})
    // console.log('made a connection' + socket.id)
    // users[socket.id] = { score: "0", username: "0" }

    // socket.on('cardsScore', (cardsScore) => {
    //     users[socket.id].score = cardsScore;
    //     io.emit('cardsScore', users)
    // })

    // socket.on('username', (username) => {
    //     users[socket.id].username = username;
    //     io.emit('username', username)
    // })

    // socket.on('create', function (room) {
    //     socket.join(room)
    //     console.log("joined game" + room)
    //     // io.emit("shuffle")
    //     io.to("room").emit("showCards")
    //     // console.log(showCards)

    //     // console.log(clickCards)
    // })

    // socket.on('updateUsersList', function(users) {
    //     console.log(users)
    // })

    socket.on('clickCard', card => {
        io.emit("clickCard", card)
    })

    // io.of("/").adapter.on("create-room", (room) => {
    //     // io.emit("shuffle", room)
    //     socket.join(room)
    //     console.log("room?")
    //     io.emit("shuffle")
    // })
    // socket.on('flippedTwoCards', flippedTwoCards => {
    //     console.log(flippedTwoCards + " er zijn twee kaarten omgedraaid")
    //     io.emit('flippedTwoCards', flippedTwoCards)
    // })

    // socket.on('turn', function () {
    //     console.log('users turn')
    //     io.emit('userTurnIsOver')
    // })

    socket.on('disconnect', () => {
        console.log('user disconnected')
    })
})


http.listen(port, () => {
    console.log('listening on port ', port)
})



// * stack overflow timed turned based game code * //

// let players = [];
// let current_turn = 0;
// let timeOut;
// let _turn = 0;
// const MAX_WAITING = 5000;

// function next_turn(){
//    _turn = current_turn++ % players.length;
//    players[_turn].emit('your_turn');
//    console.log("next turn triggered " , _turn);
//    triggerTimeout();
// }

// function triggerTimeout(){
//   timeOut = setTimeout(()=>{
//     next_turn();
//   },MAX_WAITING);
// }

// function resetTimeOut(){
//    if(typeof timeOut === 'object'){
//      console.log("timeout reset");
//      clearTimeout(timeOut);
//    }
// }

// io.on('connection', function(socket){
// console.log('A player connected');

// players.push(socket);
// socket.on('pass_turn',function(){
//   if(players[_turn] == socket){
//      resetTimeOut();
//      next_turn();
//   }
// })

// socket.on('disconnect', function(){
//  console.log('A player disconnected');
//  players.splice(players.indexOf(socket),1);
//  _turn--;
//  console.log("A number of players now ",players.length);
// });
// });



