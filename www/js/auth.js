// ******** FIREBASE ********

function signIn_FB(name, mail, password)
{
    firebase.auth().signInWithEmailAndPassword(mail, password).catch(function(error){
        console.error( "Error " + error.code + ": " + error.message );
        throw("login error!");
    });
    
    firebase.auth().onAuthStateChanged(function(user)
    {
        if(user){

            if(!user.displayName)
                user.updateProfile({
                    displayName: name
                })
            
            globals.user = new TD.User({
                uid: user.uid,
                name: user.displayName,
                email: user.email
            });

            // init db!!!!
            globals.db = new TD.DataBase();
            globals.db.init( onUserLogged );
            // ****************
        }
    });
}

function signUp_FB(mail, password)
{
    firebase.auth().createUserWithEmailAndPassword(mail, password).catch(function(error){
        console.error( "Error " + error.code + ": " + error.message );
        throw("registering error!");
    });
}
