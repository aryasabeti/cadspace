var vLeft, vRight, controls;

function loadDocument(viewer, documentId) {
    // Find the first 3d geometry and load that.
    Autodesk.Viewing.Document.load(documentId, function(doc) { // onLoadCallback
        var geometryItems = [];
        geometryItems = Autodesk.Viewing.Document.getSubItemsWithProperties(doc.getRootItem(), {
            'type': 'geometry',
            'role': '3d'
        }, true);

        if (geometryItems.length > 0) {
            viewer.load(doc.getViewablePath(geometryItems[0]));
        }
    }, function(errorMsg) { // onErrorCallback
        alert("Load Error: " + errorMsg);
    });
};

function myInit() {
    initialize();
    initWebSocket();
};

function initialize() {
    var options = {
        'document': 'urn:dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6YXJpYS1idWNrZXQvUm9ib3RBcm0xLmR3Zng=',
        'env': 'AutodeskProduction',
        'getAccessToken': getToken,
        'refreshToken': getToken,
    };
    var viewerElement = document.getElementById('viewerLeft');
    // var viewerLeft = new Autodesk.Viewing.Viewer3D(viewerElement, {});
    vLeft = new Autodesk.Viewing.Viewer3D(viewerElement, {});
    viewerElement = document.getElementById('viewerRight');
    // var viewerRight = new Autodesk.Viewing.Viewer3D(viewerElement, {});
    vRight = new Autodesk.Viewing.Viewer3D(viewerElement, {});
    // vLeft = viewerLeft;
    // vRight = viewerRight;

    Autodesk.Viewing.Initializer(options, function() {
        vLeft.initialize();
        vRight.initialize();
        console.log(["URN", options.document]);
        loadDocument(vLeft, options.document);
        loadDocument(vRight, options.document);
    });

};

function getToken() {
    var xmlHttp = null;
    xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", "http://still-spire-1606.herokuapp.com/api/token", false);
    xmlHttp.send(null);
    return xmlHttp.responseText;
};

function WebSocketTest() {
    if ("WebSocket" in window) {
        console.log("WebSocket is supported by your Browser!");
        // Let us open a web socket
        var ws = new WebSocket("ws://localhost:9998/echo");
        ws.onopen = function() {
            // Web Socket is connected, send data using send()
            ws.send("Message to send");
            console.log("Message is sent...");
        };
        ws.onmessage = function(evt) {
            var received_msg = evt.data;
            console.log("Message is received...");
        };
        ws.onclose = function() {
            // websocket is closed.
            console.log("Connection is closed...");
        };
    } else {
        // The browser doesn't support WebSocket
        console.log("WebSocket NOT supported by your Browser!");
    }
}

function initWebSocket() {
    var connection = new WebSocket('ws://cad-view.mybluemix.net/ws/awesome');
    console.log("new connection");
    // When the connection is open, send some data to the server
    connection.onopen = function() {
        console.log("connection opened");
        connection.send('Ping'); // Send the message 'Ping' to the server
    };

    // Log errors
    connection.onerror = function(error) {
        console.log('WebSocket Error ' + error);
    };

    // Log messages from the server
    connection.onmessage = function(e) {
        // console.log('Server: ' + e.data);
        setNewLook(JSON.parse(e.data));
    };

    // connection.send('your message');
};

function setNewLook(coords) {
    var camLeft = vLeft.navigation.getCamera();
    var camRight = vRight.navigation.getCamera();

    // camLeft.position.set( coords['roll'], coords['pitch'], coords['yaw'] );
    // camLeft.lookAt( vLeft.navigation.getPosition() );
    // camLeft.updateMatrix();
    
    vLeft.navigation.setView(new THREE.Vector3(coords['roll'], coords['pitch'], coords['yaw']), vLeft.navigation.getTarget());
    // vLeft.navigation.updateCamera();
    // vLeft.impl.applyCamer

 //    var zAxis = new THREE.Vector3(0, 0, 1);
	// var position = new vLeft.navigation.getPosition();
	// var newPosition = new THREE.Vector3(coords['roll'], coords['pitch'], coords['yaw']).normalize();
 //    camLeft.position.x = 
 //    console.log(newPosition);
	// var target = vLeft.navigation.getTarget();

}