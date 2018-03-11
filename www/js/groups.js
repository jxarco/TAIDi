function createGroup()
{
    var name        = $$('#new-group-form [placeholder="Nombre de grupo"]').val();
    var share_id    = $$('#new-group-form [id="share-id-form"]').val();
    
    var groupId = globals.db.n_groups;
    var fullPath = groupId;
    var content = {
        uid: "hg"+groupId,
        items: new Array(),
        tasks: new Array(),
        members: [
            globals.user.uid
        ],
        log: new Array(),
        share_id: share_id,
        name: name
    }
    writeToDB("groups", fullPath, content, function(){
        // actualizar grupos UI
        // ...();
        createToast( "Grupo '" + name + "' creado", 2000 );
        writeToDB("n_groups", "", ( parseInt( globals.db.n_groups ) + 1 ));
    });
}

function editGroup()
{
    var name = $$('#edit-group-form [placeholder="Nombre de grupo"]').val();
    
    var groupId = globals.user.currentGroup.uid;
    var fullPath = groupId.slice(2, groupId.length) + "/name/";
	
    writeToDB("groups", fullPath, name, function(){
        createToast( "El nombre ha cambiado", 2000 );
		UI.refresh(TD.REFRESH_GROUPS, TD.KEEP_GROUP);
        setAppTitle( name );
    });
}

function GROUPbyShareID( id )
{
    for(var i = 0; i < globals.db.n_groups; i++)
        if(globals.db.groups[i].share_id === id)
            return globals.db.groups[i];
}

function joinGroup( share_id )
{
    // search group to join by share_id
    var group = GROUPbyShareID(share_id);
    var groupId = group.uid;
    groupId = groupId.slice(2, groupId.length);
    
    var fullPath = groupId+"/members/";
    // get current members
    var content = globals.db.groups[groupId].members;
    // push the user uid
    globals.db.groups[groupId].members.push( globals.user.uid );
    // write it to DB
    writeToDB("groups", fullPath, content, function(){
        UI.refresh();
        createToast( "Ahora eres miembro de ' " + capitalizeFirstLetter(group.name) + " '", 3000 );
    });
    
    fullPath = groupId+"/namers/"+globals.user.name;
    var content = globals.user.uid;
    // write it to DB
    writeToDB("groups", fullPath, content);
}

function leaveGroup( share_id )
{
    // search group to leave by share_id
    var group = GROUPbyShareID(share_id),
        groupId = group.uid;
    groupId = groupId.slice(2, groupId.length);
    
    var index = group.members.indexOf( globals.user.uid ),
        fullPath = groupId+"/members/"+index;
    
    // delete it from DB
    deleteFromDB("groups", fullPath);
    UI.refresh(true);
//    setUserCurrentGroup( globals.user.groups[0].name );
    
    fullPath = groupId+"/namers/"+globals.user.name;
    deleteFromDB("groups", fullPath);
}

$("#leave-group").click(function(){
    
    if(!globals.user.currentGroup)
    {
        createToast("No tienes grupo", 2000);
        return;
    }
    
   fw7.dialog.prompt( "Inserta ID", function(id){
       leaveGroup( id );
   })
});

$("#join-group").click(function(){
   fw7.dialog.prompt( "Inserta ID", function(id){
       joinGroup( id );
   })
});

$("#stats").click(function(){
    
    if(!globals.user.currentGroup)
    {
        createToast("No tienes grupo", 2000);
        return;
    }
    
    // get info from log and insert it
    var log = globals.user.currentGroup.log;
    $("#log-tasks").empty();
    
    for(var entry in log)
    {
        var text = `<li>
                      <div class="item-content item-input">
                        <div class="item-inner">
                            <div class="item-title item-label" style="margin-top: -12px;">Tarea: ` + log[entry].name + `</div><br>
                            <div class="item-title item-label" style="margin-top: -12px;">Realizada por: ` + log[entry].to + `</div><br>
                            <div class="item-title item-label" style="margin-top: -12px;">Asignada por: ` + log[entry].from + `</div><br>
                            <div class="item-title item-label" style="margin-top: -12px;">Comentarios: ` + log[entry].more + `</div><br>
                            <div class="item-title item-label" style="margin-top: -12px;">Fecha: ` + log[entry].timestamp + `</div><br>
                          <div class="item-title item-label" style="margin-top: -12px; color: #ddd">` + "__________________" + `</div>
                        </div>
                      </div>
                    </li>`;
        $("#log-tasks").append( text );
    }
    
   globals.stats_popup.open();
});