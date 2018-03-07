var UI = {
    refresh: function(refresh_db_groups)
    {
        this.refreshGroups(refresh_db_groups);
        this.refreshMain();
    },
    
    refreshMain: function()
    {
        console.log("Refreshing homepage");

        // remove old cards/table
        $(".card").remove();
        $("#tab-2 .ptr-preloader").after(base_table);
        
        // inicializar tabla fw7 
        fw7.dataTable.create({
            el: ".data-table"
        });

        if(!globals.db || !globals.user.currentGroup){
            console.warn("No DB or group selected");
            return;
        }
        
        // Current group stuff
        var current_group = globals.user.currentGroup,
            tasks = globals.user.currentGroup.tasks,
            items = globals.user.currentGroup.items;
        
        setAppTitle( capitalizeFirstLetter( current_group.name ) );
        
        for(var i in tasks)
            createCard(TD.Task, tasks[i], i);
        for(var i in items)
            createCard(TD.Item, items[i]);
    },

    refreshGroups: function(update_db)
    {
        var refresh_selector = function()
        {
            // limpiar opciones anteriores
            $$(".added-group").remove();

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
              var text_block, 
                  name = capitalizeFirstLetter( user_groups[i].name );
              user_groups[i].name = name;

              if(i === 0)
              {
                  setAppTitle( name );
                  globals.user.currentGroup = new TD.Group(user_groups[0]);

                  $$('#share-id').val( user_groups[0].share_id );
                  $$("#sfo").html( name );
                  $$("#sfo").attr( "value", name );
                  globals.smartSelect.valueEl.innerHTML = name;
              }
              else
              {
                  // importante el added group para resetearlas después
                  text_block = "<option class='added-group' value='" + name + "'>" + name + "</option>";
                  optionsText += text_block;
              }
            }
            $$("#connectedGroups").append( optionsText );
        };
        
        if(update_db && globals.db)
            globals.db.update(function(){
                globals.db.updateGroups();
                refresh_selector();
            });
        else if(!update_db)
            refresh_selector();
    }
}

function createCard(type, element, uid)
{
    var NO_UID = -1,
        EXAMPLE_UID = -2;
        
    element.urgency = JSON.parse(element.urgency);
    var text = "",
        nCard = TD.LastCardID,
        uid = uid || -1;

    if(type === TD.Task)
    {
        if(uid === NO_UID)
            console.error("No task uid");

        text += `
            <div class="card" id="card-` + nCard + `">
                <div class="card-header align-items-flex-end">` + element.to +
                    (element.urgency === true ? urg_icon : "") +
                `</div>
                <div class="card-content card-content-padding">
                <p class="date">`+ element.timestamp + `</p><p>`+
                    element.name +
                `</p></div>` +
                (uid === EXAMPLE_UID ? `<div class="card-footer"><a class="button" data-target="` : `<div class="card-footer"><a class="button complete-task" data-target="`) +
                    "card-" + nCard +
                `" data-uid="` + uid +
                `">Completar</a>` +
                `</div>
            </div>
        `;
        
        TD.LastCardID += 1;
        $("#tab-1 .ptr-preloader").after( text );
    }
    else
    {
        var table_row = document.createElement("tr");
        text += `
            <td class="checkbox-cell">
              <label class="checkbox">
                <input type="checkbox">
                <i class="icon-checkbox"></i>
              </label>
            </td>
            <td class="label-cell">` + element.name + `</td>
            <td class="numeric-cell">` + element.qnt + `</td>
          `;
        table_row.innerHTML = text;
        table_row.setAttribute("data-key", element.name);
        $$("#shop-list-content").append( table_row );
    }

    bindListCardEvents();
    bindTaskCardEvents();
}

var assignTask = function() {

	var from = globals.user ?
                    ( globals.user.name ? globals.user.name : globals.user.uid )
                    : "Me",
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
};

var addItemToList = function() {

	var from = globals.user ?
                    ( globals.user.name ? globals.user.name : globals.user.uid )
                    : "Me",
		more = getDOMValue('textarea[placeholder="Comentarios"]'),
		name = getDOMValue('input[placeholder="Nombre del elemento"]'),
        timestamp = new Date().toDateString(),
		qnt = getDOMValue('input[placeholder="Cantidad"]'),
		urgency = globals.URGENT_TASK ? globals.URGENT_TASK : false;

    if(from == "" || name == "")
    {
        createToast( "Rellena los huecos!", 2000, true );
        return;
    }

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
};

