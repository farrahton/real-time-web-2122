let socket = io()

const canvas = document.getElementsByTagName('canvas')[0]
canvas.width = window.innerWidth
canvas.height = window.innerHeight

// render the context to be able to draw
const ctx = canvas.getContext('2d')
// ctx.fillRect(50, 50, 100, 100)

const keyboardState = {}

function renderAvatar(player) {
    if (player.eliminated) return

    ctx.save()
    ctx.translate(player.x, player.y)

    // draw body
    ctx.beginPath()
    ctx.arc(0, 0, 20, 0, 2 * Math.PI)
    ctx.closePath()
    ctx.fillStyle = player.color
    ctx.fill()

    // draw username
    ctx.textAlign = 'center'
    ctx.fillStyle = 'black'
    ctx.fillText(player.username, 0, 34)

    // draw eyes
    // rotate here prior to drawing the eyes,
    // to make the eyes face that the avatar should have
    switch (player.rotation) {
        case FACING_DOWN:
            ctx.rotate(0)
            break
        case FACING_UP:
            ctx.rotate(Math.PI)
            break
        case FACING_LEFT:
            ctx.rotate(Math.PI / 2)
            break
        case FACING_RIGHT:
            ctx.rotate(Math.PI * 1.5)
            break
    }
    ctx.beginPath()
    ctx.moveTo(-5, 5)
    ctx.lineTo(-5, 17)
    ctx.moveTo(5, 5)
    ctx.lineTo(5, 17)
    ctx.stroke()

    ctx.restore()
}

function renderSnowball(snowball) {
    ctx.save()
    ctx.translate(snowball.x, snowball.y)

    ctx.beginPath()
    ctx.arc(0, 0, 8, 0, 2 * Math.PI)
    ctx.closePath()
    ctx.fillStyle = 'lightblue'
    ctx.fill()

    ctx.restore()
}

const SNOWBALL_SPEED = 5
const PLAYER_SPEED = 3
const FACING_UP = 2
const FACING_DOWN = 0
const FACING_LEFT = 1
const FACING_RIGHT = 3

const gameState = {
    players: [
        {
            username: prompt("What's your username?"),
            playerId: Math.floor(Math.random() * 100000000),
            x: 50, y: 50,
            color: '#ae83c3',
            rotation: FACING_DOWN,
            snowballs: []
        }
    ]
}

const myPlayerId = gameState.players[0].playerId

function render(state) {
    ctx.fillStyle = '#88B04B'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    state.players.forEach(function (player) {
        renderAvatar(player)

        player.snowballs.forEach(function (snowball) {
            renderSnowball(snowball)
        })
    })

}

const PLAYER_RADIUS = 20
const SNOWBALL_RADIUS = 8

function hitTestPlayerVsPlayer(playerA, playerB) {
    return Math.sqrt(Math.pow(playerA.x - playerB.x, 2) + Math.pow(playerA.y - playerB.y, 2)) < (PLAYER_RADIUS * 2)
}
function hitTestPlayerVsSnowball(player, snowball) {
    return Math.sqrt(Math.pow(player.x - snowball.x, 2) + Math.pow(player.y - snowball.y, 2)) < (PLAYER_RADIUS + SNOWBALL_RADIUS)
}

function logicStep(state) {
    state.players.forEach(player => { // just another way of writing f
        player.snowballs.forEach(snowball => {
            snowball.x += snowball.vx
            snowball.y += snowball.vy

            if (snowball.x < 0 || snowball.x > window.innerWidth ||
                snowball.y < 0 || snowball.y > window.innerHeight) {
                snowball.remove = true
            }
        })
        player.snowballs = player.snowballs.filter(snowball => {
            const shouldBeKept = (snowball.remove !== true)
            return shouldBeKept
        })
    })

    // only moving player one now
    const myPlayer = state.players[0]
    if (!myPlayer.eliminated) {
        if (keyboardState.w) {
            myPlayer.y -= PLAYER_SPEED
            myPlayer.rotation = FACING_UP
        }
        if (keyboardState.s) {
            myPlayer.y += PLAYER_SPEED
            myPlayer.rotation = FACING_DOWN
        }
        if (keyboardState.d) {
            state.players[0].x += PLAYER_SPEED
            myPlayer.rotation = FACING_RIGHT
        }
        if (keyboardState.a) {
            state.players[0].x -= PLAYER_SPEED
            myPlayer.rotation = FACING_LEFT
        }
    }

    // collision algorithm
    state.players.forEach(playerA => {
        playerA.snowballs.forEach(snowball => {
            state.players.forEach(playerB => {
                if (playerA === playerB) {
                    // don't hit yourself
                    return
                }

                if (hitTestPlayerVsSnowball(playerB, snowball)) {
                    snowball.remove = true
                    if (playerB.playerId === myPlayerId) {
                        // others must remove themselves
                        playerB.eliminated = true
                    }
                }
            })
        })
    })

    // remove eliminated players
    // state.players = state.players.filter(player => !player.eliminated)

    socket.emit('stateUpdate', state.players[0])
}

function gameLoop() {
    requestAnimationFrame(gameLoop)
    logicStep(gameState)
    render(gameState)
}

gameLoop()


document.addEventListener('keydown', function (e) {
    keyboardState[e.key] = true

    if (e.key === ' ') { // spacebar lol

        const myPlayer = gameState.players[0]
        const snowball = {
            x: myPlayer.x, y: myPlayer.y,
            vx: 0, vy: 0
        }

        switch (myPlayer.rotation) {
            case FACING_DOWN:
                snowball.vy = SNOWBALL_SPEED
                break
            case FACING_UP:
                snowball.vy = -SNOWBALL_SPEED
                break
            case FACING_LEFT:
                snowball.vx = -SNOWBALL_SPEED
                break
            case FACING_RIGHT:
                snowball.vx = +SNOWBALL_SPEED
                break
        }

        myPlayer.snowballs.push(snowball)
    }
})
document.addEventListener('keyup', function (e) {
    keyboardState[e.key] = false
})


socket.on('stateUpdateForwardedByServer', function (player) {
    if (player.playerId === myPlayerId) {
        // ignore own update
        return
    }

    let playerWasFound = false
    for (let i = 0; i < gameState.players.length; ++i) {
        if (gameState.players[i].playerId === player.playerId) {
            gameState.players[i] = player
            playerWasFound = true
            break // don't continue looping, pointless
        }
    }

    if (!playerWasFound) {
        // player we haven't seen before
        gameState.players.push(player)
    }
})



// CHATBOX

let messages = document.querySelector('section ul')
let input = document.querySelector('input')

document.querySelector('form').addEventListener('submit', event => {
    event.preventDefault()
    if (input.value) {
        socket.emit('message', input.value)
        input.value = ''
    }
})

socket.on('message', message => {
    messages.appendChild(Object.assign(document.createElement('li'), { textContent: message }))
    messages.scrollTop = messages.scrollHeight
})