const express = require('express')
const app = express()
const http = require('http').createServer(app)
const path = require('path')
const io = require('socket.io')(http)
const port = process.env.PORT || 4500
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

app.use(express.static(path.resolve('public')))

app.set('view engine', 'ejs')
app.set('views', './views')

app.get('/', (request, response) => {
    response.render('index')
})


// var requestOptions = {
//     method: 'GET',
//     headers: {
//         "Authorization": "Bearer 5ezuDC6OE9O3-2LrtkZ9c7AHCMUhdM06fFTnA9tWh02IH3BV-gd1MjlUFBkeFIP_"
//     },
//     redirect: 'follow'
// };

// fetch("https://api.genius.com/artists/1165372/songs?sort=popularity", requestOptions)
//     .then(response => response.json())
//     // .then(result => console.log(result))
//     .then((jsonData) => {

//         const data = jsonData.response
//         console.log(data)
//     })
//     .catch(error => console.log('error', error));

// fetch("https://api.genius.com/artists/1165372/songs/5521663", {
//     method: 'GET',
//     headers: {
//         "Authorization": "Bearer 5ezuDC6OE9O3-2LrtkZ9c7AHCMUhdM06fFTnA9tWh02IH3BV-gd1MjlUFBkeFIP_ "
//     },
// })
//     .then(response => response.json())
//     // .then(result => console.log(result))
//     .then((jsonData) => {

//         const data = jsonData
//         console.log(data)
//     })
//     .catch(error => console.log('error', error));


// const options = {
// 	method: 'GET',
// 	headers: {
// 		'X-RapidAPI-Host': 'genius-song-lyrics1.p.rapidapi.com',
// 		'X-RapidAPI-Key': 'abfd2142c9msha7c556cc07a1915p1395fbjsn367d88bf9552'
// 	}
// };

// fetch('https://genius-song-lyrics1.p.rapidapi.com/songs/5521663/lyrics', options)
// 	.then(response => response.json())
// 	.then(response => console.log(response))
// 	.catch(err => console.error(err));


const options = {
    method: 'GET',
    headers: {
        'X-RapidAPI-Host': 'genius-song-lyrics1.p.rapidapi.com',
        'X-RapidAPI-Key': 'abfd2142c9msha7c556cc07a1915p1395fbjsn367d88bf9552'
    }
};

fetch('https://genius-song-lyrics1.p.rapidapi.com/songs/5521663/lyrics', options)
    .then(response => response.json())
    // .then(response => console.log(response))
    .then((jsonData) => {
        const data = jsonData.response.lyrics.lyrics.body.plain
        console.log(data)
        // .filter((dataLyrics) => filterOnLength(dataLyrics, 5))
        // console.log(dataLyrics)
    })
    .catch(err => console.error(err));

function filterOnLength(dataLyrics, length) {
    return dataLyrics > length
}


// function renderLyrics(member) {
//     return `
// <article>
// <h1>${member.memberName} ${member.memberSurname}</h1>
// <p>${member.tribeName}</p>
// </article>`
// }

io.on('connection', (socket) => {
    console.log('made a connection')

    socket.on('disconnect', () => {
        console.log('user disconnected')
    })
})


http.listen(port, () => {
    console.log('listening on port ', port)
})