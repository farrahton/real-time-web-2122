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


io.on('connection', (socket) => {
    console.log('made a connection')

    socket.on('message', (message) => {
        io.emit('message', message)
    })

    socket.on('disconnect', () => {
        console.log('user disconnected')
    })
})


http.listen(port, () => {
    console.log('listening on port ', port)
})