var bindTaskCardEvents = function()
{
    // unbind last events to prevent double bindings
    $$(".complete-task").prop('onclick',null).off('click');
    // bind click event to new buttons
    $$(".complete-task").on('click', function(e){

        var target = $$(this).data("target");
        var task_uid = $$(this).data("uid");
        fw7.dialog.confirm("¿Estas seguro?", null, function(){

            var pressed = false;
            var onPressed = function(){ 
                if(!pressed){
					if(globals.user.currentGroup) {
                        $("#" + target).remove();
                        globals.user.currentGroup.completeTask( task_uid );
                    }
                    else
                        createToast( "Selecciona un grupo antes", 2500);
                }
            }

            $("#" + target).slideUp();
            createToast(null, null, null, {
                text: '¡Hecho!',
                closeTimeout: 4000,
                closeButton: true,
                closeButtonText: 'Deshacer',
                on: {
                    closeButtonClick: function() {
                        pressed = true;
                        $("#" + target).slideDown();
                    }
                  }
            });

            // delete card if no UNDO
            setTimeout(onPressed, 4000);
        });
    });
};

var bindListCardEvents = function()
{
    // unbind last events to prevent double bindings
    $$("#delete-selection").prop('onclick',null).off('click');
    // bind click event to new buttons
    $$("#delete-selection").on('click', function(e){

        var target = $(".data-table-row-selected");
        var pressed = false;
        var onPressed = function(){ 
            if(!pressed){
                if(globals.user.currentGroup) {
                    target.remove();
                    // pass entire target, iterate it and remove from DB each item
                    globals.user.currentGroup.removeItem( target );
                }
                else
                    createToast( "Selecciona un grupo antes", 2500);
            }
        }

        target.fadeOut();
        $(".data-table.data-table-init.card").removeClass("data-table-has-checked");
        createToast(null, null, null, {
          text: '¡Hecho!',
          closeTimeout: 4000,
          closeButton: true,
          closeButtonText: 'Deshacer',
          on: {
              closeButtonClick: function() {
                  pressed = true;
                  target.fadeIn();
                  $(".data-table.data-table-init.card").addClass("data-table-has-checked");
              }
            }
        });

        // delete card if no UNDO
        setTimeout(onPressed, 4000);
        
    });
    
    $$("#sort-items").prop('onclick',null).off('click');
    $$("#sort-items").on('click', function(e){

        // remove old cards/table
        $("#tab-2 .card").remove();
        $("#tab-2 .ptr-preloader").after(base_table);
        
        // inicializar tabla fw7 
        fw7.dataTable.create({
            el: ".data-table"
        });

        if(!globals.db || !globals.user.currentGroup){
            console.warn("No DB or group selected");
            return;
        }
        
        // Current group stuff
        var current_group = globals.user.currentGroup,
            items = globals.user.currentGroup.items;
        
        // reorder elements by urgency
        var keysSorted = Object.keys(items).sort(function(a,b){
            return new Date(items[a].timestamp) > new Date(items[b].timestamp)
        }), itemsSorted = {};
                
        for(var i = 0; i< keysSorted.length; i++)
        {
            var key = keysSorted[i],
                value = items[key];
            itemsSorted[key] = value;
        }
        
        for(var i in itemsSorted)
            createCard(TD.Item, itemsSorted[i]);
        
        createToast( "Ordenado por antigüedad", 2500, true );
    });
};

// bind in example cards
bindTaskCardEvents();
bindListCardEvents();

// HTML structures

var urg_icon = `<div class="chip">
    <div class="chip-media bg-color-red">
      <i class="icon material-icons md-only">alarm</i>
    </div>
    <div class="chip-label">Urgente</div>
  </div>`;

// reconstruct card for shopping_list
var base_table = `
  <div class="data-table data-table-init card">
    <!-- Card header -->
    <div class="card-header">
      <!-- Default table header -->
      <div class="data-table-header">
        <!-- Default table title -->
        <div class="data-table-title">Lista de la compra</div>
        <!-- Default table actions -->
        <div class="data-table-actions">
          <a class="link icon-only" id="sort-items">
            <i class="icon material-icons md-only">sort</i>
          </a>
        </div>
      </div>
      <!-- Selected table header -->
      <div class="data-table-header-selected">
        <!-- Selected table title -->
        <div class="data-table-title-selected"><span class="data-table-selected-count"></span> items seleccionados</div>
        <!-- Selected table actions -->
        <div class="data-table-actions">
          <a class="link icon-only" id="delete-selection">
            <i class="icon material-icons md-only">delete</i>
          </a>
        </div>
      </div>
    </div>
    <div class="card-content">
      <table>
        <thead>
          <tr>
            <th class="checkbox-cell">
              <label class="checkbox">
                <input type="checkbox">
                <i class="icon-checkbox"></i>
              </label>
            </th>
            <th class="label-cell">Seleccionar todo</th>
            <th class="numeric-cell">Cantidad</th>
          </tr>
        </thead>
        <tbody id="shop-list-content">
        </tbody>
      </table>
    </div>
  </div>

`;