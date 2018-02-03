var UI = {
    refreshMain: function()
    {
        console.log("Refreshing homepage");
        $$(".card").remove();

        if(!globals.db || !globals.user.currentGroup){
            console.error("No DB or group selected");
            return;
        }

        var tasks = globals.user.currentGroup.tasks,
            items = globals.user.currentGroup.items;

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
    var target, text = "";

        var urg_icon = `<div class="chip">
    <div class="chip-media bg-color-red">
      <i class="icon material-icons md-only">alarm</i>
    </div>
    <div class="chip-label">Urgent</div>
  </div>`;

    element.urgency = JSON.parse(element.urgency);
    var nCard = TD.LastCardID;

    if(type === TD.Task){
        target = $$("#tab-1");

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
    }
    else
    {
        target = $$("#tab-2");

        text += `
            <div class="card" id="card-` + nCard + `">
                <div class="card-header">` + element.qnt +
                    (element.urgency === true ? urg_icon : "") +
                `</div>
                <div class="card-content card-content-padding">` +
                    element.name +
                `</div>
                <div class="card-footer"><a class="button complete-item" data-target="` +
                    "card-" + nCard +
                `">Complete</a>` +
                `</div>
            </div>
        `;
    }

    target.prepend( text );
    TD.LastCardID += 1;

    bindTaskCardEvents();
}

var bindTaskCardEvents = function()
{
    // unbind last events to prevent double bindings
    $$(".complete-task").prop('onclick',null).off('click');
    // bind click event to new buttons
    $$(".complete-task").on('click', function(e){

        var target = $$(this).data("target");
        fw7.dialog.confirm("Are you sure?", null, function(){

            var pressed = false;
            var onPressed = function(){ if(!pressed) $("#" + target).remove();}

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
