function isInArray(array, element)
{
    for(var i = 0; i < array.length; i++)
    {
        if(element.constructor != String && element.constructor != Number)
            throw("element type not supported");
        
        if(array[i] === element)
            return true;
    }
    return false;
}

function writeSetOnDB(path, uid, name, members)
{
  firebase.database().ref( path + "/0" ).push({
    "uid": uid,
    "name": name,
    "members": members
  });
}

function getFromDB(unit, path, callback)
{
    var root_ref = firebase.database().ref().child(unit), data = null;
    root_ref.on("value", function(snap){
        data = snap.child(path).val();
        if(callback)
            callback(data);
    });
}
