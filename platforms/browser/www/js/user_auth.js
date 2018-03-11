// ******** FIREBASE ********

function signIn_FB(mail, password, tmp_name)
{
    firebase.auth().signInWithEmailAndPassword(mail, password).catch(function(error){
        console.error( "Error " + error.code + ": " + error.message );
        throw("login error!");
    });
    
    firebase.auth().onAuthStateChanged(function(user)
    {
        if(user){
            
            globals.user = new TD.User({
                uid: user.uid,
                name: tmp_name || user.displayName,
                email: user.email
            });

            // init db!!!!
            globals.db = new TD.DataBase();
            globals.db.init( onUserLogged );
            // ****************
        }
    });
}

function processUser(user, name, mail, password)
{
    user.updateProfile({
        displayName: name
    });
    
    signIn_FB(mail, password, name);    
}

function signUp_FB(name, mail, password)
{
    firebase.auth().createUserWithEmailAndPassword(mail, password).then(function(user) {
        user = firebase.auth().currentUser || user;
        processUser(user, name, mail, password);
    }, function(error) {
        // Handle Errors here.
        console.error( "Error " + error.code + ": " + error.message );
        throw("registering error!");
    });
}

// ********************************************************************************

function setAppTitle(text)
{
    $$('#myAppTitle').html( text );
}

function setUserCurrentGroup(name, no_action)
{
    // abrimos el selector pero no tocamos nada
    if( no_action ) return;
    
    var gr = globals.user.groups;
    for(var i = 0; i < gr.length; i++)
        if(gr[i].name === name) globals.user.currentGroup = new TD.Group(gr[i]);

    UI.refreshMain();
    $$('#share-id').val( globals.user.currentGroup.share_id );
    createToast( "Conectado a: " + capitalizeFirstLetter(name), 3000, true );
}

var onUserLogged = function()
{
    var user_name = globals.user.name ? globals.user.name : "usuario";

    console.warn("Login: " + user_name);
    createToast( "Bienvenido " + user_name + "!", 2000, true );
    $$('#myUserName').html( user_name );
    
    // display stuff
    $$(".fab").css("display", "block");
    $$(".auto-refresh-hidden").css("display", "block");
    $$("#groupSelector").css("display", "block");
    $$(".share-id-row").css("display", "block");
    $$("#logoutButton-row").css("display", "block");
    $$("#right-panel").css("display", "block");
    // remove login button
    $$(".connected-row").css("display", "none");

    if(!globals.db)
        throw("DB is not available yet");
    else
        console.log("Using DB: ", globals.db);

    // refrescar todo
    UI.refresh();
    // remove loading dialog
    fw7.dialog.close();
    // *****   *****   *****
    
    // throw helping card    
    if(!globals.user.currentGroup)
    {
        console.log("Printing helper card");
        
        var help_card = {
            from: "TAIDi",
            more: "Nada interesante",
            name: "Puedes unirte a un grupo o crear uno desde 0 en el panel derecho.",
            timestamp: new Date().toDateString(),
            to: globals.user.name,
            urgency: true
        }
        createCard(TD.Task, help_card, -2);
    }
    
}

var login = function()
{
    // close previous session
    logout(true);
    
    // UI EVENTS
    closeSignInScreen();
    createLoadDialog( "Calentando motores..." );
    //

    var username = $$('#my-login-screen [name="username"]').val();
    var password = $$('#my-login-screen [name="password"]').val();
    
    // if remember me checked
    if(true)
    {
        localStorage.setItem("username", username );
        localStorage.setItem("password", password );
    }

    signIn_FB(username, password);
};

var sign_up = function()
{
    var name        = $$('#my-signup-screen [name="name"]').val();
    var username    = $$('#my-signup-screen [name="username"]').val();
    var password    = $$('#my-signup-screen [name="password"]').val();
    
    // UI EVENTS
    closeSignUpScreen();
    createLoadDialog( "Haciendo magia, espere..." );
    //
    
    signUp_FB(name, username, password);
};

var logout = function(keep_cards){

    firebase.auth().signOut();
    globals.user = null;
    globals.db = null;

    if(!keep_cards)
        $(".card").remove();
    
    $$('#myUserName').html("No identificado");
    $$('#myAppTitle').html("TAIDi");

    // hide stuff
    $$(".fab").css("display", "none");
    $$(".auto-refresh-hidden").css("display", "none");
    $$("#groupSelector").css("display", "none");
    $$(".share-id-row").css("display", "none");
    $$("#logoutButton-row").css("display", "none");
    $$("#right-panel").css("display", "none");
    // remove login button
    $$(".connected-row").css("display", "block");
}

var closeSignInScreen = function(){
    fw7.loginScreen.close('#my-login-screen');
};

var closeSignUpScreen = function(){
    fw7.loginScreen.close('#my-signup-screen');
};

// BUTTON EVENTS

$$('#my-login-screen .no-login-button').on('click', closeSignInScreen);
$$('#my-signup-screen .no-login-button').on('click', closeSignUpScreen);
$$('#my-signup-screen .logup-button').on('click', sign_up);
$$("#logoutButton").on('click', logout);
$$('#my-login-screen .login-button').on('click', login);
