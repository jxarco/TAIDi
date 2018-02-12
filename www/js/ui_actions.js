var UI = {
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
            console.error("No DB or group selected");
            return;
        }

        var tasks = globals.user.currentGroup.tasks,
            items = globals.user.currentGroup.items; // NO se recoge este valor, no tengo ni idea del porque.
        
        for(var i = 0; i < tasks.length; i++)
            createCard(TD.Task, tasks[i]);
        for(var i = 0; i < items.length; i++)
            createCard(TD.Item, items[i]);

//        UI.refreshMain();
//        UI.refreshGroups();
    },

    refreshGroups: function()
    {

    }
}

function createCard(type, element)
{
    // console.log("creating card");
    var text = "";

    element.urgency = JSON.parse(element.urgency);
    var nCard = TD.LastCardID;

    if(type === TD.Task){

        text += `
            <div class="card" id="card-` + nCard + `">
                <div class="card-header align-items-flex-end">` + element.to +
                    (element.urgency === true ? urg_icon : "") +
                `</div>
                <div class="card-content card-content-padding">
                <p class="date">`+ element.timestamp + `</p><p>`+
                    element.name +
                `</p></div>
                <div class="card-footer"><a class="button complete-task" data-target="` +
                    "card-" + nCard +
                `">Complete</a>` +
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
        $$("#shop-list-content").append( table_row );
    }

    bindListCardEvents();
    bindTaskCardEvents();
}

var assignTask = function() {

	var from = globals.user ?
                    ( globals.user.name ? globals.user.name : globals.user.uid )
                    : "Me",
		more = getDOMValue('textarea[placeholder="Something to know"]'),
		name = getDOMValue('input[placeholder="Task name"]'),
		timestamp = new Date().toDateString(),
		to = getDOMValue('input[placeholder="Person name"]'),
		urgency = globals.URGENT_TASK ? globals.URGENT_TASK : false;

    if(from == "" || name == "" || to == "")
    {
        createToast( "Fill necessary gaps!", 2000, true );
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
        createToast( "Done!", 2500 );
    } else
        console.warn( "No user logged" );
};

var addItemToList = function() {

	var from = globals.user ?
                    ( globals.user.name ? globals.user.name : globals.user.uid )
                    : "Me",
		more = getDOMValue('textarea[placeholder="Something more?"]'),
		name = getDOMValue('input[placeholder="Item name"]'),
        timestamp = new Date().toDateString(),
		qnt = getDOMValue('input[placeholder="How many?"]'),
		urgency = globals.URGENT_TASK ? globals.URGENT_TASK : false;

    if(from == "" || name == "")
    {
        createToast( "Fill necessary gaps!", 2000, true );
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
        createToast( "Done!", 2500 );
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
        var targetNumber = target.slice(5, target.length);
        fw7.dialog.confirm("Are you sure?", null, function(){

            var pressed = false;
            var onPressed = function(){ 
                if(!pressed){
                    $("#" + target).remove();
                    if(globals.user.currentGroup) 
                        globals.user.currentGroup.removeTask( targetNumber );
                    else
                        createToast( "No group selected!", 2500);
                }
            }

            $("#" + target).slideUp();
            createToast(null, null, null, {
                text: 'Done! :)',
                closeTimeout: 3500,
                closeButton: true,
                closeButtonText: 'Undo',
                on: {
                    closeButtonClick: function() {
                        pressed = true;
                        $("#" + target).slideDown();
                    }
                  }
            });

            // delete card if no UNDO
            setTimeout(onPressed, 3000);
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
      fw7.dialog.confirm("Are you sure?", null, function(){

          var pressed = false;
          var onPressed = function(){ if(!pressed) target.remove();}

          target.fadeOut();
          createToast(null, null, null, {
              text: 'Done! :)',
              closeTimeout: 3500,
              closeButton: true,
              closeButtonText: 'Undo',
              on: {
                  closeButtonClick: function() {
                      pressed = true;
                      target.fadeIn();
                  }
                }
          });


            // delete card if no UNDO
            setTimeout(onPressed, 3000);
        });
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
    <div class="chip-label">Urgent</div>
  </div>`;

// reconstruct card for shopping_list
var base_table = `
  <div class="data-table data-table-init card">
    <!-- Card header -->
    <div class="card-header">
      <!-- Default table header -->
      <div class="data-table-header">
        <!-- Default table title -->
        <div class="data-table-title">Shopping List</div>
        <!-- Default table actions -->
        <div class="data-table-actions">
          <a class="link icon-only">
            <i class="icon material-icons md-only">sort</i>
          </a>
        </div>
      </div>
      <!-- Selected table header -->
      <div class="data-table-header-selected">
        <!-- Selected table title -->
        <div class="data-table-title-selected"><span class="data-table-selected-count"></span> items selected</div>
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
            <th class="label-cell">Select all</th>
            <th class="numeric-cell">Quantity</th>
          </tr>
        </thead>
        <tbody id="shop-list-content">
        </tbody>
      </table>
    </div>
  </div>

`;