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

function getFromDB(unit, path, callback, on_error)
{
    // Get a database reference to our posts
    var db = firebase.database();
    var ref = db.ref(unit + "/" + path);

    // Attach an asynchronous callback to read the data at our posts reference
    ref.on("value", function(snapshot) {
        data = snapshot.val();
        if(callback)
            callback(data);
    }, function (errorObject) {
      console.log("The read failed: " + errorObject.code);
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
