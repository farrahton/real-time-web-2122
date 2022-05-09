let socket = io()
let magSpelen = false;

// require("dotenv").config()

const card = document.querySelectorAll('.card')
const front = document.querySelectorAll('.front')
const content = document.querySelectorAll('.content')
const container = document.querySelector('main')
const score = document.querySelector('span')


// shuffle de kaarten voorafgaand het spel
card.forEach(c => {
    const num = [...Array(card.length).keys()]
    const random = Math.floor(Math.random() * card.length)
    c.style.order = num[random]
})

// user kan zijn/haar naam intypen
let playerName = prompt("what's your name?", "John Doe")
socket.emit("player", playerName)

// voer de functie uit zodat de player even de kaartjes te zien krijgt 
showCardsAtFirst()
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

socket.on("onlinePlayers", (onlinePlayers) => {
    // lege lijst van players die momenteel online zijn
    document.querySelector("ul").innerHTML = ""

    onlinePlayers.forEach((onlinePlayer) => {
        // voeg de player (nummer 0 van de array) toe aan de lijst in html en geef die een startscore (nummer 2 in de array) van 0
        document.querySelector("ul").appendChild(Object.assign(document.createElement("li"), {
            innerHTML: `${onlinePlayer[0]} <span id="playersscore">${onlinePlayer[2]}</span>`
        }))
         // even scrollen als de lijst te lang wordt
         document.querySelector("ul").scrollTop = document.querySelector("ul").scrollHeight
    })
})


// de flip animatie op de kaart wordt aan alle online players getoond
socket.on("clickCard", card => {
    content[card].classList.add('flip')
})

// keuze om op de knop te klikken om de beurt te geven aan de volgende player in de array
// document.querySelector("#next-turn").addEventListener("click", (event) => {
//     event.preventDefault()
//     socket.emit("turn")
// })

socket.on("activePlayer", (activePlayer) => {
    // console.log("playerName: " + playerName)
    // console.log("activeplayer: " + activePlayer)
    // console.log("activePlayer == playerName: " + (activePlayer == playerName))
    if (activePlayer == playerName) {
        console.log("Het is jouw beurt!")
        magSpelen = true;

        container.style.pointerEvents = 'all'
        
        for (let i = 0; i < content.length; i++) {
            card[i].addEventListener('click', () => {
                console.log("Test")
                // content[i].classList.add('flip')
                socket.emit("clickCard", i)
    
                // zonder de tijd duurde het te lang voor de score en kan je er opeens 3 aanklikken?
                setTimeout(() => {
                    const flippedCard = document.querySelectorAll('.flip')
    
                    // we willen alleen de lengte van de geflipte kaarten weten
                    if (flippedCard.length == 2) {
                        // zodra de lengte 2 is, dan mag je niets meer met je muis doen in het gebied van de kaarten
                        container.style.pointerEvents = 'none'
                        // en wordt de match functie uitgevoerd op de twee kaarten
                        match(flippedCard[0], flippedCard[1])
                        // de volgende player in de array krijgt de beurt
                        socket.emit("turn")
                    }
                }, 500)
            })
        }

    } else {
        magSpelen = false;
        // als je niet aan de beurt bent mag je niets met je muis doen in het gebied van de kaartjes
        container.style.pointerEvents = 'none'
        console.log("Jij mag nog geen kaarten omdraaien..");
         // de volgende player in de array krijgt de beurt na 10 seconden dan switcht ie wel, maar pakt ie de length ==2 niet?
        //  setTimeout(() => {
        //   socket.emit("turn")
    // }, 10000)
    }
})



function match(cardOne, cardTwo) {
    // als de data-index matcht van de twee omgedraaide kaarten dan
    console.log(cardOne, cardTwo);
    if (cardOne.dataset.index == cardTwo.dataset.index) {
        // 1 punt toevoegen aan scoreboard 
        // playersscore.innerHTML = parseInt(playersscore.innerHTML) + 1
         // 1 punt toevoegen aan score van player
        socket.emit("playerScore")
        // console.log(playerScore)

        // haal de flip class ervanaf
        cardOne.classList.remove('flip')
        cardTwo.classList.remove('flip')

        // en voeg match toe om hem omgedraaid in beeld te laten 
        cardOne.classList.add('match')
        cardTwo.classList.add('match')
    } else {
        // als de kaarten niet matchen halen we de flip animatie ervanaf om weer de achterkant van de kaarten te zien na 1 seconde
        setTimeout(() => {
            cardOne.classList.remove('flip')
            cardTwo.classList.remove('flip')
        }, 1000);
    }
}

// socket.on("playerScore", playersscore => {
//     playersscore.innerHTML = parseInt(playersscore.innerHTML) + 1

// })

// const APIKEY = process.env.API_KEY

// const options = {
// 	method: 'GET',
// 	headers: {
// 		'X-RapidAPI-Host': 'healthruwords.p.rapidapi.com',
// 		'X-RapidAPI-Key': '${APIKEY}'
// 	}
// };

// fetch('https://healthruwords.p.rapidapi.com/v1/quotes/?t=Wisdom&maxR=1&size=medium&id=731', options)
// 	.then(response => response.json())
// 	.then(response => console.log(response))
// 	.catch(err => console.error(err));


