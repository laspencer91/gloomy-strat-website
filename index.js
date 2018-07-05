var express = require('express');
var app     = express()
var STRATS  = require('./data/strats.json');

var clients = [];

var currentMapName = "coastal";
var currentMap     = STRATS[currentMapName];
var currentStrat   = currentMap[0];
var players        = STRATS.players;

var PORT = process.env.PORT || 3000;

app.use(express.static('public'))

app.get('/', function (req, res) {
   res.sendFile(__dirname + '/public/team-member-strat.html');
})

app.get('/leader', function (req, res) {
    res.sendFile(__dirname + '/public/team-leader-strat.html');
 })

let server = app.listen(PORT, function () {
   console.log('Example app listening on port ' + PORT)
})


var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({ server, autoAcceptConnections: false });

wss.on('connection', function (ws) {
    ws.send(JSON.stringify({
        id: "playerUpdate",
        players,
        currentMapName: currentMapName,
        currentStrat
    }));

    ws.on('message', function (message) {
        if (message === "connected/leader") {
            ws.send(JSON.stringify({
                id: "stratDataUpdate",
                STRATS
            }));
        }
        else if (message != "connected") {
            message = JSON.parse(message);
        }

        if (message.id === "leaderStratUpdate") {
            currentMapName = message.map;
            currentMap     = STRATS[currentMapName];
            currentStrat   = findStrat(message.strat, currentMapName);

            wss.broadcast(JSON.stringify({
                id: "stratUpdate",
                currentMapName: currentMapName,
                currentStrat
            }));
        }
    });
});

wss.broadcast = function broadcast(data) {
    wss.clients.forEach(function each(client) {
            client.send(data);
    });
};

function broadcastMessage(data) {
    clients.forEach(function(client) {
        client.send(data);
    });
}


function findStrat(stratName, map) {
    let mapData = STRATS[map];

    for (let i = 0; i < mapData.length; i++) {
        let currStrat = mapData[i];
        if (currStrat.name === stratName) {
            return currStrat;
        }
    }

    console.log("No strat found for this map.");
    return null;
} 