$("#turn").on("click",function(e){
    socket.emit('pass_turn');
})

// * second test

let socket = io()

const card = document.querySelectorAll('.card')
const front = document.querySelectorAll('.front')
const content = document.querySelectorAll('.content')
const container = document.querySelector('main')
const score = document.querySelector('span')
// const playerusernames = {
//     players: [
//         {
//             username: prompt("Wat is je naam?")
//         } ] }



// to shuffle the cards beforehand 
card.forEach(c => {
    const num = [...Array(card.length).keys()]
    const random = Math.floor(Math.random() * card.length)

    c.style.order = num[random]
})

//  create room
socket.emit('create', 'room')

socket.on("showCards", function () {
    showCardsAtFirst()
    // card.forEach(turn => {
    // clicking()
    // })
})


socket.emit('pass_turn');




// so everyone in the room can see the flipped card
socket.on("clickCard", card => {
    content[card].classList.add('flip')
})

//   socket.on('cardsScore', (cardsScore) => {
//         users[socket.id].score = cardsScore;
// score.innerHTML = parseInt(score.innerHTML) + 1
//         io.emit('cardsScore', users)
//     })

// socket.on("addScore", card => {

// })




// console.log('works')
// socket.emit('flippedTwoCards', "hallo")

// socket.emit('test', "Lisanne")
// showCardsAtFirst()
// click()

// card.forEach(turn => {
//     clicking()
// })
// 
// clicking()

function showCardsAtFirst() {
    for (let i = 0; i < content.length; i++) {
        // show the cards a few seconds before
        content[i].classList.add('show')

        // after 2 seconds they turn back around
        setInterval(() => {
            content[i].classList.remove('show')
        }, 2000);
    }
}
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

// socket.on('flippedTwoCards', flippedTwoCards => {
//     console.log(flippedTwoCards)
// })

// $("#turn").on("click",function(e){
//     socket.emit('pass_turn');
// })





// loop door de clicking function bij each turn




// function clicking() {
//     for (let i = 0; i < card.length; i++) {
//         // show the cards a few seconds before
//         content[i].classList.add('show')

//         // after 2 seconds they turn back around
//         setInterval(() => {
//             content[i].classList.remove('show')
//         }, 2000);

//         // when you click on any of the cards from the array it flips
//         card[i].addEventListener('click', () => {
//             content[i].classList.add('flip')

//             const filppedCard = document.querySelectorAll('.flip')

//             //  limit to amount of cards you can flip
//             if (filppedCard.length == 2) {
//                 // socket.emit('flippedTwoCards', true)

//                 // // then you're not allowed to do anything with your mouse
//                 // container.style.pointerEvents = 'none'

//                 // // after 1 second you're allowed to again
//                 // setInterval(() => {
//                 //     container.style.pointerEvents = 'all'
//                 // }, 1000);

//                 match(filppedCard[0], filppedCard[1])
//             }
//         })
//     }
// }