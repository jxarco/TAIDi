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
    createToast( "Connected to: " + name, 2500, true );
}

var onUserLogged = function()
{
    var user_name = globals.user.name ? globals.user.name : "No name";

    console.warn("Login: " + user_name);
    createToast( "Welcome " + user_name + "!", 2000, true );
    $$('#myUserName').html( user_name );
    
    // display stuff
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
}

var logout = function(){

    firebase.auth().signOut();
    globals.user = null;
    globals.db = null;

    $$('#myUserName').html("Not logged");
    $$('#myAppTitle').html("");

    // Disable group selector
    $$("#groupSelector").css("display", "none");
    // display logout button
    $$("#logoutButton-row").css("display", "none");
    // display login button
    $$(".connected-row").css("display", "block");
}

var login = function()
{
    // UI EVENTS
    closeSignInScreen();
    createLoadDialog( "Cargando..." );
    //

    var username = $$('#my-login-screen [name="username"]').val();
    var password = $$('#my-login-screen [name="password"]').val();

    signIn_FB("Sin nombre", username, password);
};

var sign_up = function()
{
    var name        = $$('#my-signup-screen [name="name"]').val();
    var username    = $$('#my-signup-screen [name="username"]').val();
    var password    = $$('#my-signup-screen [name="password"]').val();
    
    // UI EVENTS
    closeSignUpScreen();
    createLoadDialog( "Introduciendo datos..." );
    //
    
    signUp_FB(username, password);
    // no sabemos cuándo acaba de el registro!!!
    setTimeout(function(){
        signIn_FB(name, username, password);    
        fw7.dialog.close();
        createToast( "Hola " + name + ", bienvenido a TAIDi", 2000, false );
    }, 2000);
    
};

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
$$('#my-login-screen .login-button').on('click', function(){
    login(null, null);
});
