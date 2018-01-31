// Dom7
var $$ = Dom7;
var globals = {
    mainView: null,
    smartSelectView: null,
    toast: null,
    ss: null,

    currentUser: null,
    db: null
}

var app = {
    // Application Constructor
    initialize: function() {
        // init cordova
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);

        // init rest
        globals.mainView = fw7.views.create('.view-main');
        globals.smartSelectView = fw7.views.create('.view-smartie');
        globals.ss = fw7.smartSelect.get();

        globals.ss.onClose = function(){
            $$('#myAppTitle').html(globals.ss.selectEl.value);
        }

        globals.toast = fw7.toast.create({
          closeTimeout: 3000,
          closeButton: true,
          text: 'Item completed',
        });

        // init DB
        getFromDB("sets", "/", function(data){
            globals.db = data;
        });
    },

    // deviceready Event Handler
    //
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

var fw7 = new Framework7({
  // App root element
  root: '#app',
  // App id
  id: 'com.asm.project',
  // App Name
  name: 'My App',
  theme: 'auto',
  // Enable swipe panel
  panel: {
    swipe: 'left',
  },
  // Add default routes
  routes: routes,
  smartSelect: {
      openIn: 'popover'
  }
});

app.initialize();

// Login Screen Demo
$$('#my-login-screen .logup-button').on('click', function () {

    var username = $$('#my-login-screen [name="username"]').val();
    var password = $$('#my-login-screen [name="password"]').val();

    firebase.auth().createUserWithEmailAndPassword(username, password).catch(function(error){
        // handle errors here
        console.error( "Error " + error.code + ": " + error.message );
    })

    fw7.loginScreen.close('#my-login-screen');

    // Alert username and password
    fw7.dialog.alert('Username: ' + username + '<br>with password: ' + password + '<br>created in firebase');
});

$$('#my-login-screen .login-button').on('click', function () {

    var username = $$('#my-login-screen [name="username"]').val();
    var password = $$('#my-login-screen [name="password"]').val();

    firebase.auth().signInWithEmailAndPassword(username, password).catch(function(error){
        // handle errors here
        console.error( "Error " + error.code + ": " + error.message );
    });

    fw7.loginScreen.close('#my-login-screen');

    firebase.auth().onAuthStateChanged(function(user){
        if(user){
            globals.currentUser = {
                uid: user.uid,
                name: user.displayName,
                email: user.email
            };

            // Alert username and password
            // fw7.dialog.alert('User found in firebase');

            if(user.displayName)
                $$('#myUserName').html(user.displayName);

            // enable group selector
            $$("#groupSelector").css("display", "block");
            // display logout button
            $$("#logoutButton-row").css("display", "block");
            // remove login button
            $$(".connected-row").css("display", "none");

            // user sets
            var user_sets = [];

            for(var i = 0; i < globals.db.length; i++)
                if(isInArray( globals.db[i].members, globals.currentUser.uid ))
                    user_sets.push( globals.db[i] );

            var optionsText = "";
            for(var i = 0; i < user_sets.length; i++)
            {
                var text_block, name = user_sets[i].name;

                if(i === 0)
                {
                    $$("#sfo").html( name );
                    $$("#sfo").attr( "value", name );
                    globals.ss.valueEl.innerHTML = name;
                }
                else
                {
                    text_block = "<option value='" + name + "'>" + name + "</option>";
                    optionsText += text_block;
                }
            }

            $$("#connectedGroups").append( optionsText );

            if(user_sets[0])
                $$('#myAppTitle').html(user_sets[0].name);

            globals.currentUser.user_sets = user_sets;
        }
        else{
            // user signed out
        }
    })

});


$$('#my-login-screen .no-login-button').on('click', function () {

    fw7.loginScreen.close('#my-login-screen');
});

$$('#my-signup-screen .no-login-button').on('click', function () {

    fw7.loginScreen.close('#my-signup-screen');
});

$$("#logoutButton").on('click', function () {

    firebase.auth().signOut();

    $$('#myUserName').html("Not logged");
    $$('#myAppTitle').html("");

    // Disable group selector
    $$("#groupSelector").css("display", "none");
    // display logout button
    $$("#logoutButton-row").css("display", "none");
    // display login button
    $$(".connected-row").css("display", "block");
});


$$(".task-done").on('click', function(){

  var target = $$(this).data("target");

  fw7.dialog.confirm(null, "Delete item?", function(){

    $$("#" + target).remove();
    globals.toast.open();
  }, function(){
    console.log("aborted");
  });

});
