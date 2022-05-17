# Live demo

http://blm-memory-game.herokuapp.com/

# Project concept

I had a lot of different concept ideas at first. My top 3 were:

1. Multiplayer wordle met LastFm API om 5 letter woorden uit teksten van specifieke muziekartiesten te halen.
2. Mulitplayer SongGuessing game op basis van scrobbles van twee LastFm gebruikers.
3. A multiplayer Black Lives Matter turn based memory game met een black history facts/quotes. The cards for the game are from a quartet game I made last year.

I ended op implementing the third idea.

# Installation

Clone this repo

```
https://github.com/farrahton/real-time-web-2122.git
```

In a terminal type the following:

```
npm install
```

And install the packages used for this project

```
$ npm install ejs
```

```
$ npm install express
```

```
 $ npm install --global nodemon
```

```
$ npm install socket.io
```

```
$ npm install node-fetch
```

```
$ npm install fetch
```

# Data life cycle

![image](https://user-images.githubusercontent.com/92303930/168808422-068b17e6-4641-4c99-88b3-0a24c05efe89.jpeg)


# Real-time events

- connection
- connected user(s) list
- the turns/active player
- flipping cards

# Datamanagement

I started out simple and stored data in an array.

```js
let onlinePlayers = [];

onlinePlayers.push([playerName, socket.id]);
```

This array consists of a playerName and a socket.id.

# MoSCoW

<strong> Must </strong>

- [x] Use socket.io events
- [x] Use an API
- [x] Game logic for a memory game
  - [x] check amount of cards you clicked
  - [x] check if the cards are a match or not
- [x] Pick a playername
- [x] See online users
- [x] See when a person disconnects
- [x] See when other player makes their turn
- [x] Turn based game

<strong> Should </strong>

- [ ] Point system
- [ ] UI stack
- [ ] Cute animations for wrong or correct answer

<strong> Could </strong>

- [ ] A/multiple different memory card set(s) in the same theme that are used after you have played one round
- [ ] Pop up screen that says if it is your turn or not (that shows a quote from the API)

<strong> Would </strong>

- [ ] Show the same facts to different users
