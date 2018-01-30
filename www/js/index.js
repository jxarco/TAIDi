// Dom7
var $$ = Dom7;
var globals = {
    mainView: null,
    smartSelect: null,

    currentUser: null
}

var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
        globals.mainView = fw7.views.create('.view-main');
        globals.smartSelect = fw7.views.create('.view-smartie');
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
                name: user.displayName,
                email: user.email,
                groups: ["first", "second"]
            };
            // Alert username and password
            fw7.dialog.alert('User found in firebase');
            
            if(user.displayName)
                $$('#myUserName').html(user.displayName);
            
            if(globals.currentUser.groups.length)
                $$('#myAppTitle').html(globals.currentUser.groups[0]);

            // set possible user groups
            /*for(var i = 0; i < globals.currentUser.groups.length; i++)
            {
                var text = globals.currentUser.groups[i];
                var selected = i === 0 ? "selected" : "";
                var text_block = "<option " + selected + " value='" + text + "'>" + text + "</option>";
                $$("#connectedGroups").append(text_block);
            }*/
            
            // enable group selector
            $$("#groupSelector").css("display", "block");
            // display logout button
            $$("#logoutButton-row").css("display", "block");
            // remove login button
            $$("#loginButton-row").css("display", "none");

        }else{
            // user signed out
        }
    })
    
});


$$('#my-login-screen .no-login-button').on('click', function () {
  
    fw7.loginScreen.close('#my-login-screen');
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
    $$("#loginButton-row").css("display", "block");
});
