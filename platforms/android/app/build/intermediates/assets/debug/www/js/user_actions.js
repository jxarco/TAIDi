function setAppTitle(text)
{
    $$('#myAppTitle').html( text );
}

function setUserCurrentGroup(name)
{
    setAppTitle( name );

    var gr = globals.user.groups;
    for(var i = 0; i < gr.length; i++)
        if(gr[i].name === name) globals.user.currentGroup = gr[i];

    updateMain();
}

var updateMain = function(){

    console.log("updating lists");
    $$(".card").remove();

    if(!globals.user.currentGroup)
        return;

    var tasks = globals.user.currentGroup.tasks,
        items = globals.user.currentGroup.items;
    // target: tab-1
    for(var i = 0; i < tasks.length; i++)
        createCard(TD.Task, tasks[i]);

    for(var i = 0; i < items.length; i++)
        createCard(TD.Item, items[i]);
};

var closeSignInScreen = function(){
    fw7.loginScreen.close('#my-login-screen');
};

var closeSignUpScreen = function(){
    fw7.loginScreen.close('#my-signup-screen');
};

var logout = function(){
    firebase.auth().signOut();

    $$('#myUserName').html("Not logged");
    $$('#myAppTitle').html("");

    // Disable group selector
    $$("#groupSelector").css("display", "none");
    // display logout button
    $$("#logoutButton-row").css("display", "none");
    // display login button
    $$(".connected-row").css("display", "block");
}

var login = function(){

    // loading DIALOG!!!
    app.dialog.preloader('Please wait');
    // ************

    var username = $$('#my-login-screen [name="username"]').val();
    var password = $$('#my-login-screen [name="password"]').val();

    firebase.auth().signInWithEmailAndPassword(username, password).catch(function(error){
        console.error( "Error " + error.code + ": " + error.message );
        throw("login error!");
    });

    closeSignInScreen();

    firebase.auth().onAuthStateChanged(function(user){
        if(user){

            globals.user = new TD.User({
                uid: user.uid,
                name: user.displayName,
                email: user.email
            });

            var login_process = function()
            {

              var user_name = globals.user.name;

              if(user_name)
              {
                  // welcome
                  fw7.toast.create({
                      closeTimeout: 3000,
                      closeButton: true,
                      text: "Welcome " + user_name + "!",
                  }).open();
                  // display user's name
                  $$('#myUserName').html( user_name );
              }

              // enable group selector
              $$("#groupSelector").css("display", "block");
              // display logout button
              $$("#logoutButton-row").css("display", "block");
              // remove login button
              $$(".connected-row").css("display", "none");

              if(!globals.db)
                  throw("not available db yet");
              else
                  console.log(globals.db);

              var groups = globals.db.groups,
                  n_groups = globals.db.n_groups,
                  user_groups = [],
                  optionsText = "";

              for(var i = 0; i < n_groups; i++)
                  if(isInArray( groups[i].members, globals.user.getUid() ))
                      user_groups.push( groups[i] );

              globals.user.setGroups( user_groups );

              for(var i = 0; i < user_groups.length; i++)
              {
                  var text_block, name = user_groups[i].name;

                  if(i === 0)
                  {
                      setAppTitle( user_groups[0].name );
                      globals.user.currentGroup = user_groups[0];

                      $$("#sfo").html( name );
                      $$("#sfo").attr( "value", name );
                      globals.smartSelect.valueEl.innerHTML = name;
                  }
                  else
                  {
                      text_block = "<option value='" + name + "'>" + name + "</option>";
                      optionsText += text_block;
                  }
              }

              $$("#connectedGroups").append( optionsText );
              updateMain();
              app.dialog.close();
            }

            // init db!!!!
            globals.db = TD.Setup( login_process );
            // ****************
        }
    });
};

// Login Screen Demo
$$('#my-signup-screen .logup-button').on('click', function () {

    var name        = $$('#my-signup-screen [name="name"]').val();
    var username    = $$('#my-signup-screen [name="username"]').val();
    var password    = $$('#my-signup-screen [name="password"]').val();

    firebase.auth().createUserWithEmailAndPassword(username, password).catch(function(error){
        console.error( "Error " + error.code + ": " + error.message );
        throw("registering error!");
    });

    // login(username, password);
    // firebase.auth().currentUser.updateProfile({
    //   displayName: name,
    // });

    closeSignInScreen();

    fw7.toast.create({
        closeTimeout: 3000,
        closeButton: true,
        text: "User created successfully",
    }).open();
});

$$('#my-login-screen .no-login-button').on('click', closeSignInScreen);
$$('#my-signup-screen .no-login-button').on('click', closeSignUpScreen);
$$('#my-login-screen .login-button').on('click', function(){
    login(null, null);
});
$$("#logoutButton").on('click', logout);
