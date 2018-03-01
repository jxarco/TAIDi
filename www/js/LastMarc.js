//TODO FALTAN CREAR LAS FUNCIONES DE DELETE EN EL GRUPO
// TODO FALTA PROBAR QUE FUNCIONEN

var deleteTask = function(taskName) {

	var task = null;
	
	for (var i = 0; (i < globals.user.currentGroup.tasks.length) && founded == false; i++) {
		var auxTask = globals.user.currentGroup.tasks[i];
		if (auxTask.name == auxTask) {
			task = auxTask;
			founded = true;
		}
	}

	if (task != null) {
		if (globals.user && globals.user.currentGroup) {
			globals.user.currentGroup.deleteTask(task);
			UI.refreshMain();
			createToast( "Done!", 2500 );
		} else {
			console.warn( "No user logged" );
		}
	}
};

var deleteItem = function(itemName) {
	
	var item = null;
	
	for (var i = 0; (i < globals.user.currentGroup.items.length) && founded == false; i++) {
		var auxItem = globals.user.currentGroup.items[i];
		if (auxItem.name == itemName) {
			item = auxItem;
			founded = true;
		}
	}

	if (item != null) {
		if (globals.user && globals.user.currentGroup) {
			globals.user.currentGroup.deleteItem(item);
			UI.refreshMain();
			createToast( "Done!", 2500 );
		} else {
			console.warn( "No user logged" );
		}
	}
};