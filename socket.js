$("#spnStatus").html("Down");
$("#spnStatus").addClass("red");
$("#spnStatus").removeClass("green");
var socket = io('http://127.0.0.1:8080')
// alerts
socket.on('connect', () => {
    //let token = socket.handshake.query.token;
    $("#spnStatus").html("Up");
    $("#spnStatus").addClass("green");
    $("#spnStatus").removeClass("red");

    socket.on('alerts', (alert) => {
        var data = JSON.parse(alert);   

        console.log(alert);    
        AddAlert(data);
    });

});

function PinData() {
    this.id;
    this.pin;
}

var pinData = [];

function AddAlert(data) {
    var className = "green";

    switch (data.status) {

        case "Error":

            className = "red";
            var pinPosition = [data.long, data.lat];
            var pin = new atlas.HtmlMarker({
                htmlContent: "<div><div class='pin bounce'></div><div class='pulse'></div><span class='markerName'>" + data.name + "</span></div>",
                position: pinPosition,
                pixelOffset: [5, -18],
                name: data.name
            })

            var found = false;
            for (var i = 0; i < pinData.length; i++) {

                if (pinData[i].id == data.deviceId) {
                    found = true;
                    break;
                }
            }


            if (found == false) {

                var newData = new PinData();
                newData.id = data.deviceId;
                newData.pin = pin;
                pinData.push(newData);
                map.markers.add(pin);


                $("#tbltripped").prepend("<tr><td><strong>" + data.name + "</strong></td><td><a href='#' onclick='ClearAlert(\"" + data.deviceId + "\", this)'>Clear Alert</a></td></tr>");
            }

            break;

        case "Ok":

            // var pinPosition = [data.long, data.lat];
            // var pin = new atlas.HtmlMarker({
            //     htmlContent: "<div><div class='pinGreen bounce'></div><div class='pulseGreen'></div><span class='markerNameGreen'>" + data.name + "</span></div>",
            //     position: pinPosition,
            //     pixelOffset: [5, -18],
            //     name: data.name
            // })

            // for (var i = 0; i < pinData.length; i++) {

            //     if (pinData[i].id == data.deviceId) {
            //         map.markers.remove(pinData[i].pin);
            //         pinData.splice(i);
            //         break;
            //     }
            // }
            break;
    }

    $("#tblStatus").prepend("<tr class='" + className + "'><td><strong>" + data.name + "</strong></td><td><strong>" + data.status + "</strong></td><td><strong>" + data.text + "</strong></td></tr>");
}

function ClearAlert(deviceId, ele) {
    for (var i = 0; i < pinData.length; i++) {

        if (pinData[i].id == deviceId) {
            $(ele).parent().parent().remove();
            map.markers.remove(pinData[i].pin);
            pinData.splice(i);            
            break;
        }
    }
}