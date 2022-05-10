const express = require('express')
const app = express()
const http = require('http').createServer(app)
const path = require('path')
const io = require('socket.io')(http)
const port = process.env.PORT || 4500
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

app.use(express.static(path.resolve('public')))

// ejs instellen als template engine
app.set('view engine', 'ejs')
app.set('views', './views')

// route voor de index
app.get('/', function (req, res) {
    res.render('index');
  })

// route voor de facts 
app.get('/facts', async (req, res) => {
    res.render('facts')
    // fetch("https://black-history-month-api.herokuapp.com/people")
    // .then(function(response) {
    //   return response.json();
    // })
    // .then(function(data) {
    //   var data = data[Math.floor(Math.random()*data.length)];
      
    //   console.log(data);
      // data[288]
      // console.log(data[288]);
    //   res.render('facts', {
        // data: data.description
    //   })
    // })
    // en dan in ejs :  <!-- <% data((facts)=> { %>
            //     <blockquote> 
            //     <%= facts.description %> 
            // </blockquote> 
            //  <% }) %> -->
})

let onlinePlayers = []
// let activePlayer = "" 

let counter = 0

// console.log(counter)

io.on('connection', (socket) => {
    socket.on("player", (playerName) => {
        // voeg de prompt playername, socket id aan de array toe
        onlinePlayers.push([playerName, socket.id])
         // emit de prompt playername, socket id
        
        io.emit("onlinePlayers", onlinePlayers)
        io.emit("activePlayer", onlinePlayers[counter][1])
    })

    socket.on("turn", () => {
        // als we er 1 aan toevoegen past het dan? dan mag je er 1 aan toevoegen
        // lengte begint bij 1 daarom - 1 we willen dat ie bij 0 begint, omdat eerste in de lijst index 0 heeft
        if (counter + 1 <= onlinePlayers.length - 1) {
            // voegt 1 toe aan de index
            counter++
        } else {
            // anders mag je hem er niet aan toevoegen
            counter = 0
        }
        // console.log(counter)
        console.log('De beurt is aan:', onlinePlayers[counter][1])
         // benoem de [0] alvast server side, zodat je minder dataverkeer hebt
        io.emit("activePlayer", onlinePlayers[counter][1])
    })
    
    // zodat je de geklikte kaart op allebei de players hun scherm ziet
    socket.on('clickCard', card => {
        io.emit("clickCard", card)
    })

    socket.on('disconnect', () => {
        console.log('user disconnected')

        // Zoek de index in onlinePlayers voor onlinePlayers[index][1] waar de socket van deze player in staat
        let index = onlinePlayers.findIndex((player) => { return player[1] === socket.id })
        onlinePlayers.splice(onlinePlayers.indexOf(index), 1)
        console.log('Aantal spelers: ', onlinePlayers.length)
    })
})

http.listen(port, () => {
    console.log('listening on port ', port)
})




