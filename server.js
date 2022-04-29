const express = require('express')
const app = express()
const http = require('http').createServer(app)
const path = require('path')
const io = require('socket.io')(http)
const port = process.env.PORT || 4500
// const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

app.use(express.static(path.resolve('public')))

// app.set('view engine', 'ejs')
// app.set('views', './views')

// app.get('/', (request, response) => {
//     response.render('index')
// })
// var users = {};

io.on('connection', (socket) => {
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

    socket.on('create', function (room) {
        socket.join(room)
        console.log("joined yeet" + room)
        // io.emit("shuffle")
        io.to("room").emit("showCards")
        // console.log(showCards)

        // console.log(clickCards)
    })

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




