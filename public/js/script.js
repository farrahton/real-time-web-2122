let socket = io()
let clickedCards = 0

const card = document.querySelectorAll('.card')
const content = document.querySelectorAll('.content')
const container = document.querySelector('main')

// shuffle de kaarten voorafgaand het spel
card.forEach(c => {
    const num = [...Array(card.length).keys()]
    const random = Math.floor(Math.random() * card.length)
    c.style.order = num[random]
})

// user kan zijn/haar naam intypen
let playerName = prompt("what's your name?", "John Doe")
socket.emit("player", playerName)

 // koppel de event listeners aan de kaarten
 for (let i = 0; i < content.length; i++) {
    card[i].addEventListener('click', (event) => {
        console.log('Kaart aangeklikt: ', event.target)
        socket.emit("clickCard", i)
        clickedCards++
        
        if (clickedCards > 1) {
            container.style.pointerEvents = 'none'
            socket.emit("turn")
            clickedCards = 0
        }
    })
}

// voer de functie uit zodat de player even de kaartjes te zien krijgt 
showCardsAtFirst()

socket.on("onlinePlayers", (onlinePlayers) => {
    console.log(onlinePlayers)
    // lege lijst van players die momenteel online zijn
    document.querySelector("ul").innerHTML = ""

    onlinePlayers.forEach((onlinePlayer) => {
        // voeg de player (nummer 0 van de array) toe aan de lijst in html
        document.querySelector("ul").appendChild(Object.assign(document.createElement("li"), {
            innerHTML: `${onlinePlayer[0]}`
        }))
    })
})


// de flip animatie op de kaart wordt aan alle online players getoond
socket.on("clickCard", card => {
    content[card].classList.add('flip')
    // console.log("Kaart omgedraaid in clickCard:", content[card])
    const flippedCard = document.querySelectorAll('.flip')
    // console.log("Aantal elementen met .flip: ", flippedCard.length)

    // we willen alleen de lengte van de kaarten met de flip class 
    if (flippedCard.length == 2) {
        // en wordt de match functie uitgevoerd op de twee kaarten
        match(flippedCard[0], flippedCard[1])
    }
})

socket.on("activePlayer", (activePlayer) => {
    if (activePlayer == socket.id) {
        console.log("Het is jouw beurt!")
        // de persoon aan de beurt krijgt de rechten om weer iets met de muis te doen in het gebied van de kaartjes
        container.style.pointerEvents = 'all'
    } else {
        // als je niet aan de beurt bent mag je niets met je muis doen in het gebied van de kaartjes
        console.log("Het is niet jouw beurt!");
        container.style.pointerEvents = 'none'
    }
})


function showCardsAtFirst() {
    for (let i = 0; i < content.length; i++) {
        // show the cards a few seconds before
        content[i].classList.add('show')

        // after 2 seconds they turn back around
        setInterval(() => {
            content[i].classList.remove('show')
        }, 500);
    }
}

function match(cardOne, cardTwo) {
    const flippedCard = document.querySelectorAll('.flip')

    // als de data-index matcht van de twee omgedraaide kaarten dan
    console.log(cardOne, cardTwo);
    if (cardOne.dataset.index == cardTwo.dataset.index) {
        // haal de flip class ervanaf
        flippedCard.forEach(card => { card.classList.remove('flip') })

        // en voeg match toe om hem omgedraaid in beeld te laten 
        cardOne.classList.add('match')
        cardTwo.classList.add('match')
    } else {
        // als de kaarten niet matchen halen we de flip animatie ervanaf om weer de achterkant van de kaarten te zien na 1 seconde
        setTimeout(() => {
            flippedCard.forEach(card => { card.classList.remove('flip') })
        }, 1000);
    }
}
