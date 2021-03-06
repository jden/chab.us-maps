function drawbus(bus) {
    var color = "#000000";
    var headings = {
        N: 0,
        NNE: 22.5,
        NE: 45,
        ENE: 67.5,
        E: 90,
        ESE: 112.5,
        SE: 135,
        SSE: 157.5,
        S: 180,
        SSW: 202.5,
        SW: 225,
        WSW: 247.5,
        W: 270,
        WNW: 292.5,
        NW: 315,
        NNW: 337.5
    }
    if(bus.properties.route == "33" || bus.properties.route == "34") {
        color = "#029f5b"
    }
    var symbol = {
        path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
        scale: 3,
        rotation: heading,
        fillColor: color,
        strokeColor: color
    }
    buslocation =  new google.maps.LatLng(bus.geometry.coordinates[1], bus.geometry.coordinates[0]);
    var heading = headings[bus.properties.heading];
    if(!window.buses[bus.id]) {
        window.buses[bus.id] = new google.maps.Marker({
            position: buslocation,
            title: ("Bus #" + bus.id),
            icon: symbol,
            map: map
            });
    } else {
        window.buses[bus.id].setPosition(buslocation);
        var iconUpdate = window.buses[bus.id].getIcon();
        iconUpdate.rotation = heading;
        window.buses[bus.id].setIcon(iconUpdate);
    }
}
    
function setCurrentLocation() {
    if(window.myloc) {
        window.myloc.setMap(null);
        window.myloc = null;
    }
    window.myloc = new google.maps.Marker({
    clickable: false,
    icon: new google.maps.MarkerImage('//maps.gstatic.com/mapfiles/mobile/mobileimgs2.png',
                                                    new google.maps.Size(22,22),
                                                    new google.maps.Point(0,18),
                                                    new google.maps.Point(11,11)),
    shadow: null,
    zIndex: 999,
    map: window.map // your google.maps.Map object
    });

    if (navigator.geolocation) navigator.geolocation.getCurrentPosition(function(pos) {
        var me = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
        myloc.setPosition(me);
    }, function(error) {
        // ...
    });
}
function chabusInitialize(map) {
    window.buses = {};
    xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", "http://api.chab.us/buses", false);
    xmlHttp.send();
    var initialbuses = JSON.parse(xmlHttp.responseText).features;
    for(var i = 0; i < initialbuses.length; i++) {
        if(initialbuses[i].properties.route != "U") {
            drawbus(initialbuses[i]);
        }
    }
    markerlocation = new google.maps.LatLng(35.0344, -85.2700);
    //var marker = new google.maps.Marker({
    //    position: markerlocation,
    //    title: "Test Marker",
    //    icon: {
    //        path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
    //        scale: 2
    //        },
    //    map: map
    //    });
    new EventSource('http://api.chab.us/buses/tail').addEventListener('change', function (x) { 
        var bus = JSON.parse(x.data);

        //console.log(bus.id);
        drawbus(bus);
        setCurrentLocation();
        
    });
}
