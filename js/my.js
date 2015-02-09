var vLeft, vRight, controls;

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
    vLeft = new Autodesk.Viewing.Viewer3D(viewerElement, {});
    viewerElement = document.getElementById('viewerRight');
    vRight = new Autodesk.Viewing.Viewer3D(viewerElement, {});

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
    console.log([coords['roll'], coords['pitch'], coords['yaw']]);
    vLeft.navigation.setView(new THREE.Vector3(coords['roll'], coords['pitch'], coords['yaw']), vLeft.navigation.getTarget());
    vRight.navigation.setView(new THREE.Vector3(coords['roll'], coords['pitch'], coords['yaw']), vLeft.navigation.getTarget());
}

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