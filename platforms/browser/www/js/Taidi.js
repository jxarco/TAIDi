// Header
(function(global){

/**
 * Main namespace
 * @namespace TD
 */

/**
 * the global namespace, access it using TD.
 * @class .
 */

var TD = global.TD = {
	version: 1.0
};

TD.Task = 001;
TD.Item = 002;
TD.PreloadTimeOut = 1200;
    
TD.ONCE = 003;
TD.ON = 004;
    
TD.LastCardID = 0;
    
TD.KEEP_GROUP = true;
TD.REFRESH_GROUPS = true;

TD.Setup = function(callback)
{
    
}

/**
* @class User
* @methods
*/

function User(o)
{
    if(this.constructor !== TD.User)
		throw("You must use new to create TD.User");
	this._ctor();
	if(o)
		this.configure( o );
}

TD.User = User;

User.prototype._ctor = function()
{
    this.uid = null;
    this.name = "Sin nombre";
    this.email = "No mail";
    // list of connected groups (only its uid)
    this.groups = [];
    this.storage = {};
}

User.prototype.configure = function(o)
{
    //copy to attributes
	for(var i in o)
	{
		switch( i )
		{
			case "storage": //special case
				continue;
		};

		//default
		var v = this[i];
		if(v === undefined)
			continue;

		if( v && v.constructor === Float32Array )
			v.set( o[i] );
		else
			this[i] = o[i];
	}
}

User.prototype.getUid = function()
{
    return this.uid ? this.uid : undefined;
}

User.prototype.setGroups = function(groups)
{
    if(groups.length)
        {
            this.groups = groups;
            console.log("Groups added to current user");
        }
}

User.prototype.addGroup = function(params)
{

}

/**
* @class Set
* @methods
*/

function Group(o)
{
    if(this.constructor !== TD.Group)
		throw("You must use new to create TD.Group");
	this._ctor();
	if(o)
		this.configure( o );
}

TD.Group = Group;

Group.prototype._ctor = function()
{
    this.uid = null;
    this.share_id = null;
    this.name = "Sin nombre";
    
    this.tasks = {};    // dictionary of tasks
    this.items = {};    // dictionary of items
    this.namers = {};  // dictionary of member-name
    this.members = [];  // list of users (only its uid)
    
    this.log = {};
}

Group.prototype.configure = function(o)
{
    //copy to attributes
	for(var i in o)
	{
		switch( i )
		{
			case "special_case": //special case
				continue;
		};

		//default
		var v = this[i];
		if(v === undefined)
			continue;

		if( v && v.constructor === Float32Array )
			v.set( o[i] );
		else
			this[i] = o[i];
	}
}

Group.prototype.addTask = function(o)
{
    var unit = "groups";
    // task ID será un makeId 
    var taskId = makeid(8);
    var groupId = this.uid.slice(2, this.uid.length);
    var fullPath = groupId + "/tasks/" + taskId;
    
	writeToDB(unit, fullPath, o);
    globals.db.refresh();
}

// Only remove visual card and DB info
Group.prototype.removeTask = function( task_uid )
{
    var unit = "groups";
    var groupId = this.uid.slice(2, this.uid.length);
    
    var fullPathToDelete = groupId + "/tasks/" + task_uid;
	deleteFromDB(unit, fullPathToDelete);
    
    globals.db.refresh();
}

// Remove visual card and DB info and also write it in the log!!
Group.prototype.completeTask = function( task_uid )
{

	var unit = "groups";
    var groupId = this.uid.slice(2, this.uid.length);
    
    var fullPathToInsert = groupId + "/log/" + task_uid;
	writeToDB(unit, fullPathToInsert, this.tasks[task_uid]);
    
    var fullPathToDelete = groupId + "/tasks/" + task_uid;
	deleteFromDB(unit, fullPathToDelete);
    
    globals.db.refresh();
}

// Edit DB info of task and reload the DB info!!
Group.prototype.changeTaskInfo = function(taskId, task)
{

	var unit = "groups";
    var groupId = this.uid.slice(2, this.uid.length);
    
    var fullPath = groupId + "/tasks/" + taskId;
	writeToDB(unit, fullPath, task);
    
    globals.db.refresh();
}

Group.prototype.addItem = function(item)
{
	var unit = "groups";
    // it's the last item added so the identifier
    // will be: list size
    var itemId = item.name;
    var groupId = this.uid.slice(2, this.uid.length);
    var fullPath = groupId + "/items/" + itemId;
    
	writeToDB(unit, fullPath, item);
    globals.db.refresh();
}

Group.prototype.removeItem = function( selected_items )
{    
    var unit = "groups";
    var groupId = this.uid.slice(2, this.uid.length);
    
    for(var i = 0; i < selected_items.length; i++)
    {   
        var item = selected_items[i],
            key = item.getAttribute("data-key");
        
        var fullPathToDelete = groupId + "/items/" + key;
        deleteFromDB(unit, fullPathToDelete);
    }
    
    globals.db.refresh();
}

// Edit DB info of task and reload the DB info!!
Group.prototype.changeItemInfo = function(itemId, qnt)
{
	var unit = "groups";
    var groupId = this.uid.slice(2, this.uid.length);
    
    // only edit quantity (qnt key)!!!
    var fullPath = groupId + "/items/" + itemId + "/qnt";
	writeToDB(unit, fullPath, qnt);
    globals.db.refresh();
}

/**
* @class DataBase
* @methods
*/

function DataBase(o)
{
    if(this.constructor !== TD.DataBase)
		throw("You must use new to create TD.DataBase");
	this._ctor();
	if(o)
		this.configure( o );
}

TD.DataBase = DataBase;

DataBase.prototype._ctor = function()
{
    this.n_groups = 0;
    this.groups = [];
}

DataBase.prototype.configure = function(o)
{
    //copy to attributes
	for(var i in o)
	{
		switch( i )
		{
			case "special_case": //special case
				continue;
		};

		//default
		var v = this[i];
		if(v === undefined)
			continue;

		if( v && v.constructor === Float32Array )
			v.set( o[i] );
		else
			this[i] = o[i];
	}
}

DataBase.prototype.init = function(callback)
{
    console.warn("Filling DataBase, please wait");
    var that = this;

    getFromDB(TD.ONCE, "groups", "/", function(data){
        that.groups = data;
        getFromDB(TD.ONCE, "n_groups", "/", function(data){
            that.n_groups = data;
            // console.log( that );
            console.warn("DataBase loaded successfully");

            if(callback)
              	callback();
        });
    }, function(error){
        console.error(error);
    });
}

DataBase.prototype.update = function(callback)
{
    console.warn("Refilling DataBase, please wait");
    var that = this, read_mode = TD.ONCE;

    if(globals.auto_refresh)
        read_mode = TD.ON;
    
    getFromDB(read_mode, "groups", "/", function(data){
        that.groups = data;		
        getFromDB(read_mode, "n_groups", "/", function(data){
            that.n_groups = data;
            // console.log( that );
            console.warn("DataBase reloaded successfully");

            if(callback)
              	callback();
        });
    }, function(error){
        console.error(error);
    });
}

DataBase.prototype.updateGroups = function()
{
    if(!globals.user)
        throw( "No user connected" );
    
    var currentUID = globals.user.currentGroup.uid;
    var gr = globals.db.groups;
    
    for(var i = 0; i < gr.length; i++)
        if(gr[i].uid === currentUID) globals.user.currentGroup = new TD.Group(gr[i]);
}

DataBase.prototype.refresh = function()
{
    this.n_groups = null;
    this.groups = null;
    var that = this;

    this.update(function(){
            that.updateGroups();
			UI.refreshMain();
            ptr_done();
		});
}

// Footer
})( typeof(window) != "undefined" ? window : (typeof(self) != "undefined" ? self : global ) );
