// Dom7
var $$ = Dom7, fw7;
var globals = {
    mainView: null,
    smartSelectView: null,
    toast: null,
    smartSelect: null,

    user: null,
    db: null
}

var app = {
    // Application Constructor
    initialize: function() {
        // init cordova
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        this.receivedEvent('deviceready');
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

// cordova here!!!!
app.initialize();
// ****************
