// Dom7
var $$ = Dom7, fw7;
var globals = {
    mainView: null,
    smartSelectView: null,
    smartSelect: null,

    user: null,
    db: null,

    default_items: ["Tomates","Peras","Huevos","Kitkat","Papel WC","Naranjas","Mandarinas","Fuet","Cacaolat",
                   "Fanta","Cocacola","Cerveza","Leche","Miel","Galletas","Pizza","Macarrones","Tallarines","Atún",
                   "Mermelada","Zanahoria","Lechuga","Chorizo","Melón","Sandía","Azúcar","Sal","Yogurts","Queso",
                   "Calabacin","Cebolla","Champú","Gel de baño","Pastillas LV","Suavizante","Galets","Quinoa","Cus-cus",
                   "Lentejas","Judías","Carne picada","Lomo","Pinchos","Café","Nesquik","Pan de molde","Tomate frito",
                   "Patatas","Patatas fritas","Tortitas","Nueces","Garbanzos","Queso burgos","Helados"
   ],
    default_tasks: [
            "Poner lavadora","Poner secadora","Pasar la aspiradora","Fregar los platos","Pasar la mopa","Ordenar la habitación","Barrer la habitación","Limpiar el polvo","Limpiar las ventanas","Tender la ropa","Hacer el baño","Limpiar cocina","Hacer la compra","Lavar el coche","Pasar la ITV","Ir al banco","Sacar dinero"
    ],
    default_units: [
        "L","Kgr.","Gr.","Bolsa/s","Cartón","Barra/s","Paquete/s","Botella/s"     
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
