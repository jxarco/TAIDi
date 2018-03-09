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

// @content can be anything (number, string, js object, ...)
// @fullPath has to include the key of the object where content will be added
function writeToDB(unit, fullPath, content, callback) {
	// Get a database reference to our posts
    var db = firebase.database();
    var ref = db.ref(unit + "/" + fullPath);
	if (ref) ref.set( content ).then(function(){
        if(callback)
            callback();
    });
}

function deleteFromDB(unit, path) {
	// Get a database reference to our posts
    var db = firebase.database();
    var ref = db.ref(unit + "/" + path);
	if (ref) ref.remove();
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

function ptr_done()
{
    fw7.ptr.get($$("#tab-1.ptr-content")).done();
    fw7.ptr.get($$("#tab-2.ptr-content")).done();
}

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
        closeButton: closeButton ? closeButton : false,
        text: text,
    }).open();
}

function getDOMValue(path) {
	var value = null;
	try {
		value = $(path).val();
	} catch (error) {
		log(error);
	}
	return value
}

function getDOMText(path) {
	var text = null;
	try {
		text = $(path).text();
	} catch (error) {
		log(error);
	}
	return text
}

function setDOMValue(path, value) {
	try {
		
		if ($(path) != null) { 
			value = $(path).val(value);
		} else {
			value = $(path).val("");
		}

	} catch (error) {
		log(error);
	}
}

function showTaskInfo(taskUid) {
	var task = globals.user.currentGroup.tasks[taskUid];
	if (task != null) {
		setDOMValue("#task-uid", taskUid);
		setDOMValue('textarea[placeholder="Notas importantes"]', task.more);
		setDOMValue('input[placeholder="Nombre de la tarea"]', task.name);
		setDOMValue('input[placeholder="Persona encargada"]', task.to);
	}
}

function showItemInfo(itemId) {
	var task = globals.user.currentGroup.items[itemId];
	if (task != null) {
		//setDOMValue("#item-id", itemId);
		setDOMValue('textarea[placeholder="Comentarios"]', item.more);
		setDOMValue('input[placeholder="Nombre del elemento"]', item.name);
		setDOMValue('input[placeholder="Cantidad"]', item.qnt);
	}
}

/*
* Capitalize or Uncapitalize first letter of a string
* passed as parameter
* return {string} result
*/

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function uncapitalizeFirstLetter(string) {
    return string.charAt(0).toLowerCase() + string.slice(1);
}

/*
* Make a random name 
* @param len {number} length of the resulting name
* return {string} result
*/

function makeid(len) {
  var text = "";
  var possible = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz123456789";

  for (var i = 0; i < len; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

// quitar despues esto
$("#debug").click(function(){
   signIn_FB("alex@gmail.com", "federico"); 
});