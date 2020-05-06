var excludes = readConfig("excludes", "");
var config = {
    // defines the area
    x: readConfig("x", 0),
    y: readConfig("y", 0),
    width: readConfig("width", 1920),
    height: readConfig("height", 1080),
    
    // if false, any windows outside the area will stick
    // if true, any windows inside the area will stick
    include: readConfig("pinmode", false),

// list of clients to exclude
    excludes: [
          "Desktop — Plasma",
          "Latte Shell — Latte Dock",
          "Latte Dock"
    ].concat((excludes == "" ? [] : ("" + excludes).split("\n")))
};
startDesktopPin();

function calcPins(client) {
    if (clientIsExcluded(client)) return

    var midPointX = client.geometry.x + (client.geometry.width / 2);
    var midPointY = client.geometry.y + (client.geometry.height/ 2);
    var isInArea = (midPointX >= config.x && midPointX <= config.x + config.width) && (midPointY >= config.y && midPointY <= config.y + config.height);
    client.onAllDesktops = (config.include == isInArea);
    print(client.caption + " in area?: " + isInArea + " setting on all desktops to: " + client.onAllDesktops);
}

function startDesktopPin() {   
    var clients = workspace.clientList();
    for (var i = clients.length; i > 0; i--) {
        onClientAdded(clients[i]);
    }
    workspace.clientAdded.connect(onClientAdded);
    workspace.clientRemoved.connect(onClientRemoved);
}

function onClientMoved(client) {
    if (typeof client === 'undefined') {
        return;
    }
    calcPins(client);
}

function onClientAdded(client) {
    if (typeof client === 'undefined') {
        return;
    }
    client.clientFinishUserMovedResized.connect(onClientMoved);
    calcPins(client);
}

function onClientRemoved(client) {
    if (typeof client === 'undefined') {
        return;
    }
    client.clientFinishUserMovedResized.disconnect(onClientMoved);
}

function clientIsExcluded(client) {
    for(var i=0; i<config.excludes.length; i++) {        
        var result = client.caption.match(new RegExp(config.excludes[i])) != null;
        if (result) {
            print(client.caption + " is in our exclude list, skipping");
            return result;
        }
    }
    return false;
}