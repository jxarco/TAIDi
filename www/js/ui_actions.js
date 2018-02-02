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
    
    if(type === TD.Task){
        target = $$("#tab-1");
        
        text += `
            <div class="card" id="card-0">
                <div class="card-header align-items-flex-end">` + element.to + 
                    (element.urgency === true ? urg_icon : "") +
                `</div>
                <div class="card-content card-content-padding">
                <p class="date">`+ element.timestamp + `</p><p>`+ 
                    element.name +
                `</p></div>
                <div class="card-footer"><a href="#" class="link">Complete</a>` + 
                // `<a href="#" class="link">Complete</a>` + 
                `</div>
            </div>
        `;
    }
    else
    {
        target = $$("#tab-2");

        text += `
            <div class="card" id="card-0">
                <div class="card-header">` + element.qnt + 
                    (element.urgency === true ? urg_icon : "") +
                `</div>
                <div class="card-content card-content-padding">` +
                    element.name +
                `</div>
                <div class="card-footer">` +
                    element.from +
                    `<i data-target="card-0" class="button button-round task-done">
                      <i class="icon material-icons md-only">more_horiz</i>
                    </i>
                </div>
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