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
    createToast( "Connected to: " + name, 2500, true );
}

var onUserLogged = function()
{
    var user_name = globals.user.name ? globals.user.name : "No name";

    console.warn("Login: " + user_name);
    createToast( "Welcome " + user_name + "!", 2000, true );
    $$('#myUserName').html( user_name );
    
    $$(".auto-refresh-hidden").css("display", "block");
    // enable group selector
    $$("#groupSelector").css("display", "block");
    // display logout button
    $$("#logoutButton-row").css("display", "block");
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
    createLoadDialog( "Please wait" );
    //

    var username = $$('#my-login-screen [name="username"]').val();
    var password = $$('#my-login-screen [name="password"]').val();

    signIn_FB(username, password);
};

var sign_up = function()
{
    // UI EVENTS
    closeSignUpScreen();
    createToast( "User created successfully", 2000, false );
    //

    var name        = $$('#my-signup-screen [name="name"]').val();
    var username    = $$('#my-signup-screen [name="username"]').val();
    var password    = $$('#my-signup-screen [name="password"]').val();

    signUp_FB(username, password);
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
