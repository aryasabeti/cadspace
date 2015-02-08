	function loadDocument(viewer, documentId) {
	    // Find the first 3d geometry and load that.
	    Autodesk.Viewing.Document.load(documentId, function(doc) {// onLoadCallback
	    var geometryItems = [];
	    geometryItems = Autodesk.Viewing.Document.getSubItemsWithProperties(doc.getRootItem(), {
	        'type' : 'geometry',
	        'role' : '3d'
	    }, true);

	    if (geometryItems.length > 0) {
	        viewer.load(doc.getViewablePath(geometryItems[0]));
	    }
	 }, function(errorMsg) {// onErrorCallback
	    alert("Load Error: " + errorMsg);
	    });
	}

	function initialize(viewerID) {
	    var options = {
	        'document' : 'urn:dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6YXJpYS1idWNrZXQvUm9ib3RBcm0xLmR3Zng=',
	        'env':'AutodeskProduction',
	        'getAccessToken': getToken,
	        'refreshToken': getToken,
	        };
	    var viewerElement = document.getElementById(viewerID);
	    var viewer = new Autodesk.Viewing.Viewer3D(viewerElement, {});

	    Autodesk.Viewing.Initializer(options, function() {
	        viewer.initialize();
	        var u = options.document.urn;
	        console.log(["URN", options.document]);
	        loadDocument(viewer, options.document);
	    });
	};

	function getToken() {
        var xmlHttp = null;
        xmlHttp = new XMLHttpRequest();
        xmlHttp.open( "GET", "http://still-spire-1606.herokuapp.com/api/token", false );
        xmlHttp.send( null );
        return xmlHttp.responseText;
    };

    function myInit() {
    	initialize('viewerLeft');
		initialize('viewerRight');
    };