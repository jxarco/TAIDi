function assignTask()
{
	var from = globals.user ?
                    ( globals.user.name ? globals.user.name : globals.user.uid )
                    : "Usuario",
		more = getDOMValue('textarea[placeholder="Notas importantes"]'),
		name = getDOMValue('input[placeholder="Nombre de la tarea"]'),
		timestamp = new Date().toDateString(),
		to = getDOMValue('input[placeholder="Persona encargada"]'),
		urgency = globals.URGENT_TASK ? globals.URGENT_TASK : false;

    if(from == "" || name == "" || to == "")
    {
        createToast( "Rellena los huecos", 2000, true );
        return;
    }

    var toAssign = {
		from: from, more: more, name: name, timestamp: timestamp, to: to, urgency: urgency
	};

    if (globals.user && globals.user.currentGroup)
    {
        globals.user.currentGroup.addTask(toAssign);
        globals.URGENT_TASK = null;
        UI.refreshMain();
        createToast( "¡Hecho!", 2500 );
    } else
        console.warn( "No user logged" );
}

function addItemToList()
{
	var from = globals.user ?
                    ( globals.user.name ? globals.user.name : globals.user.uid )
                    : "Usuario",
		more = getDOMValue('textarea[placeholder="Comentarios"]'),
		name = getDOMValue('input[placeholder="Nombre del elemento"]'),
        timestamp = new Date().toDateString(),
		qnt = getDOMValue('input[placeholder="Cantidad"]'),
        units = getDOMValue('input[placeholder="Unidades (Opcional)"]'),
		urgency = globals.URGENT_TASK ? globals.URGENT_TASK : false;

    if(from == "" || name == "")
    {
        createToast( "Rellena los huecos!", 2000, true );
        return;
    }
    
    // use units in quantity
    if(units.length)
        qnt += " " + units;
    //

    var toAssign = {
		from: from, more: more, name: name, qnt: qnt, timestamp: timestamp, urgency: urgency
	};

    if (globals.user && globals.user.currentGroup)
    {
        globals.user.currentGroup.addItem(toAssign);
        globals.URGENT_TASK = null;
        UI.refreshMain();
        createToast( "¡Hecho!", 2500 );
    } else
        console.warn( "No user logged" );
}

function editTask()
{
	var from = globals.user ?
                    ( globals.user.name ? globals.user.name : globals.user.uid )
                    : "Me",
		more = getDOMValue('textarea[placeholder="Notas importantes"]'),
		name = getDOMValue('input[placeholder="Nombre de la tarea"]'),
		timestamp = new Date().toDateString(),
		to = getDOMValue('input[placeholder="Persona encargada"]'),
		urgency = globals.URGENT_TASK ? globals.URGENT_TASK : false;
		
	var task_uid = getDOMValue('#task-uid');

    if(from == "" || name == "" || to == "") {
        createToast( "Rellena los huecos", 2000, true );
    } else {
		var toEdit = {
			from: from, more: more, name: name, timestamp: timestamp, to: to, urgency: urgency
		};

		if (globals.user && globals.user.currentGroup)
		{
			globals.user.currentGroup.changeTaskInfo(task_uid, toEdit);
			globals.URGENT_TASK = null;
			UI.refreshMain();
			createToast( "¡Hecho!", 2500 );
		} else
			console.warn( "No user logged" );
	}
}

// This only supports editing quantity --> ENOUGH!!
function editItem(itemName, qnt)
{
    if(!qnt)
        return;
    
    // object key
	var itemId = itemName;

    if (globals.user && globals.user.currentGroup)
    {
        globals.user.currentGroup.changeItemInfo(itemId, qnt);
        UI.refreshMain();
        createToast( "¡Hecho!", 2500 );
    } else
        console.warn( "No user logged" );	
}