const express = require('express')
const app = express()
const http = require('http').createServer(app)
const path = require('path')
const io = require('socket.io')(http)
const port = process.env.PORT || 4500
// const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

app.use(express.static(path.resolve('public')))

let onlinePlayers = []

io.on('connection', (socket) => {
    console.log('made a connection' + socket.id)

    socket.on("player", playerName => {
         // Add the name, connection ID and score to the list of online players.
         onlinePlayers.push([playerName, socket.id, 0])

         // Emit the names, connection IDs and scores of the online players.
        io.emit("onlinePlayers", onlinePlayers)
    })

    socket.on('disconnect', () => {
        console.log('user disconnected')

        // Remove disconnected players from list of online players!
    })
})


http.listen(port, () => {
    console.log('listening on port ', port)
})






