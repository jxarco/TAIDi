function isInArray(array, element)
{
    for(var i = 0; i < array.length; i++)
    {
        if(element.constructor != String && element.constructor != Number)
            throw("element type not supported");
        
        if(array[i] === element)
            return true;
    }
    return false;
}

function writeToDB(params)
{
  
}

function getFromDB(unit, path, callback)
{
    var root_ref = firebase.database().ref().child(unit), data = null;
    root_ref.on("value", function(snap){
        data = snap.child(path).val();
        if(callback)
            callback(data);
    });
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
