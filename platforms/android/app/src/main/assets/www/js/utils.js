function log(param){ console.log(param); }

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

function writeToDB(params)
{

}

function getFromDB(read_mode, unit, path, callback, on_error)
{
    // Get a database reference to our posts
    var db = firebase.database();
    var ref = db.ref(unit + "/" + path);

    // Attach an asynchronous callback to read the data at our posts reference
    switch(read_mode)
    {
      case TD.ON:
        ref.on("value", function(snapshot) {
            data = snapshot.val();
            if(callback)
                callback(data);
        }, function (errorObject) {
          console.log("The read failed: " + errorObject.code);
        });
      break;
      case TD.ONCE:
        ref.off();
        ref.once("value", function(snapshot) {
            data = snapshot.val();
            if(callback)
                callback(data);
        }, function (errorObject) {
          console.log("The read failed: " + errorObject.code);
        });
      break;
    }
}


// ******** FW7 ********

function createLoadDialog( text )
{
    fw7.dialog.preloader( text );
}

function createToast( text, duration, closeButton, params)
{
    if(params)
    {
        fw7.toast.create(params).open();    
        return;
    }
    
    fw7.toast.create({
        closeTimeout: duration,
        closeButton: closeButton ? false : true,
        text: text,
    }).open();
}