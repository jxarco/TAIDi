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
        // actualizar grupos UI
        // ...();
        createToast( "Ahora eres miembro de '" + group.name + "'", 2000 );
    });
}

$("#join-group").click(function(){
   fw7.dialog.prompt( "Inserta ID", function(id){
       joinGroup( id );
   })
});