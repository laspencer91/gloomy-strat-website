var host = location.origin.replace(/^http/, 'ws')
var ws = new WebSocket(host);

var currentStratData, mapName;

// event emmited when connected
ws.onopen = function () {
    console.log('websocket is connected ...');
    ws.send('connected');
}

// event emmited when receiving message 
ws.onmessage = function (ev) {
    let message = JSON.parse(ev.data);

    if (message.id === "playerUpdate") {
        currentStratData = message.currentStrat;
        mapName          = message.currentMapName;

        let players = message.players;

        for (let i = 0; i < players.length; i++) {
            $('#name-select').append($('<option>', {
                value: players[i],
                text: players[i]
            }));
        }

        updateGui();
    }

    if (message.id === "stratUpdate") {
        currentStratData = message.currentStrat;
        mapName          = message.currentMapName;
        updateGui();
    }
}

$('#name-select').on('change', function() {
    updateGui();
})

function updateGui() {
    $("#map-name").text(mapName);
    $("#strat-name").text(currentStratData.name);
    $("#summary .text").text(currentStratData.summary);

    let myRole = getRoleByName($('#name-select').val());
    if (myRole != null) {
        if (myRole.loadout.frag) $("#frag").removeClass("not-required"); else $("#frag").addClass("not-required");
        if (myRole.loadout.smoke) $("#smoke").removeClass("not-required"); else $("#smoke").addClass("not-required");

        let roleArray = myRole.summary.split(",");
        fillListFromArray($("#role-list"), roleArray);
    }
}

function getRoleByName(name) {
    let roles = currentStratData.roles;

    for (let i = 0; i < roles.length; i++) {
        if (roles[i].name.toLowerCase() === name.toLowerCase()) {
            return roles[i];
        }
    }
    console.log("No roll with name " + name + " was found.");
    return null;
}

function fillListFromArray(list, stepArray) {
    list.empty();

    $.each(stepArray, function(i, step) {
        step = step.replace("SMOKE", `<img src="images/smoke.png" class="inline-img"/>`);
        step = step.replace("NADE", `<img src="images/frag.png" class="inline-img"/>`);
        list.append(`<li>${step}</li>`);
    });
}