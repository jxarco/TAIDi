// Dom7
var $$ = Dom7, fw7;
var globals = {
    mainView: null,
    smartSelectView: null,
    smartSelect: null,

    user: null,
    db: null,

    default_items: ["Tomates", "Peras", "Huevos", "Kitkat"],
    default_tasks: [
            "Poner lavadora","Poner secadora","Pasar la aspiradora","Fregar los platos","Pasar la mopa","Ordenar la habitación","Barrer la habitación",
            "Limpiar el polvo","Lavar las ventadas","Tender la ropa","Hacer el baño","Limpiar cocina"
        ]
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
