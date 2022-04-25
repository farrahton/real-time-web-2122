let socket = io()

const card = document.querySelectorAll('.card')
const front = document.querySelectorAll('.front')
const content = document.querySelectorAll('.content')
const container = document.querySelector('main')
const score = document.querySelector('span')


clicking()

// to shuffle the cards on every reload
card.forEach(c => {
    const num = [...Array(card.length).keys()]
    const random = Math.floor(Math.random() * card.length)

    c.style.order = num[random]
})


function clicking() {
    for (let i = 0; i < card.length; i++) {
        content[i].classList.add('show')

        // show the cards a few seconds before they turn around
        setInterval(() => {
            content[i].classList.remove('show')
        }, 2000);

        card[i].addEventListener('click', () => {
            content[i].classList.add('flip')

            const filppedCard = document.querySelectorAll('.flip')

            if (filppedCard.length == 2) {
                container.style.pointerEvents = 'none'
                setInterval(() => {
                    container.style.pointerEvents = 'all'
                }, 1000);
                match(filppedCard[0], filppedCard[1])
            }
        })
    }
}

function match(cardOne, cardTwo) {

    if (cardOne.dataset.index == cardTwo.dataset.index) {
        // add one to the score
        score.innerHTML = parseInt(score.innerHTML) + 1

        cardOne.classList.remove('flip')
        cardTwo.classList.remove('flip')

        cardOne.classList.add('match')
        cardTwo.classList.add('match')
    } else {
        setTimeout(() => {
            cardOne.classList.remove('flip')
            cardTwo.classList.remove('flip')
        }, 1000);
    }
}