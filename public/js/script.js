let socket = io()

const card = document.querySelectorAll('.card')
const front = document.querySelectorAll('.front')
const content = document.querySelectorAll('.content')
const container = document.querySelector('main')
const score = document.querySelector('span')

// function playername() { 
// let name = prompt("what's your name?", "John Doe")
// if (name != null) {
//     document.getElementById("name").innerHTML =
//     "Hello " + name + "! How are you today?";
//   }
// }
let playerName = prompt("what's your name?", "John Doe")
socket.emit("player", playerName)

socket.on("onlinePlayers", (onlinePlayers) => {
    // Clear the list of current online connected users.
    document.querySelector("ul").innerHTML = ""

    onlinePlayers.forEach((onlinePlayer) => {
        // Add the player to the list.
        document.querySelector("ul").appendChild(Object.assign(document.createElement("li"), {
            innerHTML: `${onlinePlayer[0]} <span id="playersscore">${onlinePlayer[2]}</span>`
        }))
    })
})


// to shuffle the cards beforehand 
card.forEach(c => {
    const num = [...Array(card.length).keys()]
    const random = Math.floor(Math.random() * card.length)
    c.style.order = num[random]
})

showCardsAtFirst()
// clicking()






//   socket.on('cardsScore', (cardsScore) => {
//         users[socket.id].score = cardsScore;
//         io.emit('cardsScore', users)
//     })

// socket.on("addScore", card => {

// })




// console.log('works')
// socket.emit('flippedTwoCards', "hallo")

// socket.emit('test', "Lisanne")

// clicking()

card.forEach(e => {
    clicking()
})

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
        card[i].addEventListener('click', () => {
            content[i].classList.add('flip')
            // socket.emit("clickCard", i)

            // without the time out it takes too long to see the scoreboard go up
            setTimeout(() => {
                const flippedCard = document.querySelectorAll('.flip')

                //  limit to amount of cards you can flip
                if (flippedCard.length == 2) {

                    // then you're not allowed to do anything with your mouse anymore
                    // container.style.pointerEvents = 'none'

                    // // after 1 second you're allowed to again
                    // setInterval(() => {
                    //     container.style.pointerEvents = 'all'
                    // }, 1000);
                    console.log(flippedCard);
                    match(flippedCard[0], flippedCard[1])
                }
            }, 500)
        })
    }
}


function match(cardOne, cardTwo) {
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
        // container.style.pointerEvents = 'none'

        // after a second you can do things with your mouse again
        // setInterval(() => {
        //     container.style.pointerEvents = 'all'
        // }, 1000);
    } else {
        // if the cards do not match then you're not allowed to do anything with your mouse
        // container.style.pointerEvents = 'none'

        setTimeout(() => {
            cardOne.classList.remove('flip')
            cardTwo.classList.remove('flip')
        }, 1000);
    }
}











