//TODO FALTAN CREAR LAS FUNCIONES DE DELETE EN EL GRUPO
// TODO FALTA PROBAR QUE FUNCIONEN

var completeTask = function(name) {
	
	var pos = searchPosTaskByName(name);

	if (globals.user && globals.user.currentGroup) {
		globals.user.currentGroup.completeTask(pos);
		UI.refreshMain();
		createToast( "Done!", 2500 );
	} else {
		console.warn( "No user logged" );
	}
};

var deleteTask = function(name) {
	
	var pos = searchPosTaskByName(name);

	if (task != null) {
		if (globals.user && globals.user.currentGroup) {
			globals.user.currentGroup.removeTask(pos);
			UI.refreshMain();
			createToast( "Done!", 2500 );
		} else {
			console.warn( "No user logged" );
		}
	}
};

// TODO NO FUNCIONA..... SE HA DE ACABAR...
var deleteItem = function(name) {

	var pos = searchPosItemByName(name);

	if (item != null) {
		if (globals.user && globals.user.currentGroup) {
			globals.user.currentGroup.removeItem(pos);
			UI.refreshMain();
			createToast( "Done!", 2500 );
		} else {
			console.warn( "No user logged" );
		}
	}
};

function searchPosTaskByName(name) {
	
	var pos = -1;
	var founded = false;
	for (var i = 0; (i < globals.user.currentGroup.tasks.length) && (founded == false); i++) {
		var auxTask = globals.user.currentGroup.tasks[i];
		if (auxTask.name == name) {
			pos = i;
			founded = true;
		}
	}
	
	return pos;
	
}

function searchPosItemByName(name) {
	
	var pos = -1;
	var founded = false;
	
	for (var i = 0; (i < globals.user.currentGroup.items.length) && (founded == false); i++) {
		var auxItem = globals.user.currentGroup.items[i];
		if (auxItem.name == name) {
			pos = i;
			founded = true;
		}
	}
	
	return pos;
	
}

function searchTaskByName(name) {
	
	var task = null;
	var founded = false;
	for (var i = 0; (i < globals.user.currentGroup.tasks.length) && (founded == false); i++) {
		var auxTask = globals.user.currentGroup.tasks[i];
		if (auxTask.name == name) {
			task = auxTask;
			founded = true;
		}
	}
	
	return task;
	
}

function searchItemByName(name) {
	
	var item = null;
	var founded = false;
	
	for (var i = 0; (i < globals.user.currentGroup.items.length) && (founded == false); i++) {
		var auxItem = globals.user.currentGroup.items[i];
		if (auxItem.name == name) {
			item = auxItem;
			founded = true;
		}
	}
	
	return item;
	
}

function getTaskNameOfCard(cardNumber) {
	var p = $("#card-" + cardNumber + " .card-content > p")[1];
	return p.innerHTML;
}