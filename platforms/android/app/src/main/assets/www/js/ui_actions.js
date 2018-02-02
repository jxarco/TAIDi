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

    if(type === TD.Task){
        target = $$("#tab-1");

        var to = element.to,
            from = element.from,
            name = element.name,
            time = element.timestamp;

        text += `
            <div class="card" id="card-0">
                <div class="card-header">` +
                    to +
                `</div>
                <div class="card-content card-content-padding">` +
                    name +
                `</div>
                <div class="card-footer">` +
                    from +
                    `<i data-target="card-0" class="button button-round task-done">
                      <i class="icon material-icons md-only">more_horiz</i>
                    </i>`+
                    time +
                `</div>
            </div>
        `;
    }
    else
    {
        target = $$("#tab-2");

        var qnt = element.qnt,
            from = element.from,
            name = element.name;

        text += `
            <div class="card" id="card-0">
                <div class="card-header">` +
                    qnt +
                `</div>
                <div class="card-content card-content-padding">` +
                    name +
                `</div>
                <div class="card-footer">` +
                    from +
                `</div>
            </div>
        `;
    }

    target.prepend( text );

}

//$$(".task-done").on('click', function(){
//
//  var target = $$(this).data("target");
//
//  fw7.dialog.confirm(null, "Delete item?", function(){
//
//    $$("#" + target).remove();
//    fw7.toast.create({
//        closeTimeout: 3000,
//        closeButton: true,
//        text: "Item Deleted",
//    }).open();
//  }, function(){
//    console.log("aborted");
//  });
//
//});