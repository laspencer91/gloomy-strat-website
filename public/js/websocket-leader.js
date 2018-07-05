var host = location.origin.replace(/^http/, 'ws')
var ws = new WebSocket(host);

var STRATS;

// event emmited when connected
ws.onopen = function () {
    ws.send('connected/leader');
}

// event emmited when receiving message 
ws.onmessage = function (ev) {
    let message = JSON.parse(ev.data);

    if (message.id === "stratDataUpdate") {
        STRATS = message.STRATS;
        fillMapSelectionList();
        fillStratSelectionList();
    }
}

$('#map-select').on('change', function() {
    fillStratSelectionList();
    sendNewStratEvent();
})

$('#strat-select').on('change', function() {
    sendNewStratEvent();
})

function fillMapSelectionList() {
    let selectBox = $("#map-select");
    selectBox.empty();

    $.each(STRATS.maps, function(i, map) {
        selectBox.append(`<option value="${map}">${map}</option>`);
    });
}

function fillStratSelectionList() {
    let selectBox = $("#strat-select");
    selectBox.empty();

    console.log($("#map-select").val());
    console.log(STRATS.maps);
    console.log(STRATS[$("#map-select").val()]);

    $.each(STRATS[$("#map-select").val()], function(i, strat) {
        selectBox.append(`<option value="${strat.name}">${strat.name}</option>`);
    });

    sendNewStratEvent();
}

function sendNewStratEvent() {
    ws.send(JSON.stringify({
        id: "leaderStratUpdate",
        map: $("#map-select").val(),
        strat: $("#strat-select").val() 
    }));
}

function fillListFromArray(list, stepArray) {
    list.empty();

    $.each(stepArray, function(i, step) {
        step = step.replace("SMOKE", `<img src="images/smoke.png" class="inline-img"/>`);
        step = step.replace("NADE", `<img src="images/frag.png" class="inline-img"/>`);
        list.append(`<li>${step}</li>`);
    });
}