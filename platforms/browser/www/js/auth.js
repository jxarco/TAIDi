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
